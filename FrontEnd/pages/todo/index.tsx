// TodoPage.tsx
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_LISTS_BY_USER_ID,
  ADD_LIST_MUTATION,
  DELETE_LIST_MUTATION
} from '../../src/api/graphql';
import { useUserId } from '../../src/providers/useUserId';
import { useTaskOperations } from '../../src/hooks/useTaskOperations';
import styles from '../../src/Styles/_todoPage.module.css';
import TaskList from '../../src/Components/TaskList';


interface Task {
  todoTaskId: number;
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate: string;
  position: number;
  todoTaskListId: number;
  userId: string | null;
}

interface List {
  todoTaskListId: number;
  name: string;
  position: number;
  userId: string | null; // Make this consistent across all uses
  todoTasks: Task[];
}

const TodoPage = () => {
  const [newListName, setNewListName] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedListId, setSelectedListId] = useState<number | null>(null);

  const { userId } = useUserId();

  const { data, loading, error } = useQuery(GET_LISTS_BY_USER_ID, {
    variables: { userId }
  });
  const {
    handleAddTask: taskOperationsAddTask,
    handleDeleteTask,
    handleMoveTask
  } = useTaskOperations(userId);

  const [addList] = useMutation(ADD_LIST_MUTATION);
  const [deleteList] = useMutation(DELETE_LIST_MUTATION);

  const handleAddList = async () => {
    try {
      if (!newListName) return;
    await addList({
      variables: {
        input: {
        name: newListName,
        position: data?.getListsByUserId?.length + 1 || 1,
        userId: userId
      }
      },
      refetchQueries: [{ query: GET_LISTS_BY_USER_ID, variables: { userId } }]
    });
    setNewListName('');
    } catch (error) {
      console.error("Error creating list: ",JSON.stringify(error, null, 2))
    }
    
  };

  const handleAddTask = async () => {
    if (!newTaskTitle || selectedListId == null) return;

    const selectedList = data.getListsByUserId.find(
      (list: List) => list.todoTaskListId === selectedListId
    );
    const newPosition = (selectedList?.todoTasks.length || 0) + 1;

    await taskOperationsAddTask({
      title: newTaskTitle,
      description: newTaskDescription,
      dueDate: new Date().toISOString(),
      position: newPosition,
      todoTaskListId: selectedListId,
      userId: userId
    });

    setNewTaskTitle('');
    setNewTaskDescription('');
    setSelectedListId(null); // Reset selectedListId to close the form after adding the task
  };

  const handleDeleteList = async (listId: number) => {
    await deleteList({
      variables: {
        todoTaskListId: listId,
        userId
      },
      refetchQueries: [{ query: GET_LISTS_BY_USER_ID, variables: { userId } }]
    });
  };

  const renderLists = () => {
    return data.getListsByUserId.map((list: List) => (
      <div key={list.todoTaskListId} className={styles.list}>

        <TaskList
          list={list}
          handleMoveTask={handleMoveTask}
          handleDeleteTask={handleDeleteTask}
          userId={userId}
        />
        <button
          className={styles.addTaskBtn}
          onClick={() => setSelectedListId(list.todoTaskListId)}
        >
          Add Task to List
        </button>
        <button
          className={styles.delete}
          onClick={() => handleDeleteList(list.todoTaskListId)}
        >
          Delete List
        </button>
      </div>
    ));
  };

  const renderAddTaskForm = () => {
    if (selectedListId == null) return null;

    return (
      <div className={styles.addTaskForm}>
        <input
          type="text"
          placeholder="Task Title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <textarea
          placeholder="Task Description"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />
        <button className={styles.addButton} onClick={handleAddTask}>Add Task</button>
        <button className={styles.cancelButton} onClick={() => setSelectedListId(null)}>Cancel</button>
      </div>
    );
  };

  

  return (
    <div className={styles.todoPage}>
      <div>
      <h1>Todo Lists</h1>
      <div className={styles.headerContainer}>
        <input
        className={styles.listInput}
          type="text"
          placeholder="New List Name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
        <button className={styles.addListButton} onClick={handleAddList}>Add List</button>
      </div>
      </div>
      <div className={styles.taskContainer}>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        renderLists()
      )}
      {renderAddTaskForm()}
      </div>
    </div>
  );
};

export default TodoPage;