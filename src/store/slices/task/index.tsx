import { combineReducers } from "@reduxjs/toolkit";
import taskStateSlice from "./state.slice";
import taskFormSlice from "./form.slice";

export default combineReducers({
    state: taskStateSlice,
    form: taskFormSlice
})