// SelfTestPlayer.tsx
import React, { useState, useEffect } from 'react';
import styles from '../Styles/_selfTestPlayer.module.css'; // Import the CSS module

interface SelfTestPlayerProps {
  selfTest: any; // Adjust the type according to your data
  onCompleted: () => void; // Function to call when test is finished.
}

const SelfTestPlayer: React.FC<SelfTestPlayerProps> = ({ selfTest, onCompleted }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Initialize questions and userAnswers when component mounts
  useEffect(() => {
    setQuestions(selfTest.selfTestQuestions);
    setUserAnswers(selfTest.selfTestQuestions.map(() => ''));
  }, [selfTest.selfTestQuestions]);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleRetake = () => {
    setUserAnswers(questions.map(() => ''));
    setSubmitted(false);
  };

  const shuffleQuestions = () => {
    // Shuffle questions using Fisher-Yates algorithm
    const shuffledQuestions = [...questions];
    const shuffledUserAnswers = [...userAnswers];
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // Swap questions
      [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
      // Swap corresponding user answers to preserve inputs
      [shuffledUserAnswers[i], shuffledUserAnswers[j]] = [shuffledUserAnswers[j], shuffledUserAnswers[i]];
    }
    setQuestions(shuffledQuestions);
    setUserAnswers(shuffledUserAnswers);
  };

  return (
    <div className={styles.selfTestPlayer}>
      <h1 className={styles.title}>{selfTest.title}</h1>
      {!submitted ? (
        <div>
          <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={onCompleted}>
              Cancel
            </button>
            <button className={styles.button} onClick={shuffleQuestions}>
              Shuffle Questions
            </button>
          </div>
          <form
            className={styles.selfTestForm}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {questions.map((question: any, index: number) => (
              <div key={question.id} className={styles.questionContainer}>
                <p className={styles.questionText}>
                  <strong>Q{index + 1}:</strong> {question.text}
                </p>
                <textarea
                  className={styles.textarea}
                  value={userAnswers[index]}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  rows={4}
                />
              </div>
            ))}
            <button type="submit" className={styles.button}>
              Submit Answers
            </button>
          </form>
        </div>
      ) : (
        <div className={styles.resultsContainer}>
          <h2 className={styles.resultsTitle}>Review Your Answers</h2>
          {questions.map((question: any, index: number) => (
            <div key={question.id} className={styles.resultItem}>
              <p className={styles.questionText}>
                <strong>Q{index + 1}:</strong> {question.text}
              </p>
              <div className={styles.answersContainer}>
                <div className={styles.userAnswer}>
                  <h4 className={styles.answerHeading}>Your Answer:</h4>
                  <p className={styles.answerText}>{userAnswers[index]}</p>
                </div>
                <div className={styles.correctAnswer}>
                  <h4 className={styles.answerHeading}>Correct Answer:</h4>
                  <p className={styles.answerText}>{question.correctAnswer}</p>
                </div>
              </div>
            </div>
          ))}
          <button className={styles.button} onClick={handleRetake}>
            Retake Test
          </button>
          <button className={styles.button} onClick={onCompleted}>
            Back to Self Tests
          </button>
        </div>
      )}
    </div>
  );
};

export default SelfTestPlayer;