// src/hooks/useDocumentPermissions.ts
import { useQuery, gql } from '@apollo/client';

const GET_DOCUMENT_PERMISSIONS = gql`
  query DocumentPermissions($documentId: String!, $userId: String!) {
    documentPermissions(documentId: $documentId, userId: $userId) {
      id
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

interface Share {
  userId: string;
  canRead: boolean;
  canWrite: boolean;
}

interface DocumentPermissions {
  id: string;
  ownerId: string;
  canRead: boolean;
  shares: Share[];
}

interface DocumentPermissionsData {
  documentPermissions: DocumentPermissions;
}

export const useDocumentPermissions = (documentId: string | undefined, userId: string | null) => {
  const { data, loading, error } = useQuery<DocumentPermissionsData>(
    GET_DOCUMENT_PERMISSIONS,
    {
      variables: { documentId, userId },
      skip: !documentId || !userId,
      fetchPolicy: 'network-only',
    }
  );

  const hasReadAccess = () => {
    if (loading || !data) return true; // Don't redirect while loading
    if (!userId) return false;

    const document = data.documentPermissions;
    if (!document) return false;

    // Check the document's canRead property first
    if (document.canRead) return true;

    // Owner always has access
    if (document.ownerId === userId) return true;

    // Check shares
    const userShare = document.shares?.find(share => share.userId === userId);
    return userShare?.canRead ?? false;
  };

  return {
    hasReadAccess: hasReadAccess(),
    loading,
    error,
    data
  };
};