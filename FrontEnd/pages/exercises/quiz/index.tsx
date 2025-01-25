import { FunctionComponent, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_QUIZ, DELETE_QUIZ, GET_QUIZZES, UPDATE_QUIZ } from "../../../src/api/graphql";
import QuizModal from "../../../src/Components/QuizModal";
import PlayQuizModal, { AnswerOption, Question, Quiz } from "../../../src/Components/PlayQuizModal";
import styles from "../../../src/Styles/_quiz-page.module.css"
import { useUserId } from "../../../src/providers/useUserId";

const QuizPage: FunctionComponent = () => {
  const { userId } = useUserId()
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPlayModalOpen, setIsPlayModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const { data, refetch } = useQuery(GET_QUIZZES, { variables: { userId } });

  const [addQuiz] = useMutation(ADD_QUIZ, {
    onCompleted: () => {
      refetch();
      setIsQuizModalOpen(false); // Close the modal after creating a quiz
    },
  });

  const [updateQuiz] = useMutation(UPDATE_QUIZ, {
    onCompleted: () => {
      refetch();
      setIsQuizModalOpen(false); // Close the modal after updating a quiz
    },
  });

  const [deleteQuiz] = useMutation(DELETE_QUIZ, {
    onCompleted: () => refetch(),
  });

  const handleAddQuiz = (quizData: any) => {
    const formattedQuizData = quizData.questions.map((question: Question) => ({
      text: question.text,
      answerOptions: question.answerOptions.map((option: AnswerOption) => ({
        text: option.text,
        isCorrect: option.isCorrect,
      })),
    }));

    if (isEditMode && selectedQuiz) {
      // Update existing quiz
      updateQuiz({
        variables: {
          id: selectedQuiz.id,
          title: quizData.title,
          userId: userId,
          questions: formattedQuizData,
        },
      });
    } else {
      // Add new quiz
      addQuiz({ variables: { title: quizData.title, userId: userId, questions: formattedQuizData } });
    }
  };

  const handleDeleteQuiz = (id: number) => {
    deleteQuiz({ variables: { id, userId } });
  };

  const handlePlayQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsPlayModalOpen(true);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsQuizModalOpen(true);
    setIsEditMode(true);
  };

  const handleCreateQuiz = () => {
    setSelectedQuiz(null);
    setIsQuizModalOpen(true);
    setIsEditMode(false);
  };

  return (
    <div className={styles.exerciseTypePage}>
      <h1 className={styles.pageTitle}>Quiz Page</h1>
      <p className={styles.description}>Manage, create, delete, and play quiz exercises here!</p>

      <button className={styles.createQuizButton} onClick={handleCreateQuiz}>
        Create New Quiz
      </button>

      <div className={styles.quizzesGrid}>
        {data?.getAllQuizzesByUserId.map((quiz: Quiz) => (
          <div key={quiz.id} className={styles.quizCard}>
            <h3 className={styles.quizTitle}>{quiz.title}</h3>
            <div className={styles.cardActions}>
              <button className={styles.playButton} onClick={() => handlePlayQuiz(quiz)}>
                Play
              </button>
              <button className={styles.editButton} onClick={() => handleEditQuiz(quiz)}>
                Edit
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteQuiz(quiz.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isPlayModalOpen && selectedQuiz && (
        <PlayQuizModal
          quiz={selectedQuiz}
          onClose={() => setIsPlayModalOpen(false)}
          userId={userId}
        />
      )}

      {isQuizModalOpen && (
        <QuizModal
          existingQuiz={selectedQuiz}
          onClose={() => setIsQuizModalOpen(false)}
          onSubmit={handleAddQuiz}
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
};

export default QuizPage;