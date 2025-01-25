import { useMutation } from "@apollo/client";
import { CREATE_SELF_TEST, UPDATE_SELF_TEST } from "../api/graphql";
import { useState, useEffect, FunctionComponent } from "react";
import styles from "../Styles/_selftTestForm.module.css";

interface SelfTestFormProps {
  userId: string | null;
  selfTestId?: string;
  initialTitle?: string;
  onCompleted: () => void;
}

const SelfTestForm: FunctionComponent<SelfTestFormProps> = ({
  userId,
  selfTestId,
  initialTitle = "",
  onCompleted,
}) => {
  const [title, setTitle] = useState(initialTitle);

  const [createSelfTest] = useMutation(CREATE_SELF_TEST);
  const [updateSelfTest] = useMutation(UPDATE_SELF_TEST, {
    onCompleted: (data) => {
      // Ensure we're not losing any data
      console.log("Updated test:", data.updateSelfTest);
      onCompleted();
    },
    onError: (error) => {
      console.error("Error updating test:", JSON.stringify(error, null, 2));
    }
  });

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle, selfTestId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selfTestId) {
        // Only update the title
        await updateSelfTest({
          variables: { 
            id: selfTestId, 
            title
          }
        });
      } else {
        await createSelfTest({
          variables: { input: { title, userId } },
        });
      }
      setTitle("");
      onCompleted();
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label}>
        Title:
        <input
          type="text"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>
      <button type="submit" className={styles.button} >
        {selfTestId ? "Update Title" : "Create Self Test"}
      </button>
    </form>
  );
};

export default SelfTestForm;