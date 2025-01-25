// pages/document/[id].tsx
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useUserId } from '../../src/providers/useUserId';
import { useDocumentPermissions } from '../../src/hooks/useDocumentPermissions';
import { toast } from 'react-toastify';

const DocumentEditor = dynamic(() => import('../../src/Components/DocumentEditor'), {
    ssr: false,
});

const DocumentPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { userId } = useUserId();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { hasReadAccess, loading, error, data } = useDocumentPermissions(id as string, userId);

  useEffect(() => {
    // Only proceed if we have completed loading and have data
    if (!loading && data) {
      
      if (!hasReadAccess) {
        toast.error('You do not have permission to access this document');
        router.push('/documents');
      }
      
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }
  }, [hasReadAccess, loading, data, router, id, userId, isInitialLoad]);

  // Show loading state only during initial load
  if (isInitialLoad && loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error('Error checking document permissions:', error);
    toast.error('You do not have permission to access this document, or, theres been an error');
    router.push("/document")
    return <div>Error loading document</div>;
  }

  if (!id) {
    return <div>Invalid document</div>;
  }

  // Don't return null during loading to prevent flicker
  if (!hasReadAccess && !loading) {
    return null;
  }

  return <DocumentEditor userId={userId}/>;
};

export default DocumentPage;