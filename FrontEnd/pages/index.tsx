import { FunctionComponent } from 'react';
import LoginForm from '../src/Components/LoginForm';
import styles from '../src/Styles/_homePage.module.css';

const HomePage: FunctionComponent = () => {
  console.log("Test: ", process.env.TEST_VAR)
  return (
    <div className={styles.homePage}>
      
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <h1 className={styles.title}>Boost Your Study Productivity</h1>
        <h4 className={styles.subtitle}>Achieve more with less effort using my app.</h4>
        <p className={styles.subtitle}>Just click login! Try sally@example.com or ted@example.com also!</p>
        
        {/* Login Form */}
        <div className={styles.loginFormContainer}>
          <LoginForm />
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Features</h2>
        <div className={styles.features}>
          <div className={styles.featureItem}>
            <h3>Share Documents</h3>
            <p>Write together collaboratively</p>
          </div>
          <div className={styles.featureItem}>
            <h3>Schedule group studies</h3>
            <p>Study with your classmates on your own terms</p>
          </div>
          <div className={styles.featureItem}>
            <h3>Study with our special exercises</h3>
            <p>Get the highest grades with our study tools</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Esmatts Study Productivity App</p>
      </footer>
    </div>
  );
};

export default HomePage;