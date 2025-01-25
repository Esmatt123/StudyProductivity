import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { GET_FILES_BY_PARENT_FOLDER_ID, GET_FOLDERS_BY_PARENT_FOLDER_ID, CREATE_FOLDER } from '../../src/api/graphql';
import FolderItem from '../../src/Components/FolderItem';
import FileItem from '../../src/Components/FileItem';
import Breadcrumbs from '../../src/Components/BreadCrumbs';
import { useState } from 'react';
import FileUpload from '../../src/Components/FileUpload';
import styles from '../../src/Styles/_folderPage.module.css'
import { useUserId } from '../../src/providers/useUserId';

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
const FolderPage = () => {
    const router = useRouter();
    const { folderId } = router.query;
    const folderNumber = folderId && typeof folderId === 'string' ? Number.parseInt(folderId) : NaN;
    const { userId } = useUserId()
    const { data: folderData, loading: folderLoading, refetch: refetchFolders } = useQuery(GET_FOLDERS_BY_PARENT_FOLDER_ID, {
        variables: { parentFolderId: folderNumber, userId },
    });
    const { data: fileData, loading: fileLoading, refetch: refetchFiles } = useQuery(GET_FILES_BY_PARENT_FOLDER_ID, {
        variables: { parentFolderId: folderNumber, userId },
    });

    const [createFolder] = useMutation(CREATE_FOLDER);
    const [folderName, setFolderName] = useState<string>("");
    

    const handleCreateFolder = async () => {
        if (!folderName) return; // Do not submit if the folder name is empty
        try {
            await createFolder({
                variables: {
                    name: folderName,
                    userId: userId!,
                    parentFolderId: folderNumber, // You can modify this if you want to add it under a specific parent folder
                },
                refetchQueries: [{ query: GET_FOLDERS_BY_PARENT_FOLDER_ID, variables: { folderNumber, userId } }],
            });
            setFolderName(""); // Clear the folder name after creation
        } catch (error) {
            console.error("Error creating folder:", error);
        }
    };


    if (folderLoading || fileLoading) return <div>Loading...</div>;

    const breadcrumbs = [{ id: 'files', name: 'Root' }, { id: `folder/${folderId}` as string, name: 'Current Folder' }];

    return (
        <div className={styles.container}>
            <Breadcrumbs path={breadcrumbs} />
            <h1>Folder Contents</h1>
                <div className="folders">
                    <FileUpload uploadedByUserId={userId!} folderId={folderNumber} />
                    <div className={styles.folderCreation}>
                        <input
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            placeholder="Enter folder name"
                        />
                        <button onClick={handleCreateFolder}>Create Folder</button>
                    </div>
                    <div className={styles.folders}>
                    {folderData?.getFoldersByParentFolderId.map((folder: Folder) => (
          <FolderItem key={folder.folderId} folder={folder} refetchFolders={refetchFolders} />
        ))}
                    </div>
                </div>
            <div className={styles.files}>
                {fileData?.getFilesByParentFolderId.map((file: File) => (
                    <FileItem key={file.userFileId} file={file} refetchFiles={refetchFiles} userId={userId}/> ))}
            </div>
        </div>
    );
};

export default FolderPage;
