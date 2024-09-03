import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchItems, createItem, updateItem, deleteItem } from "./todosSlice";

const TodosComponent = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.items);
  console.log(items);

  useEffect(() => {
    dispatch(fetchItems());
  }, [status, dispatch]);

  const handleCreateItem = () => {
    const newItem = "Yeni todo";
    dispatch(createItem(newItem));
  };

  const handleUpdateItem = (id) => {
    const updatedItem = { id, text: "todonu yeniledik" };
    dispatch(updateItem(updatedItem));
  };

  const handleDeleteItem = (id) => {
    dispatch(deleteItem(id));
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={handleCreateItem}>Create Item</button>
      <ul>
        {items?.items.map((item) => (
          <li key={item.id}>
            {item.item}
            <button onClick={() => handleUpdateItem(item.id)}>Update</button>
            <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodosComponent;
