import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { default as dayjs } from "dayjs";
import utc from "dayjs/plugin/utc"; 
import { v4 as uuidv4 } from "uuid";
import { openModalAsync } from "../app-modal/app-modal.slice";
import { updateTaskStateAsync } from "./state.slice";
import { TaskForm, TasksState, TTaskForm } from "./type";

dayjs.extend(utc);
dayjs.utc();

const formState: TTaskForm = {
	id: null,
	uuid: null,
	title: null,
	date: dayjs(new Date()).toDate(),
	startTime: dayjs(new Date()).format(`HH:mm`),
	pomoDuration: 25,
	shortBreakDuration: 5,
	longBreakDuration: 15,
	roundLimit: 4,
	round: 0,
	status: "new",
	category: 'generals'
};

const initialState = {
	status: "idle",
	error: null,
	currentRequestId: undefined,
	form: formState,
} as TaskForm;

function fakeWait() {
	return new Promise<boolean>((resolve, reject) => {
		try {
			setTimeout(() => {
				resolve(true);
			}, 3000);
		} catch (error) {
			reject(false);
		}
	});
}

export const selectTaskAsync = createAsyncThunk(
	"task/selectTask",
	async (payload: TTaskForm, { dispatch, getState }: any) => {
		return payload;
	}
);

export const initTaskAsync = createAsyncThunk(
	"task/initTask",
	async ({}, { dispatch, getState }: any) => {
		return formState;
	}
);

export const createTaskAsync = createAsyncThunk(
	"task/createTask",
	async (payload: TTaskForm, { dispatch, getState }: any) => {

		const taskState: TasksState = getState().task.state;
		Object.freeze(taskState);
		let forms: TTaskForm[] = taskState.forms;
		let createTask = {
			...payload,
			id: -1,
			uuid: uuidv4(),
		}; 
		forms = [...forms, createTask];

		// await fakeWait();

		dispatch(updateTaskStateAsync({ ...taskState, forms }));
		return payload;
	}
);

export const updateTaskAsync = createAsyncThunk(
	"task/updateTask",
	async (payload: TTaskForm, { dispatch, getState }: any) => {
		const taskState: TasksState = getState().task.state;
		Object.freeze(taskState);  
		let forms: TTaskForm[] = taskState.forms.map((task: TTaskForm) => {
			if (task.uuid === payload.uuid) {  
			  return payload;
			} else { 
			  return task;
			}
		  })   
		dispatch(updateTaskStateAsync({ ...taskState, forms }));
		return payload;
	}
);

export const clearTaskAsync = createAsyncThunk(
	"task/clearTask",
	async (payload, thunkAPI) => {
		return payload;
	}
);

export const deleteTaskAsync = createAsyncThunk(
	"task/deleteTask",
	async (payload: TTaskForm, { getState, dispatch }: any) => {
		const taskState: TasksState = getState().task.state;
		Object.freeze(taskState);
		let forms: TTaskForm[] = taskState.forms;
		let deletedTask = forms.filter(
			(task: TTaskForm) => task.uuid !== payload.uuid
		);
		forms = [...deletedTask];
		dispatch(updateTaskStateAsync({ ...taskState, forms }));
		return payload;
	}
);

// Redux Toolkit slice
const taskFormSlice = createSlice({
	name: "tasksForm",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		//======= SELECT ONE
		builder.addCase(selectTaskAsync.fulfilled, (state, action) => {
			state.form = action.payload;
		});
		//======= INITIAL
		builder.addCase(initTaskAsync.fulfilled, (state, action) => {
			state.form = action.payload;
		});
		//======= CREATE
		builder.addCase(createTaskAsync.pending, (state, action) => {
			state.status = 'pending';
		});
		builder.addCase(createTaskAsync.fulfilled, (state, action) => {
			state.form = action.payload;
			state.status = 'idle';
		}); 
		//======= UPDATE
		builder.addCase(updateTaskAsync.pending, (state, action) => {
			state.status = 'pending';
		});
		builder.addCase(updateTaskAsync.fulfilled, (state, action) => {
			state.form = action.payload; 
			state.status = 'idle'; 
		});
		//======= DELETE
		builder.addCase(deleteTaskAsync.fulfilled, (state, action) => {
			state.form = formState;
		}); 
		//======= CREAR SELECT
		builder.addCase(clearTaskAsync.fulfilled, (state, action) => {
			state.form = formState;
		});
	},
});

export default taskFormSlice.reducer;
