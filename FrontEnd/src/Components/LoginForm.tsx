// src/Components/LoginForm.tsx
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useAuth } from '../providers/AuthProvider'; // Ensure this path is correct
import { toast } from 'react-toastify'; // Import toast
import styles from '../Styles/_loginForm.module.css';

const LoginForm = () => {
  const [email, setEmail] = useState<string>('bob@example.com');
  const [password, setPassword] = useState<string>('Password123!');
  const router = useRouter();

  const { login, loading } = useAuth(); // Destructure from AuthContext

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await login(email, password); // Call the login function from AuthProvider
      // Display success toast notification
      toast.success('Login successful! Redirecting...');
      // Redirect to the home page or another protected page
      router.push('/home'); // Adjust the path as needed
    } catch (error: any) {
      // Display error toast notification
      toast.error('Login failed. Please check your credentials and try again.');
      console.error('Login failed:', error);
    }
  };

  return (
    <div className={styles.loginFormContainer}>
      <h2 className={styles.title}>Login</h2>
      <form onSubmit={handleLogin} className={styles.loginForm}>
        {/* No need for error messages here since we're using toasts */}
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Password:
          </label>
          <input
            type="password"
            id="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;