import { FunctionComponent } from 'react';
import Link from 'next/link';
import styles from '../src/Styles/_home.module.css';
import {
  FileText,
  Users,
  MessageCircle,
  Folder,
  Clipboard,
  CheckSquare
} from 'lucide-react';

const HomePage: FunctionComponent = () => {

  
  return (
    <div className={styles.homePage}>
      <header className={styles.header}>
        <h1>Welcome to My Project</h1>
        <p>
          Explore the features we've built to enhance your learning experience.
        </p>
      </header>

      <section className={styles.featuresSection}>
        <div className={styles.featuresGrid}>
          {/* Documents Feature */}
          <div className={styles.featureCard}>
            <FileText className={styles.featureIcon} />
            <h2>Documents</h2>
            <p>
              Access and manage all your important documents in one place.
            </p>
            <Link className={styles.learnMore} href="/document/">
              Get started
            </Link>
          </div>

          {/* Study Meetup Feature */}
          <div className={styles.featureCard}>
            <Users className={styles.featureIcon} />
            <h2>Study Meetup</h2>
            <p>
              Connect with peers for collaborative learning sessions.
            </p>
            <Link className={styles.learnMore} href="/studymeetup">
              Get started
            </Link>
          </div>

          {/* Chats Feature */}
          <div className={styles.featureCard}>
            <MessageCircle className={styles.featureIcon} />
            <h2>Chats</h2>
            <p>
              Engage in real-time conversations with fellow learners.
            </p>
            <Link className={styles.learnMore} href="/chat">
              Get started
            </Link>
          </div>

          {/* File Share Feature */}
          <div className={styles.featureCard}>
            <Folder className={styles.featureIcon} />
            <h2>File Share</h2>
            <p>
              Easily share files with your peers securely and efficiently.
            </p>
            <Link className={styles.learnMore} href="/files">
              Get started
            </Link>
          </div>

          {/* Exercises Feature */}
          <div className={styles.featureCard}>
            <Clipboard className={styles.featureIcon} />
            <h2>Exercises</h2>
            <p>
              Practice and improve your skills with interactive exercises.
            </p>
            <Link className={styles.learnMore} href="/exercises">
              Get started
            </Link>
          </div>

          {/* To-dos Feature */}
          <div className={styles.featureCard}>
            <CheckSquare className={styles.featureIcon} />
            <h2>To-dos</h2>
            <p>
              Organize your tasks and stay on top of your learning schedule.
            </p>
            <Link className={styles.learnMore} href="/todo">
              Get started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;