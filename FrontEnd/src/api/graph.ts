
import { ApolloClient, ApolloError, gql, useQuery } from "@apollo/client";



const SHARE_DOCUMENT_MUTATION = gql`
    mutation ShareDocument($documentId: String!, $email: String!, $canWrite: Boolean!, $sharedByUserId: String!) {
      shareDocument(documentId: $documentId, email: $email, canWrite: $canWrite, sharedByUserId: $sharedByUserId) {
        id
        name
        sharedUserId
        ownerId
        canWrite
      }
    }
`;
// Define the types for the document response
interface shareDocumentInterface {
  id: string;
  name: string;
  canWrite: boolean;
  sharedUserId: string;
  ownerId: string;
}

interface ShareDocumentResponse {
  shareDocument: shareDocumentInterface;
}

// Define the parameters for the shareDocument function
export async function shareDocument(
  client: ApolloClient<unknown>, // The GraphQL client type, replace with the actual type if available
  documentId: string,
  email: string,
  canWrite: boolean,
  sharedByUserId: string | null
): Promise<{ document: shareDocumentInterface; sharedUserId: string, ownerId: string, canWriteBool: boolean }> {
  try {
    const { data } = await client.mutate<ShareDocumentResponse>({
      mutation: SHARE_DOCUMENT_MUTATION,
      variables: { documentId, email, canWrite, sharedByUserId },
    });

    const sharedUserId = data!.shareDocument.sharedUserId; // Extract sharedUserId from response
    const ownerId = data!.shareDocument.ownerId; // Extract sharedUserId from response
    const canWriteBool = data!.shareDocument.canWrite; // Extract sharedUserId from response


    // Return both document details and sharedUserId
    return { document: data!.shareDocument, sharedUserId, ownerId, canWriteBool };
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    throw error;
  }
}

export interface AccessibleDocumentsReturn {
  loading: boolean;
  error: ApolloError | undefined;
  documents: Document[];
}

export interface Document {
  id: string;
  name: string;
  ownerId: string;
  canRead: boolean;
  shares: {
    userId: string;
    canRead: boolean;
    canWrite: boolean;
  }[];
}

export const GET_ACCESSIBLE_DOCUMENTS = gql`
  query GetAccessibleDocuments($userId: String!) {
    accessibleDocuments(userId: $userId) {
      id
      name
      ownerId
      canRead
      shares {
        userId
        canRead
        canWrite
      }
    }
  }
`;

export function useAccessibleDocuments(userId: string | null): AccessibleDocumentsReturn {

  const { loading, error, data } = useQuery(GET_ACCESSIBLE_DOCUMENTS, {
    variables: { userId },
  });


  return {
    loading,
    error,
    documents: data?.accessibleDocuments || [],
  };
}