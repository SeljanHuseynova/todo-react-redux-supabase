import { useSelector, useDispatch } from "react-redux";
import { updateItem, deleteItem, fetchItems, completeTodo } from "./todosSlice";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import Error from "./Error";

const TodosComponent = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.items);

  console.log(items);
  const [editId, setEditId] = useState(null);
  const [editedTodo, setEditedTodo] = useState("");

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]); // React Hook useEffect has a missing dependency:'dispatch'.

  const handleUpdateItem = (item) => {
    if (!item.completed) {
      setEditId(item.id);
      setEditedTodo(item.item);
    }
  };

  const handleSave = (item) => {
    if (editedTodo.trim()) {
      const updatedItem = { ...item, item: editedTodo };
      dispatch(updateItem(updatedItem)).then(() => dispatch(fetchItems()));
      setEditId(null);
      setEditedTodo("");
    }
  };

  const handleDeleteItem = (id) => {
    dispatch(deleteItem(id));
  };

  const completeTodos = (item) => {
    dispatch(completeTodo(item));
  };

  status === "loading" && <Spinner />;
  status === "failed" && <Error />;

  // console.log(items);
  return (
    <div className="todo-list">
      <ul>
        {items?.map((item) => (
          <li key={item.id }>
            {editId === item.id ? (
              <div className="li-container">
                <input
                  type="text"
                  value={editedTodo}
                  onChange={(e) => setEditedTodo(e.target.value)}
                  className="save-input"
                />
                <button onClick={() => handleSave(item)} className="save-btn">
                  Save
                </button>
              </div>
            ) : (
              <div className="li-container">
                <p
                  onClick={() => completeTodos(item)}
                  className={item.completed ? "completed" : "task"}
                  style={{ cursor: "pointer" }}
                >
                  {item.item}
                </p>
                <div className="icons">
                  <button
                    onClick={() => handleUpdateItem(item)}
                    className="update"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodosComponent;
