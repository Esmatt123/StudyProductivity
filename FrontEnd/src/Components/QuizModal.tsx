import { FunctionComponent, useEffect, useState } from "react";
import styles from "../Styles/_quiz-modal.module.css";

interface IQuizModal {
  existingQuiz?: Quiz | null;
  onClose: () => void;
  onSubmit: (quiz: Quiz) => void;
  isEditMode: boolean;
}

type Quiz = {
  id?: number;
  title: string;
  questions: Question[];
};

type Question = {
  id?: number;
  text: string;
  answerOptions: AnswerOption[];
};

type AnswerOption = {
  id?: number;
  text: string;
  isCorrect: boolean;
};

const QuizModal: FunctionComponent<IQuizModal> = ({ existingQuiz, onClose, onSubmit, isEditMode }) => {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { text: "", answerOptions: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }] },
  ]);

  useEffect(() => {
    if (existingQuiz) {
      setQuizTitle(existingQuiz.title);
      setQuestions(existingQuiz.questions);
    } else {
      // Reset to default state when not editing
      setQuizTitle("");
      setQuestions([
        { text: "", answerOptions: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }] },
      ]);
    }
  }, [existingQuiz]);

  const handleQuestionChange = (index: number, value: string) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index] = { ...updatedQuestions[index], text: value };
      return updatedQuestions;
    });
  };

  const handleAnswerOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((question, qIdx) => {
        if (qIdx !== questionIndex) return question;

        const updatedAnswerOptions = question.answerOptions.map((option, oIdx) => {
          if (oIdx !== optionIndex) return option;
          return { ...option, text: value };
        });

        return {
          ...question,
          answerOptions: updatedAnswerOptions,
        };
      });

      return updatedQuestions;
    });
  };

  const toggleCorrectAnswer = (questionIndex: number, optionIndex: number) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((question, qIdx) => {
        if (qIdx !== questionIndex) return question;

        const updatedAnswerOptions = question.answerOptions.map((option, oIdx) => ({
          ...option,
          isCorrect: oIdx === optionIndex,
        }));

        return {
          ...question,
          answerOptions: updatedAnswerOptions,
        };
      });

      return updatedQuestions;
    });
  };

  const addQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { text: "", answerOptions: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }] },
    ]);
  };

  const removeQuestion = (questionIndex: number) => {
    setQuestions((prevQuestions) => prevQuestions.filter((_, qIdx) => qIdx !== questionIndex));
  };

  const addAnswerOption = (questionIndex: number) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((question, qIdx) => {
        if (qIdx !== questionIndex) return question;

        if (question.answerOptions.length < 4) {
          const updatedAnswerOptions = [...question.answerOptions, { text: "", isCorrect: false }];
          return { ...question, answerOptions: updatedAnswerOptions };
        }

        return question;
      });

      return updatedQuestions;
    });
  };

  const removeAnswerOption = (questionIndex: number, optionIndex: number) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((question, qIdx) => {
        if (qIdx !== questionIndex) return question;

        const updatedAnswerOptions = question.answerOptions.filter((_, oIdx) => oIdx !== optionIndex);
        return { ...question, answerOptions: updatedAnswerOptions };
      });

      return updatedQuestions;
    });
  };

  const handleSubmit = () => {
    const quizData: Quiz = {
      id: existingQuiz?.id,
      title: quizTitle,
      questions: questions.map((q) => ({
        ...q,
        id: q.id,
        answerOptions: q.answerOptions.map((ao) => ({
          ...ao,
          id: ao.id,
        })),
      })),
    };
    onSubmit(quizData);
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2>{isEditMode ? "Edit Quiz" : "Create a New Quiz"}</h2>

        <label className={styles.label}>
          Quiz Title:
          <input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            className={styles.titleInput}
          />
        </label>

        <div className={styles.questionsContainer}>
          {questions.map((question, qIndex) => (
            <div key={qIndex} className={styles.questionBlock}>
              <label className={styles.label}>
                Question Text:
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  className={styles.input}
                />
              </label>

              <div className={styles.answerOptionsContainer}>
                {question.answerOptions.map((option, aIndex) => (
                  <div key={aIndex} className={styles.answerOptionBlock}>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleAnswerOptionChange(qIndex, aIndex, e.target.value)}
                      className={styles.input}
                    />
                    <button
                      type="button"
                      onClick={() => toggleCorrectAnswer(qIndex, aIndex)}
                      className={`${styles.button} ${option.isCorrect ? styles.correct : ""}`}
                    >
                      {option.isCorrect ? "Correct" : "Set Correct"}
                    </button>
                    {question.answerOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeAnswerOption(qIndex, aIndex)}
                        className={styles.removeOptionButton}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addAnswerOption(qIndex)}
                  className={styles.addOptionButton}
                  disabled={question.answerOptions.length >= 4}
                >
                  Add Answer Option
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className={styles.removeQuestionButton}
              >
                Remove Question
              </button>
            </div>
          ))}

          <button type="button" onClick={addQuestion} className={styles.addQuestionButton}>
            Add Question
          </button>
        </div>

        <div className={styles.modalActions}>
          <button onClick={handleSubmit} className={styles.submitButton}>
            {isEditMode ? "Update" : "Submit"}
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;