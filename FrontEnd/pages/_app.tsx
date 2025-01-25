// src/pages/_app.tsx
import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import Layout from '../src/Components/Layout';
import '../src/Styles/globals.css';
import { apolloClient } from '../src/lib/apolloClient';
import { UserIdProvider } from '../src/providers/userIdProvider';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { AuthProvider } from '../src/providers/AuthProvider';
import { useRouter } from 'next/router';
import withAuth from '../src/Components/WithAuth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head'; // Add this import

export default function App({ Component, pageProps }: AppProps) {
    const noAuthRequired = ['/'];
    const router = useRouter();
    const isAuthRequired = !noAuthRequired.includes(router.pathname);
    const ComponentWithAuth = isAuthRequired ? withAuth(Component) : Component;
  
    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Study Productivity App</title>
          <meta name="description" content="A comprehensive study productivity application" />
          <meta name="keywords" content="study, productivity, learning, education" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="format-detection" content="telephone=no" />
          <link rel="apple-touch-icon" href="/icon.png" />
        </Head>
        <AuthProvider>
          <UserIdProvider>
            <ApolloProvider client={apolloClient}>
              <DndProvider backend={HTML5Backend}>
                <Layout>
                  <ComponentWithAuth {...pageProps} />
                  <ToastContainer />
                </Layout>
              </DndProvider>
            </ApolloProvider>
          </UserIdProvider>
        </AuthProvider>
      </>
    );
}