import { FunctionComponent, useState } from "react";
import { useMutation } from "@apollo/client";
import { SUBMIT_QUIZ } from "../../src/api/graphql";
import styles from "../Styles/_play-quiz-modal.module.css";
import { useRouter } from "next/router";
import { toast } from "react-toastify"; // Import toast

type PlayQuizModalProps = {
    quiz: Quiz | null;
    onClose: () => void;
    userId: string | null;
};

export type Quiz = {
    id: number;
    title: string;
    questions: Question[];
};

export type Question = {
    id: number;
    text: string;
    answerOptions: AnswerOption[];
    correctAnswerId: number; // Add this to track the correct answer
};

export type AnswerOption = {
    id: number;
    text: string;
    isCorrect: boolean;
};

const PlayQuizModal: FunctionComponent<PlayQuizModalProps> = ({ quiz, onClose, userId }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Map<number, number>>(new Map());
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const [submitQuiz] = useMutation(SUBMIT_QUIZ, {
        onCompleted: (data) => {
            const { submitQuiz } = data;
            toast.success(`You got ${submitQuiz} out of ${selectedAnswers.size} questions right!`);
            onClose();
        },
        onError: (error) => {
            console.error("Error submitting quiz:", error);
            toast.error("Failed to submit quiz. Please try again.");
        },
    });

    const handleAnswerSelect = (answerId: number) => {
        setSelectedAnswers((prev) => new Map(prev).set(quiz!.questions[currentQuestionIndex].id, answerId));
        if (currentQuestionIndex < quiz!.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            handleQuizCompletion();
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz!.questions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const handleQuizCompletion = () => {
        setIsQuizCompleted(true);
    };

    const handleSubmitQuiz = async () => {
        if (!quiz || !userId) {
            toast.error("Missing required information to submit quiz");
            return;
        }

        try {
            setIsSubmitting(true);

            const selectedAnswerIds = Array.from(selectedAnswers.values());

            // Perform the GraphQL mutation
            const { data } = await submitQuiz({
                variables: {
                    id: quiz.id,
                    userId,
                    selectedAnswerIds,
                },
            });

            if (data) {
                // Pass the data dynamically to the results page
                router.push({
                    pathname: `/exercises/quiz/results`,
                    query: {
                        quiz: JSON.stringify(quiz), // Send the entire quiz object
                        selectedAnswers: JSON.stringify(selectedAnswerIds), // Send selected answers
                        score: data.submitQuiz, // Send the score from the mutation
                    },
                });
            }
        } catch (error) {
            console.error("Error submitting quiz:", error);
            toast.error("Failed to submit quiz. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <button className={styles.closeButtonTopRight} onClick={onClose}>
                    &times;
                </button>
                {isQuizCompleted ? (
                    <div className={styles.completedMessage}>
                        <h2>Congratulations! You have completed the quiz.</h2>
                        <button className={styles.submitButton} onClick={handleSubmitQuiz} disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit Quiz"}
                        </button>
                        <button className={styles.closeButton} onClick={onClose}>
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        <h2>{quiz!.title}</h2>
                        <div className={styles.questionContainer}>
                            <div className={styles.questionBox}>{quiz!.questions[currentQuestionIndex].text}</div>
                        </div>
                        <div className={styles.answersContainer}>
                            {quiz!.questions[currentQuestionIndex].answerOptions.map((option) => (
                                <button
                                    key={option.id}
                                    className={`${styles.answerBox} ${selectedAnswers.get(quiz!.questions[currentQuestionIndex].id) === option.id
                                            ? styles.selectedAnswer
                                            : ""
                                        }`}
                                    onClick={() => handleAnswerSelect(option.id)}
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                        <div className={styles.progressBar}>
                            Question {currentQuestionIndex + 1} of {quiz!.questions.length}
                        </div>
                        <div className={styles.pagination}>
                            {currentQuestionIndex > 0 && (
                                <button className={styles.paginationButton} onClick={handlePreviousQuestion}>
                                    Previous
                                </button>
                            )}
                            {currentQuestionIndex < quiz!.questions.length - 1 && (
                                <button
                                    className={styles.paginationButton}
                                    onClick={handleNextQuestion}
                                    disabled={!selectedAnswers.has(quiz!.questions[currentQuestionIndex].id)}
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PlayQuizModal;