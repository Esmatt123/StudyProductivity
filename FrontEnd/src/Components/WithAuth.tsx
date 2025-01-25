import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../providers/AuthProvider';

const withAuth = (WrappedComponent: React.ComponentType) => {
  return function ProtectedComponent(props: any) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!isAuthenticated) {
          // Redirect to login page if not authenticated
          router.push('/'); // Adjust the path to your login page
        }
      }
    }, [isAuthenticated, loading, router]);

    if (loading) {
      // Optionally, render a loading indicator
      return null; // or a loading spinner
    }

    if (!isAuthenticated) {
      return null; // This component will redirect in the useEffect
    }

    // If authenticated, render the wrapped component
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;