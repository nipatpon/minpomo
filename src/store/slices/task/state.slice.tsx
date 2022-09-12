import { 
	createAsyncThunk,
	createSelector,
	createSlice, 
} from "@reduxjs/toolkit"; 
import { TasksState } from "./type"; 

export const selectTaskStateAsync = createAsyncThunk(
	"task/selectTaskState",
	async (payload: number, { getState }) => {
		console.log("payload", payload); 
		return payload;
	}
);

export const updateTaskStateAsync = createAsyncThunk(
	"task/updateTaskState",
	async (payload: TasksState, { getState }) => {
		return payload;
	}
);

const initialState = {
	status: "idle",
	error: null,
	currentRequestId: undefined,
	currentFormID: null,
	currentFormIndex: null,
	currentLanguage: "en",
	filters: undefined,
	sort: undefined,
	forms: [],
} as TasksState;

// Redux Toolkit slice
const taskStateSlice = createSlice({
	name: "tasksState",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		// ----- Select ----- 
		builder.addCase(selectTaskStateAsync.fulfilled, (state, action) => {
			if (state.status === "pending") { 
				state.error = null;
				state.currentRequestId = undefined;
			}
		}); 
		// ----- Update -----
		builder.addCase(updateTaskStateAsync.pending, (state, action) => {
			if (state.status === "idle") {
				state.status = "pending";
				state.error = null;
				state.currentRequestId = action.meta.requestId;
			}
		}); 
		builder.addCase(updateTaskStateAsync.fulfilled, (state, action) => {
			if (state.status === "pending") {
				const { forms } = action.payload;
				state.forms = forms;
				state.error = null;
				state.currentRequestId = undefined;
			}
		});
		builder.addCase(updateTaskStateAsync.rejected, (state, action) => {
			const { requestId } = action.meta;
			if (state.status === "pending" && state.currentRequestId === requestId) {
				state.status = "idle";
				state.error = action.error;
				state.currentRequestId = undefined;
			}
		});
	},
});

export default taskStateSlice.reducer;

