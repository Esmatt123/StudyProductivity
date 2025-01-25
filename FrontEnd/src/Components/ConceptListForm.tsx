// ConceptListForm.tsx
import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_CONCEPT_LIST, UPDATE_CONCEPT_LIST, GET_ALL_CONCEPT_LISTS } from '../api/graphql';
import styles from '../Styles/_conceptListForm.module.css'

type ConceptListFormProps = {
  initialData?: { id?: number; title: string } | null;
  onCompleted: (updatedData?: any) => void; // Pass updated data to parent
  userId: string | null;
};

interface Concept {
  id: string;
  title: string;
  description: string;
}

interface ConceptList {
  id: string;
  title: string;
  userId: string;
  concepts: Concept[];
}

// Define the query response type
interface GetAllConceptListsResponse {
  getAllConceptLists: ConceptList[];
}

const ConceptListForm: React.FC<ConceptListFormProps> = ({ initialData, onCompleted, userId }) => {
  const [title, setTitle] = useState(initialData?.title || '');

  const [addConceptList] = useMutation(ADD_CONCEPT_LIST, {
    variables: { userId },
    update(cache, { data: { addConceptList: newList } }) {
      // Read the existing data from the cache
      const existingData: GetAllConceptListsResponse | null = cache.readQuery({
        query: GET_ALL_CONCEPT_LISTS,
        variables: { userId },
      });
      console.log('Existing data in cache before addition:', existingData);

      // Add the new list to the existing data
      const newConceptLists = [newList, ...existingData!.getAllConceptLists];

      // Write the updated data back to the cache
      cache.writeQuery({
        query: GET_ALL_CONCEPT_LISTS,
        variables: { userId },
        data: { getAllConceptLists: newConceptLists },
      });

      // Console log updated cache data
      const updatedData = cache.readQuery({
        query: GET_ALL_CONCEPT_LISTS,
        variables: { userId },
      });
      console.log('Updated data in cache after addition:', updatedData);
    },
    onCompleted: (data) => {
      // Pass the updated data to the parent component
      onCompleted(data);
      // Clear the input field
      setTitle('');
    },
  });

  const [updateConceptListMutation] = useMutation(UPDATE_CONCEPT_LIST, {
    variables: { userId },
    update(cache, { data: { updateConceptList: updatedList } }) {
      // Read the existing data from the cache
      const existingData: GetAllConceptListsResponse | null = cache.readQuery({
        query: GET_ALL_CONCEPT_LISTS,
        variables: { userId },
      });
      console.log('Existing data in cache before update:', existingData);

      // Update the specific concept list
      const newConceptLists = existingData!.getAllConceptLists.map((list) =>
        list.id === updatedList.id ? updatedList : list
      );

      // Write the updated data back to the cache
      cache.writeQuery({
        query: GET_ALL_CONCEPT_LISTS,
        variables: { userId },
        data: { getAllConceptLists: newConceptLists },
      });

      // Console log updated cache data
      const updatedData = cache.readQuery({
        query: GET_ALL_CONCEPT_LISTS,
        variables: { userId },
      });
      console.log('Updated data in cache after update:', updatedData);
    },
    onCompleted: (data) => {
      // Pass the updated data to the parent component
      onCompleted(data);
      // Clear the input field
      setTitle('');
    },
  });

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title); // Reinitialize title when initialData changes
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (initialData?.id) {
        // Update existing concept list
        await updateConceptListMutation({
          variables: {
            conceptListInput: {
              id: initialData.id,
              title,
              userId: userId,
            },
          },
        });
        console.log('Updated concept list');
      } else {
        // Add new concept list
        await addConceptList({
          variables: {
            conceptListInput: {
              title,
              userId: userId,
            },
          },
        });
        console.log('Added concept list');
      }
    } catch (error) {
      console.error('Error while saving concept list:', error);
    }
  };

  return (
    <form
  onSubmit={handleSubmit}
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "400px",
    margin: "20px auto",
    padding: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.transform = "scale(1.02)";
    e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.15)";
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.1)";
  }}
>
  <input
    type="text"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="Concept List Title"
    required
    style={{
      padding: "14px 20px",
      marginBottom: "24px",
      width: "100%",
      fontSize: "16px",
      fontFamily: "Arial, sans-serif",
      border: "1px solid #ddd",
      borderRadius: "8px",
      backgroundColor: "#f7f7f7",
      color: "#333",
      outline: "none",
      transition: "all 0.3s ease",
    }}
    onFocus={(e) => {
      e.target.style.borderColor = "#4caf50";
      e.target.style.boxShadow = "0 0 8px rgba(76, 175, 80, 0.5)";
      e.target.style.backgroundColor = "#e8f5e9";
    }}
    onBlur={(e) => {
      e.target.style.borderColor = "#ddd";
      e.target.style.boxShadow = "none";
      e.target.style.backgroundColor = "#f7f7f7";
    }}
  />
  <button
    type="submit"
    style={{
      padding: "14px",
      fontSize: "16px",
      fontWeight: "600",
      border: "none",
      borderRadius: "8px",
      backgroundColor: "#4caf50",
      color: "white",
      cursor: "pointer",
      transition: "background-color 0.3s ease, transform 0.2s ease",
      width: "100%",
      textAlign: "center",
    }}
    onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
      (e.target as HTMLButtonElement).style.backgroundColor = "#45a049";
      (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
    }}
    onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
      (e.target as HTMLButtonElement).style.backgroundColor = "#4caf50";
      (e.target as HTMLButtonElement).style.transform = "translateY(0)";
    }}
    onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
      (e.target as HTMLButtonElement).style.transform = "translateY(0)";
    }}
    onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => {
      (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
    }}
  >
    {initialData ? "Update" : "Add"} Concept List
  </button>
</form>


  );
};

export default ConceptListForm;