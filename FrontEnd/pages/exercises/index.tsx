import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';
import styles from '../../src/Styles/_exercise-page.module.css';

// Import Font Awesome dependencies
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faBookOpen, faClipboardCheck, IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface ExerciseType {
  type: string;
  title: string;
  description: string;
  icon: IconDefinition; // Path to logo image or URL
  backgroundClass: string; // CSS class for background color
}

const Exercises: FunctionComponent = () => {
  const router = useRouter();

  // Define exercise types with title, description, icon, and background class
  const exerciseTypes: ExerciseType[] = [
    {
      type: 'quiz',
      title: 'Quiz Exercises',
      description: 'Test your knowledge with timed quizzes.',
      icon: faQuestionCircle,
      backgroundClass: styles.blueBackground,
    },
    {
      type: 'concept',
      title: 'Concept Exercises',
      description: 'Deepen your understanding of key concepts.',
      icon: faBookOpen,
      backgroundClass: styles.whiteBackground,
    },
    {
      type: 'self-test',
      title: 'Self-Test Exercises',
      description: 'Assess yourself with practice problems.',
      icon: faClipboardCheck,
      backgroundClass: styles.blackBackground,
    },
  ];

  const handleExerciseClick = (exerciseType: string) => {
    router.push(`/exercises/${exerciseType.toLowerCase()}`);
  };

  return (
    <div className={styles.exercisesPage}>
      <h1 className={styles.title}>Choose Your Exercise</h1>
      <div className={styles.grid}>
        {exerciseTypes.map((exercise, index) => (
          <div
            key={index}
            className={`${styles.gridItem} ${exercise.backgroundClass}`}
            onClick={() => handleExerciseClick(exercise.type)}
          >
            <div className={styles.iconContainer}>
              <FontAwesomeIcon icon={exercise.icon} className={styles.icon} />
            </div>
            <h2 className={styles.exerciseTitle}>{exercise.title}</h2>
            <p className={styles.exerciseDescription}>{exercise.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exercises;