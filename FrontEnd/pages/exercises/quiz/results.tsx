import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Quiz } from "../../../src/Components/PlayQuizModal";
import styles from "../../../src/Styles/_resultsPage.module.css"; // Import the CSS module

const ResultsPage = () => {
  const router = useRouter();
  const { quiz, selectedAnswers, score } = router.query;

  const [quizData, setQuizData] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]); // Store selected answers as IDs
  const [finalScore, setFinalScore] = useState<number | null>(null);

  useEffect(() => {
    if (quiz && selectedAnswers && score) {
      // Decode the received data
      setQuizData(JSON.parse(quiz as string));
      setAnswers(JSON.parse(selectedAnswers as string));
      setFinalScore(Number(score));
    }
  }, [quiz, selectedAnswers, score]);

  return (
    <div className={styles.resultsPage}>
      <h1 className={styles.pageTitle}>Quiz Results</h1>
      {quizData && (
        <>
          <h2 className={styles.quizTitle}>{quizData.title}</h2>
          <div className={styles.scoreContainer}>
            <h3 className={styles.score}>Your Score: {finalScore} / {quizData.questions.length}</h3>
          </div>
          <div className={styles.questionsContainer}>
            {quizData.questions.map((question, index) => {
              const userAnswerId = answers[index]; 

              return (
                <div key={question.id} className={styles.question}>
                  <p className={styles.questionText}>{question.text}</p>
                  <div className={styles.answersContainer}>
                    {question.answerOptions.map((option) => {
                      const isSelected = option.id === userAnswerId;
                      const isCorrect = option.isCorrect;
                      const answerClass = isSelected
                        ? isCorrect
                          ? styles.correctAnswer
                          : styles.incorrectAnswer
                        : isCorrect
                        ? styles.correctUnselectedAnswer
                        : "";

                      return (
                        <p
                          key={option.id}
                          className={`${styles.answer} ${answerClass}`}
                        >
                          {option.text}
                        </p>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ResultsPage;
