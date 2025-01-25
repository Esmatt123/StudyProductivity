// Navbar.tsx
import { FunctionComponent, useState } from 'react';
import Link from 'next/link';
import styles from '../Styles/_navbar.module.css';
import { useAuth } from '../providers/AuthProvider';

interface Props {
  userId: string | null
}

const Navbar: FunctionComponent<Props> = ({userId}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/" passHref>
        <img
            src="https://img.logoipsum.com/243.svg"
            alt="Logo"
          />
        </Link>
      </div>

      <div className={styles.hamburger} onClick={toggleMenu}>
        <span className={`${styles.bar} ${isMenuOpen ? styles.active : ''}`}></span>
        <span className={`${styles.bar} ${isMenuOpen ? styles.active : ''}`}></span>
        <span className={`${styles.bar} ${isMenuOpen ? styles.active : ''}`}></span>
      </div>

      <div className={`${styles.navContainer} ${isMenuOpen ? styles.active : ''}`}>
        <ul className={styles.navLinks}>
          <li onClick={closeMenu}>
            <Link href="/home">Home</Link>
          </li>
          <li onClick={closeMenu}>
            <Link href="/About-Us">About</Link>
          </li>
          <li onClick={closeMenu}>
            <Link href="/faq">FAQ</Link>
          </li>
          <li onClick={closeMenu}>
            <Link href="/contact">Contact</Link>
          </li>
          <li className={styles.profile}>
            <Link href={`/profile/${userId}`}>Profile</Link>
            <ul className={styles.dropdownMenu}>
              <li onClick={() => { closeMenu(); logout(); }}>
                <span>Logout</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;