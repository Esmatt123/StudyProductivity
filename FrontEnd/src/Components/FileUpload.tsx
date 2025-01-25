import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../Styles/_fileUpload.module.css';

interface UploadResult {
  filePath?: string;
  error?: string | null;
  fileSize?: number | null;
}

interface FileUploadProps {
  uploadedByUserId: string;
  folderId: number | number[] | null;
  onUploadSuccess?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ uploadedByUserId, folderId, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFileUrl, setModalFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const BACKEND_URL: string | undefined = process.env.NEXT_PUBLIC_VITE_BACKEND_URL;
  
  useEffect(() => {
    const token = localStorage.getItem("token")
    setToken(token)
  }, [])

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files ? event.target.files[0] : null);
  };

  // Handle form submission to upload file
  // Handle form submission to upload file
const handleUpload = async (event: React.FormEvent) => {
  event.preventDefault();
  if (!selectedFile) return;

  const formData = new FormData();
  formData.append('file', selectedFile);

  // Check if folderId is provided and is a number
  if (folderId !== null && !Array.isArray(folderId)) {
    formData.append('folderId', folderId.toString());
  }

  console.log(formData);

  setUploading(true);
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/fileupload/upload`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Extract metadata from the backend response
    const { filePath, fileSize, fileType, thumbnailPath } = response.data;

    // Update the upload result state
    setUploadResult({
      filePath,
      fileSize,
      error: null,
    });

    // Set fileType state for preview purposes
    setFileType(fileType);

    // Clear the selected file since upload is complete
    setSelectedFile(null);

    // Call the onUploadSuccess callback if provided
    if (onUploadSuccess) {
      onUploadSuccess();
    }
  } catch (error) {
    // Handle errors
    console.error('Error during file upload:', error);
    setUploadResult({ error: 'File upload failed. Please try again.' });
  } finally {
    setUploading(false);
  }
};

  // Handle opening the modal
  const openModal = (fileUrl: string) => {
    setModalFileUrl(fileUrl);
    setIsModalOpen(true);
  };

  // Prepend the correct base URL to the uploaded file path
  const getFileUrl = (filePath: string) => {
    return `${BACKEND_URL}${filePath}`;
  };

  return (
    <div>
      <h4>File Upload</h4>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={uploading || !selectedFile} className={styles.button}>
          Upload
        </button>
      </form>
      {uploading && <p className={styles.uploadingText}>Uploading...</p>}
      {uploadResult && (
        <div>
          {uploadResult.error ? (
            <p className={styles.errorText}>{uploadResult.error}</p>
          ) : (
            <div>
              <p>
                File uploaded successfully:{' '}
                <a
                  href="#"
                  onClick={() => openModal(getFileUrl(uploadResult.filePath!))}
                  className={styles.linkText}
                >
                  {uploadResult.filePath}
                </a>
              </p>

              {/* Display the image preview if the uploaded file is an image */}
              {fileType && ['jpg', 'jpeg', 'png', 'gif'].includes(fileType.toLowerCase()) && (
                <img
                  src={getFileUrl(uploadResult.filePath!)}
                  alt="Uploaded preview"
                  className={styles.uploadedImage}
                />
              )}

              {/* Display video preview if the uploaded file is a video */}
              {fileType && ['mp4', 'avi', 'mkv'].includes(fileType.toLowerCase()) && (
                <video controls style={{ width: '100%' }}>
                  <source src={getFileUrl(uploadResult.filePath!)} type={`video/${fileType}`} />
                  Your browser does not support the video tag.
                </video>
              )}

              {/* Display audio preview if the uploaded file is audio */}
              {fileType && ['mp3', 'wav'].includes(fileType.toLowerCase()) && (
                <audio controls>
                  <source src={getFileUrl(uploadResult.filePath!)} type={`audio/${fileType}`} />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;