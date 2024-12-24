import { configureStore } from "@reduxjs/toolkit";
import itemsReducer from "../features/todos/todosSlice";

const store = configureStore({
  reducer: {
    items: itemsReducer,
  },
});

export default store;
