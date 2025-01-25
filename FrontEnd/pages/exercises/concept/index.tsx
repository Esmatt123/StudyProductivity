// ConceptsPage.tsx
import { useMutation, useQuery } from '@apollo/client';
import ConceptList from '../../../src/Components/ConceptList';
import ConceptListForm from '../../../src/Components/ConceptListForm';
import styles from '../../../src/Styles/_conceptPage.module.css';
import { GET_ALL_CONCEPT_LISTS, DELETE_CONCEPT_LIST, client } from '../../../src/api/graphql';
import { useUserId } from '../../../src/providers/useUserId';



type ConceptListType = {
  id: number;
  title: string;
  userId: string | null;
  concepts?: ConceptType[];
};

type ConceptType = {
  id: number;
  title: string;
  description: string;
};

// The page component
const ConceptsPage = () => {

    const { userId } = useUserId()
 

  // Use 'cache-and-network' to fetch data and update cache
  const { data, loading, error, refetch } = useQuery(GET_ALL_CONCEPT_LISTS, {
    variables: { userId },
    fetchPolicy: 'cache-first',
  });



  const [deleteConceptList] = useMutation(DELETE_CONCEPT_LIST);

  const handleDeleteList = async (id: number) => {
    try {
      // Execute the mutation
      await deleteConceptList({ variables: { id, userId } });
      // Refetch data to update the UI
      refetch();
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const handleFormCompleted = () => {
    // Refetch data to update the UI after adding a new concept list
    refetch();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div className={styles.conceptsPage}>
      <h1 className="h1">Concept Lists</h1>
      <ConceptListForm onCompleted={handleFormCompleted} userId={userId} />
      <div className={styles.grid}>
        {data.getAllConceptLists.map((list: ConceptListType) => (
          <ConceptList
            key={list.id}
            id={list.id}
            title={list.title}
            concepts={list.concepts}
            userId={userId}
            onListDelete={handleDeleteList}
          />
        ))}
      </div>
    </div>
  );
};

export default ConceptsPage;