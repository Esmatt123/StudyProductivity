import { FunctionComponent, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  DELETE_FILE_FOR_USER,
  GET_USER_FRIENDS,
  SHARE_FILE_ACCESS,
} from '../api/graphql';
import styles from '../Styles/_fileItem.module.css';

interface FriendUser {
  username: string;
}

interface Friend {
  friendUserId: string;
  friendUser: FriendUser;
}


// Update the File interface to make sasUri required if you're sure it will always be there
export interface SubFolder {
  folderId: number;
  name: string;
}

export interface FBPFFile {
  userFileId: number;
  fileName: string;
}

export interface Folder {
  folderId: number;  // Make this consistent across all uses
  name: string;
  userId: string;
  parentFolderId: number;
  subFolders?: SubFolder[];
  files?: FBPFFile[];
}

export interface File {
  userFileId: number;
  fileName: string;
  filePath: string;
  fileType: string;
  uploadedByUserId: string;
  folderId: number;
  thumbnailPath?: string;
  sasUri?: string;
}
const FileItem: FunctionComponent<{
  file: File;
  refetchFiles: () => void;
  userId: string | null;
}> = ({ file, refetchFiles, userId }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteFile] = useMutation(DELETE_FILE_FOR_USER);
  const [shareFile] = useMutation(SHARE_FILE_ACCESS);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [deleteForEveryone, setDeleteForEveryone] = useState<boolean>(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const {
    data: friendsData,
    loading: friendsLoading,
    error: friendsError,
  } = useQuery(GET_USER_FRIENDS, {
    variables: { userId: userId },
  });

  const handleFileClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleShareFile = async () => {
    if (selectedFriendId) {
      try {
        await shareFile({
          variables: {
            userFileId: file.userFileId,
            sharedWithUserId: selectedFriendId,
            sharedByUserId: userId,
          },
        });
        setShareModalOpen(false);
        refetchFiles();
      } catch (error) {
        console.error('Error sharing file:', error);
      }
    }
  };

  const handleDownload = () => {

    if (!file.sasUri) {
      console.error('No download URL available');
      return;
    }
    // Use the SAS URI for download
    const link = document.createElement('a');
    link.href = file.sasUri;
    link.download = file.fileName;
    link.click();
  };

  const renderDeleteModal = () => (
    <div className={styles.modal} onClick={() => setDeleteModalOpen(false)}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={() => setDeleteModalOpen(false)}
        >
          &times;
        </button>
        <h2>Delete File</h2>
        <p>
          Would you like to delete this file just for yourself or for everyone?
        </p>
        <button
          className={styles.deleteForSelfButton}
          onClick={() => {
            setDeleteForEveryone(false);
            handleDelete();
          }}
        >
          Delete for Yourself
        </button>
        <button
          className={styles.deleteForEveryoneButton}
          onClick={() => {
            setDeleteForEveryone(true);
            handleDelete();
          }}
        >
          Delete for Everyone
        </button>
      </div>
    </div>
  );

  const handleDelete = async () => {
    try {
      await deleteFile({
        variables: {
          fileId: file.userFileId,
          userId: userId,
          deleteForEveryone: deleteForEveryone,
        },
      });
      refetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const renderModalContent = () => {
    if (file.fileType.startsWith('image')) {
      return (
        <img
          src={file.sasUri}
          alt={file.fileName}
          className={styles.modalImage}
        />
      );
    } else if (file.fileType.startsWith('video')) {
      return (
        <video controls className={styles.modalVideo}>
          <source src={file.sasUri} type={file.fileType} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (file.fileType.startsWith('audio')) {
      return (
        <div>
          {file.sasUri && (
            <img 
              src={file.sasUri} 
              alt={file.fileName} 
              className={styles.modalImage} 
            />
          )}
          <audio controls className={styles.modalAudio}>
            <source src={file.sasUri} type={file.fileType} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    } else {
      return <p>Unsupported file type</p>;
    }
  };

  const isUploader = file.uploadedByUserId === userId;

  return (
    <div className={styles.fileItem}>
      <div onClick={handleFileClick}>
        {file.fileType?.startsWith('image') ? (
          <img
            className={styles.fileIcon}
            src={file.sasUri}
            alt={`${file.fileName} thumbnail`}
          />
        ) : (
          <img
            className={styles.fileIcon}
            src={file.thumbnailPath || '/default-thumbnail.jpg'}
            alt={`${file.fileName} thumbnail`}
          />
        )}
        <p className={styles.fileName}>{file.fileName}</p>
      </div>

      {!isUploader && (
        <button className={styles.downloadButton} onClick={handleDownload}>
          Download
        </button>
      )}

      <button
        className={styles.deleteButton}
        onClick={() => setDeleteModalOpen(true)}
      >
        Delete
      </button>
      <button
        className={styles.shareButton}
        onClick={() => setShareModalOpen(true)}
      >
        Share
      </button>

      {isModalOpen && (
        <div className={styles.modal} onClick={handleCloseModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={handleCloseModal}>
              &times;
            </button>
            {renderModalContent()}
          </div>
        </div>
      )}

      {isShareModalOpen && (
        <div className={styles.modal} onClick={() => setShareModalOpen(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={() => setShareModalOpen(false)}
            >
              &times;
            </button>
            <h2>Select a friend to share with:</h2>
            {friendsLoading ? (
              <p>Loading friends...</p>
            ) : friendsError ? (
              <p>Error loading friends</p>
            ) : (
              <div className={styles.scrollableDropdown}>
                <select
                  value={selectedFriendId || ''}
                  onChange={(e) => setSelectedFriendId(e.target.value)}
                >
                  <option value="" disabled>
                    Select a friend
                  </option>
                  {friendsData?.friends.map((friend: Friend) => (
                    <option key={friend.friendUserId} value={friend.friendUserId}>
                      {friend.friendUser.username}
                    </option>
                  ))}
                </select>
                <button onClick={handleShareFile}>Share</button>
              </div>
            )}
          </div>
        </div>
      )}

      {isDeleteModalOpen && renderDeleteModal()}
    </div>
  );
};

export default FileItem;