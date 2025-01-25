// SelfTestQuestionForm.tsx
import { useMutation } from "@apollo/client";
import { CREATE_SELF_TEST_QUESTION, UPDATE_SELF_TEST_QUESTION } from "../api/graphql";
import { useState, useEffect } from "react";
import styles from '../Styles/_selfTestQuestionForm.module.css'; // Import the SCSS module

interface SelfTestQuestionFormProps {
  selfTestId: string;
  userId: string | null;
  questionId?: string;
  initialText?: string;
  initialCorrectAnswer?: string;
  onCompleted: () => void;
}

const SelfTestQuestionForm: React.FC<SelfTestQuestionFormProps> = ({
  selfTestId,
  userId,
  questionId,
  initialText = "",
  initialCorrectAnswer = "",
  onCompleted,
}) => {
  const [text, setText] = useState(initialText);
  const [correctAnswer, setCorrectAnswer] = useState(initialCorrectAnswer);

  const [createQuestion] = useMutation(CREATE_SELF_TEST_QUESTION);
  const [updateQuestion] = useMutation(UPDATE_SELF_TEST_QUESTION);

  // Update the form fields when initial values change (e.g., when editing a different question)
  useEffect(() => {
    setText(initialText);
    setCorrectAnswer(initialCorrectAnswer);
  }, [initialText, initialCorrectAnswer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (questionId) {
      await updateQuestion({
        variables: {
          id: questionId,
          selfTestId: selfTestId,
          text: text,
          correctAnswer: correctAnswer,
          userId: userId,
        },
      });
    } else {
      await createQuestion({
        variables: { selfTestId, text, correctAnswer, userId },
      });
    }

    onCompleted();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label}>
          Question (max 500 characters):
          <textarea
            className={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
            rows={6} // Adjust the number of rows as needed
            placeholder="Enter your question here..."
          />
        </label>
        <span className={styles.charCount}>{text.length}/500</span>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>
          Correct Answer (max 1500 characters):
          <textarea
            className={styles.textarea}
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            maxLength={1500}
            rows={10} // Adjust the number of rows as needed
            placeholder="Enter the correct answer here..."
          />
        </label>
        <span className={styles.charCount}>{correctAnswer.length}/1500</span>
      </div>
      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.button}>
          {questionId ? "Update" : "Add"} Question
        </button>
        <button type="button" className={styles.cancelButton} onClick={onCompleted}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SelfTestQuestionForm;