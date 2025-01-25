import { useQuery, useMutation } from "@apollo/client";
import { GET_ROOT_FILES_BY_USER_ID, GET_ROOT_FOLDERS_BY_USER_ID, CREATE_FOLDER, GET_FILE_ACCESS_BY_USER } from "../../src/api/graphql";
import FolderItem from "../../src/Components/FolderItem";
import FileItem from "../../src/Components/FileItem";
import { useState } from "react";
import FileUpload from "../../src/Components/FileUpload";
import styles from "../../src/Styles/_rootPage.module.css"; // Correctly import the styles
import { useUserId } from "../../src/providers/useUserId";

export interface FBPFFile {
  userFileId: number;
  fileName: string;
}

export interface SubFolder {
  folderId: number;
  name: string;
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

interface User {
  username: string;
}

interface UserFile {
  userFileId: number;
  filePath: string;
  fileType: string;
  fileName: string;
  thumbnailPath?: string;
  uploadedByUserId: string;
  sasUri?: string;
  folderId: number;
}

interface SharedFile {
  userFileId: number;
  sharedWithUser: User;
  sharedByUser: User;
  userFile: UserFile;
}
const RootPage = () => {
  const { userId } = useUserId()
  const { data: fileData, loading: fileLoading, refetch: refetchRootFiles } = useQuery(GET_ROOT_FILES_BY_USER_ID, { variables: { userId } });
  const { data: folderData, loading: folderLoading, refetch: refetchRootFolders } = useQuery(GET_ROOT_FOLDERS_BY_USER_ID, { variables: { userId } });
  
  // Query for shared files
  const { data: sharedFilesData, loading: sharedFilesLoading, refetch: refetchSharedFiles } = useQuery(GET_FILE_ACCESS_BY_USER, { variables: { userId } });

  const [createFolder] = useMutation(CREATE_FOLDER);
  const [folderName, setFolderName] = useState<string>("");
 

  const handleCreateFolder = async () => {
    if (!folderName) return; // Do not submit if the folder name is empty
    try {
      await createFolder({
        variables: {
          name: folderName,
          userId: userId!,
          parentFolderId: null, // You can modify this if you want to add it under a specific parent folder
        },
      });
      setFolderName(""); // Clear the folder name after creation
      refetchRootFolders(); // Refetch folders after creation
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  if (folderLoading || fileLoading || sharedFilesLoading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>My Drive</h1>

      <div className={styles.actions}>
        <FileUpload uploadedByUserId={userId!} folderId={null} onUploadSuccess={refetchRootFiles} />

        <div className={styles.folderCreation}>
          <input
            type="text"
            value={folderName}
            className={styles.input}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name"
          />
          <button className={styles.button} onClick={handleCreateFolder}>Create Folder</button>
        </div>
      </div>

      <h2>Folders</h2>
      <div className={styles.grid}>
        {folderData?.getRootFoldersByUserId.map((folder: Folder) => (
          <FolderItem key={folder.folderId} folder={folder} refetchFolders={refetchRootFolders} />
        ))}
      </div>

      <h2>Your Files</h2>
      <div className={styles.grid}>
        {fileData?.getRootFilesByUserId.map((file: File) => (
          <FileItem key={file.userFileId} file={file} refetchFiles={refetchRootFiles} userId={userId} />
        ))}
      </div>

      <div className={styles.sharedFiles}>
        <h2>Shared Files</h2>
        <div className={styles.sharedFilesGrid}>
          {sharedFilesData?.getFileAccessByUser.map((sharedFile: SharedFile) => (
            <div key={sharedFile.userFileId} className={styles.sharedFileItem}>
              <p><strong>File:</strong> {sharedFile.userFile.fileName}</p>
              <p><strong>Shared by:</strong> {sharedFile.sharedByUser.username}</p>
              <FileItem file={sharedFile.userFile} refetchFiles={refetchSharedFiles} userId={userId} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RootPage;