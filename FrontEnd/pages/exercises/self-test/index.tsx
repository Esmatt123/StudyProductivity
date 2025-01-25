// SelfTestsPage.tsx
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_ALL_SELF_TESTS_BY_USER,
  DELETE_SELF_TEST,
  DELETE_SELF_TEST_QUESTION,
} from "../../../src/api/graphql";
import SelfTestForm from "../../../src/Components/SelfTestForm";
import SelfTestQuestionForm from "../../../src/Components/SelfTestQuestionForm";
import SelfTestPlayer from "../../../src/Components/SelfTestPlayer";
import { useUserId } from "../../../src/providers/useUserId";
import styles from '../../../src/Styles/_selfTestPage.module.css';

const SelfTestsPage = () => {
  const { userId } = useUserId();
  const [editingSelfTest, setEditingSelfTest] = useState<any>(null);
  const [editingTitle, setEditingTitle] = useState<boolean>(false);
  const [addingQuestionToSelfTestId, setAddingQuestionToSelfTestId] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [playingSelfTest, setPlayingSelfTest] = useState<any>(null);

  const { data, loading, error, refetch } = useQuery(GET_ALL_SELF_TESTS_BY_USER, {
    variables: { userId },
  });

  const [deleteSelfTest] = useMutation(DELETE_SELF_TEST, {
    onCompleted: () => refetch(),
  });

  const [deleteSelfTestQuestion] = useMutation(DELETE_SELF_TEST_QUESTION, {
    onCompleted: () => refetch(),
  });

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>Error: {error.message}</p>;

  const handleDeleteSelfTest = async (selfTestId: string) => {
    if (confirm("Are you sure you want to delete this self-test?")) {
      await deleteSelfTest({ variables: { selfTestId } });
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      await deleteSelfTestQuestion({ variables: { questionId: questionId } });
    }
  };

  const handleEditComplete = () => {
    setEditingSelfTest(null);
    setEditingTitle(false);
    refetch();
  };

  const selfTests = data.getAllSelfTestsByUserId;

  if (playingSelfTest) {
    return (
      <SelfTestPlayer
        selfTest={playingSelfTest}
        onCompleted={() => setPlayingSelfTest(null)}
      />
    );
  }

  return (
    <div className={styles.selfTestsPage}>
      <h1 className={styles.pageTitle}>Manage Self Tests</h1>

      {/* Create New Self-Test */}
      {!editingTitle && (
        <div className={styles.createNewSection}>
          <h2 className={styles.sectionTitle}>Create a New Self-Test</h2>
          <SelfTestForm
            userId={userId}
            onCompleted={handleEditComplete}
          />
        </div>
      )}

      {/* List of Self-Tests */}
      <h2 className={styles.sectionTitle}>Your Self-Tests</h2>
      {selfTests.length === 0 ? (
        <p className={styles.noSelfTests}>No self-tests found. Start by creating one!</p>
      ) : (
        <div className={styles.selfTestList}>
          {selfTests.map((selfTest: any) => (
            <div key={selfTest.id} className={styles.selfTestItem}>
              <div className={styles.selfTestHeader}>
                {editingTitle && editingSelfTest?.id === selfTest.id ? (
                  <div className={styles.editTitleForm}>
                    <SelfTestForm
                      userId={userId}
                      selfTestId={selfTest.id}
                      initialTitle={selfTest.title}
                      onCompleted={handleEditComplete}
                    />
                  </div>
                ) : (
                  <>
                    <h3 className={styles.selfTestTitle}>{selfTest.title}</h3>
                    <div className={styles.buttonGroup}>
                      <button 
                        className={styles.button} 
                        onClick={() => {
                          setEditingSelfTest(selfTest);
                          setEditingTitle(true);
                        }}
                      >
                        Edit Title
                      </button>
                      <button className={styles.button} onClick={() => handleDeleteSelfTest(selfTest.id)}>Delete</button>
                      <button className={styles.button} onClick={() => setPlayingSelfTest(selfTest)}>Play</button>
                    </div>
                  </>
                )}
              </div>

              {/* Questions Section - Always visible */}
              <h4 className={styles.questionsHeader}>Questions:</h4>
              {selfTest.selfTestQuestions.length === 0 ? (
                <p className={styles.noQuestions}>No questions found for this self-test.</p>
              ) : (
                <ul className={styles.questionsList}>
                  {selfTest.selfTestQuestions.slice(0, 3).map((question: any) => (
                    <li key={question.id} className={styles.questionItem}>
                      <div className={styles.questionContent}>
                        <p><strong>Q:</strong> {question.text}</p>
                      </div>
                      <div className={styles.buttonGroup}>
                        <button
                          className={styles.button}
                          onClick={() => setEditingQuestion({
                            ...question,
                            selfTestId: selfTest.id,
                          })}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.button}
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                  {selfTest.selfTestQuestions.length > 3 && (
                    <li className={styles.moreQuestions}>. . .</li>
                  )}
                </ul>
              )}

              {/* Question Form Section */}
              {(addingQuestionToSelfTestId === selfTest.id || (editingQuestion && editingQuestion.selfTestId === selfTest.id)) && (
                <SelfTestQuestionForm
                  selfTestId={selfTest.id}
                  userId={userId}
                  questionId={editingQuestion?.id}
                  initialText={editingQuestion?.text}
                  initialCorrectAnswer={editingQuestion?.correctAnswer}
                  onCompleted={() => {
                    setAddingQuestionToSelfTestId(null);
                    setEditingQuestion(null);
                    refetch();
                  }}
                />
              )}

              {!editingQuestion && (
                <button 
                  className={styles.addQuestionButton} 
                  onClick={() => setAddingQuestionToSelfTestId(selfTest.id)}
                >
                  {addingQuestionToSelfTestId === selfTest.id ? "Cancel" : "Add Question"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelfTestsPage;