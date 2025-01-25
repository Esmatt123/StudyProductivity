import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_CONCEPTS, ADD_CONCEPT, UPDATE_CONCEPT, DELETE_CONCEPT, UPDATE_CONCEPT_LIST } from '../api/graphql';
import styles from '../Styles/_conceptList.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faEdit, faEye } from '@fortawesome/free-solid-svg-icons';

type Concept = {
    id: number;
    title: string;
    description: string;
};

type ConceptListProps = {
    id: number;
    title: string;
    userId: string | null;
    concepts?: ConceptType[];  // Add this line to include the concepts prop
    onListDelete: (id: number) => void;
};

type ConceptType = {
    id: number;
    title: string;
    description: string;
};





const ConceptList: React.FC<ConceptListProps> = ({ id, title, userId, onListDelete }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'add' | 'edit' | 'view' | 'editList' | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newConcept, setNewConcept] = useState({ title: '', description: '', userId: userId, conceptListId: id });
    const [currentConcept, setCurrentConcept] = useState<Concept | null>(null);
    const [listTitle, setListTitle] = useState(title);

    const { data, loading, error, refetch } = useQuery(GET_ALL_CONCEPTS, {
        variables: { userId: userId, conceptListId: id },
        fetchPolicy: 'network-only',
    });

    const [addConcept] = useMutation(ADD_CONCEPT);
    const [updateConcept] = useMutation(UPDATE_CONCEPT);
    const [deleteConcept] = useMutation(DELETE_CONCEPT);
    const [updateConceptList] = useMutation(UPDATE_CONCEPT_LIST);

    useEffect(() => {
        refetch(); // Ensure fresh data on mount or after updates
    }, [refetch]);

    // Calculate the total character count (title + description)
    const characterCount = newConcept.description.length;

    const handleSave = async () => {
        try {
            if (currentConcept && isEditing) {
                // Update the concept
                await updateConcept({
                    variables: { conceptInput: { id: currentConcept.id, ...newConcept, conceptListId: id } },
                });
            } else {
                // Add new concept
                await addConcept({
                    variables: { conceptInput: { ...newConcept, conceptListId: id } },
                });
            }
            refetch(); // Fetch updated concepts
            setModalOpen(false);
            setCurrentConcept(null);
            setNewConcept({ title: '', description: '', userId: userId, conceptListId: id });
        } catch (error) {
            console.error('Error saving concept:', error);
        }
    };

    const handleDeleteConcept = async (conceptId: number) => {
        try {
            await deleteConcept({ variables: { id: conceptId, userId: userId } });
            refetch(); // Fetch updated concepts after deletion
        } catch (error) {
            console.error('Error deleting concept:', error);
        }
    };

    const openEditModal = (concept: Concept) => {
        setCurrentConcept(concept);
        setNewConcept({ title: concept.title, description: concept.description, userId: userId, conceptListId: id });
        setIsEditing(true);
        setModalType('edit');
        setModalOpen(true);
    };

    const openAddConceptModal = () => {
        setIsEditing(false); // Set to add mode (not editing)
        setCurrentConcept(null); // No current concept for adding
        setNewConcept({ title: '', description: '', userId: userId, conceptListId: id });
        setModalType('add');
        setModalOpen(true);
    };

    const openViewConceptListModal = () => {
        setIsEditing(false); // Set to view mode (not editing or adding)
        setCurrentConcept(null); // No current concept for viewing
        setModalType('view');
        setModalOpen(true);
    };

    const handleUpdateListTitle = async () => {
        try {
            await updateConceptList({
                variables: { conceptListInput: { id, title: listTitle, userId } },
            });
            setModalOpen(false);
        } catch (error) {
            console.error('Error updating concept list title:', error);
        }
    };

    const openEditListModal = () => {
        setModalType('editList');
        setModalOpen(true);
    };

    return (
        <div className={styles.conceptList}>
            <h2 className={styles.title}>{title}</h2>

            <div className={styles.buttonContainer}>
                <button className={styles.editListButton} onClick={openEditListModal}>
                <FontAwesomeIcon icon={faEdit} /> 
                </button>
                <button className={styles.addButton} onClick={openAddConceptModal}>
                <FontAwesomeIcon icon={faPlus} /> 
                </button>
                <button className={styles.viewListButton} onClick={openViewConceptListModal}>
                <FontAwesomeIcon icon={faEye} /> 
                </button>
                <button className={styles.deleteListButton} onClick={() => onListDelete(id)}>
                <FontAwesomeIcon icon={faTrash} /> 
                </button>
            </div>

            {/* Modal for adding or editing concept */}
            {isModalOpen && modalType === 'add' && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalTitle}>Add Concept</h2>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="Title"
                            value={newConcept.title}
                            onChange={(e) => setNewConcept({ ...newConcept, title: e.target.value })}
                            maxLength={38}  // Set the max length to 70 characters
                        />
                        <textarea
                            className={styles.textarea}
                            placeholder="Description"
                            value={newConcept.description}
                            onChange={(e) => setNewConcept({ ...newConcept, description: e.target.value })}
                            maxLength={1001}
                        />
                        <button
                            className={styles.saveButton}
                            onClick={handleSave}
                            disabled={characterCount > 1000}
                        >
                            Save
                        </button>
                        <button className={styles.closeButton} onClick={() => setModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}

            {/* Modal for editing concept */}
            {isModalOpen && modalType === 'edit' && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalTitle}>Edit Concept</h2>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="Title"
                            value={newConcept.title}
                            onChange={(e) => setNewConcept({ ...newConcept, title: e.target.value })}
                            maxLength={30}
                        />
                        <textarea
                            className={styles.textarea}
                            placeholder="Description"
                            value={newConcept.description}
                            onChange={(e) => setNewConcept({ ...newConcept, description: e.target.value })}
                            maxLength={1001}
                        />
                        <button
                            className={styles.saveButton}
                            onClick={handleSave}
                            disabled={characterCount > 1000}
                        >
                            Save
                        </button>
                        <button className={styles.closeButton} onClick={() => setModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}

            {/* Modal for viewing concept list */}
            {isModalOpen && modalType === 'view' && !isEditing && !currentConcept && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalTitle}>Concept List</h2>
                        <div className={styles.scrollableList}>
                            {loading ? (
                                <p className={styles.loadingText}>Loading...</p>
                            ) : (
                                data?.getAllConcepts?.map((concept: Concept) => (
                                    <div key={concept.id} className={styles.conceptItem}>
                                        <div className={styles.textContainer}>
                                        <h3 className={styles.conceptTitle}>{concept.title}</h3>
                                        <p className={styles.conceptDescription}>{concept.description}</p>
                                        </div>
                                        <div className={styles.buttonContainer}>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => openEditModal(concept)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => handleDeleteConcept(concept.id)}
                                        >
                                            Delete
                                        </button>
                                        </div>
                                    </div>
                                ))
                            )}
                            {error && <p className={styles.errorText}>Error: {error.message}</p>}
                        </div>
                        <button className={styles.closeButton} onClick={() => setModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}

            {isModalOpen && modalType === 'editList' && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalTitle}>Edit List Title</h2>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="New Title"
                            value={listTitle}
                            onChange={(e) => setListTitle(e.target.value)}
                            maxLength={30}
                        />
                        <button className={styles.saveButton} onClick={handleUpdateListTitle}>
                            Save
                        </button>
                        <button className={styles.closeButton} onClick={() => setModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConceptList;
