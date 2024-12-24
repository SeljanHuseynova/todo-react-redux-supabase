import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TodosComponent from "./TodosComponent";
import { clearAllTodos, createItem, fetchItems } from "./todosSlice";

const TodoForm = () => {
  const dispatch = useDispatch();
  const [newItem, setNewItem] = useState("");
  const items = useSelector((state) => state.items.items);
  const totalTasks = items.length;
  const completedTasks = items.filter((item) =>  item.completed).length;

  const handleCreateItem = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      dispatch(createItem(newItem.trim())).then(() => dispatch(fetchItems()));
      setNewItem("");
    }
  };
  


  const clearTodos = () => {
    dispatch(clearAllTodos());
  };

  return (
    <div className="container">
      <form onSubmit={handleCreateItem}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button>Add</button>
      </form>
      <TodosComponent />
      <div className="bottom">
        <div className="top">
        <p>You have {totalTasks} tasks.</p>
        <p>You complete {completedTasks} tasks.</p>
        </div>
        {totalTasks > 0 && <button onClick={clearTodos}>Clear All</button>}
      </div>
    </div>
  );
};

export default TodoForm;
