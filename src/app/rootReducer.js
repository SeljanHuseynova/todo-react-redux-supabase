import { combineReducers } from "@reduxjs/toolkit";
import itemsReducer from "../features/todos/todosSlice";

const rootReducer = combineReducers({
  items: itemsReducer,
});

export default rootReducer;
