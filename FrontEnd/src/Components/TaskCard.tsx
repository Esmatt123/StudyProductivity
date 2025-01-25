import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useDrag } from 'react-dnd';
import {
  UPDATE_TASK_MUTATION,
  GET_LISTS_BY_USER_ID,
} from '../../src/api/graphql';
import styles from '../Styles/_taskCard.module.css';
import { faCheckCircle, faCircle, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


interface Task {
  todoTaskId: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate: string;
  position: number;
  todoTaskListId: number;
  userId: string | null; // Make this consistent across all uses
}

interface TaskCardProps {
  task: Task;
  handleDeleteTask: (taskId: number) => void;
  userId: string | null;
}

const TaskCard = ({ task, handleDeleteTask, userId }: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [isComplete, setIsComplete] = useState(task.isCompleted);

  const [updateTaskMutation] = useMutation(UPDATE_TASK_MUTATION);

  // Toggle task completion when clicking on the task card
  const toggleCompletion = async () => {
    try {
      const updatedTask = {
        todoTaskId: task.todoTaskId,
        title: task.title,
        description: task.description || '',
        isCompleted: !isComplete, // Toggle the completion status
        dueDate: task.dueDate || null,
        position: task.position,
        todoTaskListId: task.todoTaskListId,
        userId: userId,
      };

      await updateTaskMutation({
        variables: { input: updatedTask },
        refetchQueries: [{ query: GET_LISTS_BY_USER_ID, variables: { userId } }],
        onCompleted: () => {
          setIsComplete(!isComplete); // Toggle the state locally after mutation
        },
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleSave = async () => {
    try {
      const updatedTask = {
        todoTaskId: task.todoTaskId,
        title: editTitle,
        description: editDescription,
        isCompleted: isComplete,
        dueDate: task.dueDate || null,
        position: task.position,
        todoTaskListId: task.todoTaskListId,
        userId: userId,
      };

      await updateTaskMutation({
        variables: { input: updatedTask },
        refetchQueries: [{ query: GET_LISTS_BY_USER_ID, variables: { userId } }],
        onCompleted: () => {
          setIsEditing(false);
          setEditTitle(updatedTask.title);
          setEditDescription(updatedTask.description || '');
          setIsComplete(updatedTask.isCompleted);
        },
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  // Modify the useDrag hook to use 'item' as a function
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: () => ({
      taskId: task.todoTaskId,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const style = {
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    borderRadius: '5px',
  };

  return (
    <div ref={drag as any} className={styles.taskItemContainer} style={style}>
      {isEditing ? (
        <div className={styles.editForm}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description"
          />
          <div className={styles.editFormButtons}>
            <button className={styles.saveButton} onClick={handleSave}>Save</button>
            <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className={styles.dragItemContainer} onClick={toggleCompletion}>
          <div className={styles.draggableItem} style={{ backgroundColor: isComplete ? 'rgb(96, 186, 96)' : '#0056b3' , cursor: isDragging ? 'grabbing' : 'grab'}}>
            <div>
              <p className={styles.title}>
                <strong>{task.title}</strong>
              </p>
              {task.description && <p>{task.description}</p>}
            </div>
            <div className={styles.taskCardButtons}>
            <button className={styles.toggleButton} onClick={toggleCompletion}><FontAwesomeIcon icon={isComplete ? faCheckCircle : faCircle} /> </button>
              <button className={styles.editButton} onClick={() => setIsEditing(true)}><FontAwesomeIcon icon={faPen} /></button>
              <button className={styles.deleteButton} onClick={() => handleDeleteTask(task.todoTaskId)}><FontAwesomeIcon icon={faTrash} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
