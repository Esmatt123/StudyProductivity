// src/hooks/useTaskOperations.ts
import { useMutation } from '@apollo/client';
import {
  ADD_TASK_MUTATION,
  DELETE_TASK_MUTATION,
  MOVE_TASK_MUTATION,
  GET_LISTS_BY_USER_ID,
} from '../api/graphql';

interface Task {
  title: string;
  description?: string;
  dueDate: string;
  position: number;
  todoTaskListId: number;
  userId: string | null; // Make this consistent across all uses
}

export const useTaskOperations = (userId: string | null) => {
  const [addTaskMutation] = useMutation(ADD_TASK_MUTATION);
  const [deleteTaskMutation] = useMutation(DELETE_TASK_MUTATION);
  const [moveTaskMutation] = useMutation(MOVE_TASK_MUTATION);

  const handleAddTask = async (taskInput: Task) => {
    await addTaskMutation({
      variables: { input: taskInput },
      refetchQueries: [{ query: GET_LISTS_BY_USER_ID, variables: { userId } }],
    });
  };

  const handleDeleteTask = async (taskId: number) => {
    await deleteTaskMutation({
      variables: { todoTaskId: taskId, userId },
      refetchQueries: [{ query: GET_LISTS_BY_USER_ID, variables: { userId } }],
    });
  };

  const handleMoveTask = async (
    taskId: number,
    targetListId: number,
    newPosition: number
  ) => {
    await moveTaskMutation({
      variables: {
        todoTaskId: taskId,
        targetListId,
        newPosition,
        userId,
      },
      refetchQueries: [{ query: GET_LISTS_BY_USER_ID, variables: { userId } }],
    });
  };

  return {
    handleAddTask,
    handleDeleteTask,
    handleMoveTask,
  };
};