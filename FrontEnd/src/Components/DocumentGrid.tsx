import { FunctionComponent, useState, useEffect } from 'react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import styles from '../Styles/_documentGrid.module.css'
import { useRouter } from 'next/router';
import { deleteDocument, updateDocument, createOrFindDocument } from '../api/graphql';
import { shareDocument } from '../api/graph';
import { useApolloClient } from '@apollo/client'; // Apollo Client hook
import { useAccessibleDocuments, Document } from '../api/graph';



const DocumentGrid: FunctionComponent = () => {
  const [userId, setUserId] = useState<string | null>(null)
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    setUserId(storedUserId)
  })
  const [localDocuments, setLocalDocuments] = useState<Document[]>([]);
  const [newDocumentName, setNewDocumentName] = useState('Untitled document');
  const [showModal, setShowModal] = useState(false);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [editingDocumentName, setEditingDocumentName] = useState('');
  const [shareDocumentId, setShareDocumentId] = useState<string | null>(null);
  const [shareEmail, setShareEmail] = useState('');
  const [canWrite, setCanWrite] = useState(false);
  const router = useRouter();
  const { documents, loading, error } = useAccessibleDocuments(userId);

  const client = useApolloClient(); // Get the Apollo Client instance



  useEffect(() => {
    async function fetchDocuments() {
      try {
        if (userId) {
          setLocalDocuments(prevDocs => {
            // Only update if there are changes to avoid re-renders
            if (JSON.stringify(prevDocs) !== JSON.stringify(documents)) {
              console.log('Documents updated');
              return documents; // Update only if documents are different
            }
            return prevDocs; // Return the previous state if no change
          });
        }
      } catch (error) {
        console.error('Error fetching documents:', JSON.stringify(error, null, 2));
      }
    }

    fetchDocuments();
  }, [documents, userId])


  const generateDocumentId = (): string => uuidv4();

  const createDocument = async () => {
    if (newDocumentName.trim() && userId) {
      try {
        const documentId = generateDocumentId();
        const ownerId = userId;
        const newDocument = await createOrFindDocument(documentId, newDocumentName, ownerId);

        setLocalDocuments(prevDocs => [...prevDocs, newDocument]);
        setNewDocumentName('');
        setShowModal(false);
      } catch (error) {
        console.error('Error creating document:', error);
      }
    }
  };

  const handleUpdate = async () => {
    if (editingDocumentId && editingDocumentName.trim()) {
      try {
        const updatedDoc = await updateDocument(editingDocumentId, editingDocumentName, userId);
        setLocalDocuments(prevDocs =>
          prevDocs.map(doc =>
            doc.id === editingDocumentId ? { ...doc, name: updatedDoc.name } : doc
          )
        );
        setEditingDocumentId(null);
        setEditingDocumentName('');
      } catch (error) {
        console.error('Error updating document:', JSON.stringify(error, null, 2));
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id, userId);
      setLocalDocuments(prevDocs => prevDocs.filter(doc => doc.id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleShare = async () => {
    if (shareDocumentId && shareEmail.trim() && userId) {
      try {
        await shareDocument(client, shareDocumentId, shareEmail, canWrite, userId);


        alert('Document shared successfully!');

        // Reset form state after successful sharing
        setShareDocumentId(null);
        setShareEmail('');
        setCanWrite(false);

      } catch (error) {
        console.error('Error sharing document:', error);
      }
    }
  };

  // Use Effect to control Quill based on docEnable





  const handleCardClick = (id: string) => {
    router.push(`/document/${id}`);
  };

  const filteredDocuments = localDocuments.filter(doc => {
    if (doc.ownerId === userId) return true;
    const userShare = doc.shares?.find(share => share.userId === userId);
    return userShare?.canRead || false;
  });

  return (
    <div className={styles.container}>
      <button onClick={() => setShowModal(true)} className={styles.createButton}>
        Create New Document
      </button>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Create New Document</h2>
            <input
              type="text"
              className={styles.modalInput}
              value={newDocumentName}
              onChange={(e) => setNewDocumentName(e.target.value)}
              placeholder="Enter document name"
            />
            <div className={styles.modalButtons}>
              <button onClick={createDocument} className={styles.confirmButton}>
                Create
              </button>
              <button onClick={() => setShowModal(false)} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.documentGrid}>
        {loading && <p className={styles.loading}>Loading...</p>}
        {error && <p className={styles.error}>Error fetching documents: {JSON.stringify(error, null, 2)}</p>}
        {localDocuments.map((doc) => doc ? (
          <div key={doc.id} className={styles.documentCard}>
            <div className={styles.imageWrapper}>
              <Image
                src="/28510.jpg"
                alt={`Document ${doc.name}`}
                width={200}
                height={150}
                style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                onClick={() => handleCardClick(doc.id)}
                placeholder='empty'
                priority
                className={styles.documentImage}
              />
            </div>
            <h3 className={styles.documentTitle}>{doc.name}</h3>
            <p className={styles.documentId}>ID: {doc.id}</p>
            <div className={styles.buttonContainer}>
              <button
                className={`${styles.updateButton}`}
                onClick={() => {
                  setEditingDocumentId(doc.id);
                  setEditingDocumentName(doc.name);
                }}
              >
                Update
              </button>
              <button
                className={`${styles.deleteButton}`}
                onClick={() => handleDelete(doc.id)}
              >
                Delete
              </button>
              <button
                className={`${styles.shareButton}`}
                onClick={() => setShareDocumentId(doc.id)}
              >
                Share
              </button>

            </div>
          </div>
        ) : null)}
      </div>

      {editingDocumentId && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Update Document</h2>
            <input
              type="text"
              className={styles.modalInput}
              value={editingDocumentName}
              onChange={(e) => setEditingDocumentName(e.target.value)}
              placeholder="Enter new document name"
            />
            <div className={styles.modalButtons}>
              <button onClick={handleUpdate} className={styles.confirmButton}>
                Update
              </button>
              <button
                onClick={() => {
                  setEditingDocumentId(null);
                  setEditingDocumentName('');
                }}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {shareDocumentId && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Share Document</h2>
            <input
              type="email"
              className={styles.modalInput}
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              placeholder="Enter email to share with"
            />
            <label className={styles.checkboxLabel}>
              <div className={styles.checkboxContainer}>
                <p>Can Write</p>
                <input
                  className={styles.checkInput}
                  type="checkbox"
                  checked={canWrite}
                  onChange={(e) => setCanWrite(e.target.checked)}
                />
              </div>
            </label>
            <div className={styles.modalButtons}>
              <button onClick={handleShare} className={styles.confirmButton}>
                Share
              </button>
              <button
                onClick={() => {
                  setShareDocumentId(null);
                  setShareEmail('');
                  setCanWrite(false);
                }}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentGrid;
