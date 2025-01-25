import { createContext, FunctionComponent, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronFirst,
  ChevronLast,
  Home,
  FileText,
  Users,
  MessageCircle,
  Folder,
  Clipboard,
  CheckSquare,
} from 'lucide-react';
import { useState } from 'react';
import styles from '../Styles/_sidebar.module.css';
import useMediaQuery from '../hooks/useMediaQuery';

interface SidebarContextType {
  expanded: boolean;
}

export const SidebarContext = createContext<SidebarContextType>({ expanded: true });

const Sidebar: FunctionComponent = () => {
  const [expanded, setExpanded] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)'); // Add this hook

  useEffect(() => {
    if (isMobile) {
      setExpanded(true);
    }
  }, [isMobile]);


  return (
    <aside className={`${styles.container} ${expanded ? styles.expanded : styles.collapsed}`}>
      <nav className={styles.nav}>
        <div className={styles.navHeader}>
          <img
            src="https://img.logoipsum.com/243.svg"
            className={`${styles.logo} ${expanded ? styles.expandedLogo : styles.collapsedLogo}`}
            alt="Logo"
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className={styles.toggleButton}
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <ul className={styles.menu}>
          <li className={styles.menuItem}>
            <Link href="/home" passHref>
              <div className={styles.menuLink}>
                <span className={styles.linkIcon}>
                  <Home />
                </span>
                <span
                  className={`${styles.linkText} ${
                    expanded ? styles.expandedText : styles.collapsedText
                  }`}
                >
                  Home
                </span>
              </div>
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href="/document/" passHref>
              <div className={styles.menuLink}>
                <span className={styles.linkIcon}>
                  <FileText />
                </span>
                <span
                  className={`${styles.linkText} ${
                    expanded ? styles.expandedText : styles.collapsedText
                  }`}
                >
                  Documents
                </span>
              </div>
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href="/studymeetup" passHref>
              <div className={styles.menuLink}>
                <span className={styles.linkIcon}>
                  <Users />
                </span>
                <span
                  className={`${styles.linkText} ${
                    expanded ? styles.expandedText : styles.collapsedText
                  }`}
                >
                  Study Meetup
                </span>
              </div>
            </Link>
          </li>

          {/* Updated remaining list items */}
          <li className={styles.menuItem}>
            <Link href="/chat" passHref>
              <div className={styles.menuLink}>
                <span className={styles.linkIcon}>
                  <MessageCircle />
                </span>
                <span
                  className={`${styles.linkText} ${
                    expanded ? styles.expandedText : styles.collapsedText
                  }`}
                >
                  Chats
                </span>
              </div>
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href="/files" passHref>
              <div className={styles.menuLink}>
                <span className={styles.linkIcon}>
                  <Folder />
                </span>
                <span
                  className={`${styles.linkText} ${
                    expanded ? styles.expandedText : styles.collapsedText
                  }`}
                >
                  File Share
                </span>
              </div>
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href="/exercises" passHref>
              <div className={styles.menuLink}>
                <span className={styles.linkIcon}>
                  <Clipboard />
                </span>
                <span
                  className={`${styles.linkText} ${
                    expanded ? styles.expandedText : styles.collapsedText
                  }`}
                >
                  Exercises
                </span>
              </div>
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href="/todo" passHref>
              <div className={styles.menuLink}>
                <span className={styles.linkIcon}>
                  <CheckSquare />
                </span>
                <span
                  className={`${styles.linkText} ${
                    expanded ? styles.expandedText : styles.collapsedText
                  }`}
                >
                  To dos
                </span>
              </div>
            </Link>
          </li>
        </ul>

      </nav>
    </aside>
  );
};

export default Sidebar;