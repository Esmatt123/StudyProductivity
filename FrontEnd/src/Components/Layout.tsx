import { useRouter } from 'next/router';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import styles from '../Styles/App.module.css';
import { FunctionComponent, ReactNode } from 'react';
import { useUserId } from '../providers/useUserId';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const { userId } = useUserId();
  
  // Hide the Sidebar on the login page (or any page where you don't want it)
  const isLoginPage = router.pathname === '/'; // Adjust if necessary

  return (
    <div className={styles.appContainer}>
      <Navbar userId={userId}/>
      <div className={styles.mainLayout}>
        {!isLoginPage && <Sidebar />} {/* Conditionally render the Sidebar */}
        <main className={'mainContent'}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
