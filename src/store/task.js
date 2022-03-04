import { createSlice } from "@reduxjs/toolkit";
import { setError } from "./errors";
import todosService from "./services/todos.service";

const initialState = { entities: [], isLoading: true };

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    recived(state, action) {
      state.entities = action.payload;
      state.isLoading = false;
    },
    update(state, action) {
      const elementIndex = state.entities.findIndex(
        (el) => el.id === action.payload.id
      );
      state.entities[elementIndex] = {
        ...state.entities[elementIndex],
        ...action.payload,
      };
    },
    remove(state, action) {
      state.entities = state.entities.filter(
        (el) => el.id !== action.payload.id
      );
    },
    taskRequested(state) {
      state.isLoading = true;
    },
    taskRequestFailed(state, action) {
      state.isLoading = false;
    },
  },
});

const { actions, reducer: taskReducer } = taskSlice;
const { recived, update, remove, taskRequested, taskRequestFailed } = actions;

export const loadTasks = () => async (dispatch) => {
  dispatch(taskRequested());
  try {
    const data = await todosService.fetch();
    dispatch(recived(data));
  } catch (error) {
    dispatch(taskRequestFailed(error.message));
    dispatch(setError(error.message));
  }
};

export const completeTask = (id) => (dispatch, getState) => {
  dispatch(update({ id, completed: true }));
};

export function titleChanged(id) {
  return update({ id, title: `New title for ${id}` });
}
export function taskDeleted(id) {
  return remove(id);
}

export const getTasks = () => (state) => {
  return state.tasks.entities;
};
export const getTasksLoadingStatus = () => (state) => {
  return state.tasks.isLoading;
};

export const createTask =
  ({ tasks }) =>
  async (dispatch) => {
    try {
      const data = await todosService.create();
      dispatch(recived([...tasks.entities, data]));
    } catch (error) {}
  };

export default taskReducer;
