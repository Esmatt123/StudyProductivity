// src/Components/TaskList.tsx
import React from 'react';
import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';
import styles from '../../src/Styles/_todoPage.module.css';

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

interface List {
  todoTaskListId: number;
  name: string;
  position: number;
  userId: string | null; // Make this consistent across all uses
  todoTasks: Task[];
}

interface TaskListProps {
  list: List;
  handleMoveTask: (
    taskId: number,
    targetListId: number,
    newPosition: number
  ) => Promise<void>;
  handleDeleteTask: (taskId: number) => Promise<void>;
  userId: string | null;
}

const TaskList = ({ list, handleMoveTask, handleDeleteTask, userId }: TaskListProps) => {

  // UseDrop hook for the TaskList itself
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item: { taskId: number }) => {
      const { taskId } = item;
      const targetListId = list.todoTaskListId;

      // Assign a unique position to the task
      const newPosition = getNextPosition(list.todoTasks);

      // Move the task to the new list and position
      handleMoveTask(taskId, targetListId, newPosition);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // Function to get the next available position
  const getNextPosition = (tasks: Task[]) => {
    const positions = tasks.map((task) => task.position);
    return positions.length > 0 ? Math.max(...positions) + 1 : 0;
  };

  // Sort tasks by position
  const sortedTasks = [...list.todoTasks].sort((a, b) => a.position - b.position);

  return (
    <>
    <h3>{list.name}</h3>
    <div ref={drop as any} className={styles.taskList} style={{ backgroundColor: isOver ? '#f0f0f0' : '#5d88f5' }}>
        <p>Drop here</p>
      {sortedTasks.map((task) => (
        <TaskGroup
          key={task.todoTaskId}
          task={task}
          listId={list.todoTaskListId}
          handleMoveTask={handleMoveTask}
          handleDeleteTask={handleDeleteTask}
          userId={userId}
        />
      ))}
    </div>
    </>
  );
};

interface TaskGroupProps {
  task: Task;
  listId: number;
  handleMoveTask: (
    taskId: number,
    targetListId: number,
    newPosition: number
  ) => Promise<void>;
  handleDeleteTask: (taskId: number) => Promise<void>;
  userId: string | null;
}

const TaskGroup = ({
  task,
  listId,
  handleMoveTask,
  handleDeleteTask,
  userId
}: TaskGroupProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item: { taskId: number }) => {
      const { taskId } = item;
      const targetListId = listId;

      if (task.todoTaskId === taskId) {
        // Dropped onto itself, do nothing
        return;
      }

      // Swap positions with the existing task
      handleSwapTasks(taskId, task.todoTaskId, targetListId);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // Function to swap positions of two tasks
  const handleSwapTasks = async (
    draggedTaskId: number,
    targetTaskId: number,
    targetListId: number
  ) => {
    try {
      await handleMoveTask(draggedTaskId, targetListId, task.position);
      await handleMoveTask(targetTaskId, targetListId, task.position + 1); // Adjust position to avoid conflict
    } catch (error) {
      console.error('Error swapping tasks:', error);
    }
  };

  const groupStyle = {
    backgroundColor: isOver ? 'lightblue' : 'white',
    
  };

  return (
    <div ref={drop as any} style={groupStyle} className={styles.taskItemContainer}>
      <TaskCard
        key={task.todoTaskId}
        task={task}
        handleDeleteTask={handleDeleteTask}
        userId={userId}
      />
    </div>
  );
};

export default TaskList;