import {
	createAction,
	createAsyncThunk,
	createSlice,
	Draft,
	PayloadAction,
} from "@reduxjs/toolkit";
import { ReactElement } from "react";
import { clearTaskAsync } from "../task/form.slice";
export type appModalState = {
	isVisible: boolean;
	type?: "modal" | "confirm" | "task_form";
	contents?: ReactElement;
	handleConfirm?: () => void;
	handleCancel?: () => void;
};

const initialState: appModalState = {
	isVisible: false,
	type: "confirm",
	contents: <></>,
} as const;

export const openModalAsync = createAsyncThunk(
	"task/openModal",
	async (payload: appModalState, thunAPI) => {
		return payload;
	}
);

export const closeModalAsync = createAsyncThunk(
	"task/closeModal",
	async ({}, thunAPI) => { 
		return;
	}
);

export const appModalSlice = createSlice({
	name: "appModal",
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder.addCase(openModalAsync.fulfilled, (state, action) => {
			const {
				isVisible,
				type,
				contents,
				handleConfirm = () => {},
				handleCancel = () => {},
			} = action.payload;
			state.isVisible = isVisible;
			state.type = type;
			state.contents = contents;
			state.handleConfirm = handleConfirm;
			state.handleCancel = handleCancel;
		});
		builder.addCase(closeModalAsync.fulfilled, (state, action) => {
			state.isVisible = false;
		});
	},
});

// export const { openModal, closeModal } = appModalSlice.actions;

export default appModalSlice.reducer;
