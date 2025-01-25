import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_FOLDER } from '../api/graphql'; // Ensure DELETE_FOLDER is correctly imported
import styles from '../Styles/_folder-item.module.css';

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

const FolderItem: FunctionComponent<{ folder: Folder; refetchFolders: () => void }> = ({ folder, refetchFolders }) => {
  const router = useRouter();
  const [deleteFolder] = useMutation(DELETE_FOLDER);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = () => {
    router.push(`/folder/${folder.folderId}`);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the folder "${folder.name}"?`)) return;

    setIsDeleting(true);
    try {
      await deleteFolder({
        variables: { folderId: folder.folderId },
      });
      refetchFolders(); // Refresh the folder list after deletion
    } catch (error) {
      console.error('Error deleting folder:', JSON.stringify(error, null, 2));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.folderItem}>
      <div className={styles.folderDetails} onClick={handleClick}>
        <div className={styles.folderIcon} />
        <h2 className={styles.folderName}>{folder.name}</h2>
      </div>

      <button
        className={styles.deleteButton}
        onClick={handleDelete}
        disabled={isDeleting} // Disable button while deleting
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
};

export default FolderItem;
