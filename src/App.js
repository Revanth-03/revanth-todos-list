import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [tasks, setTasks] = useState([]); //state to store the list of tasks
  const [newTask, setNewTask] = useState(""); //state to store new task input
  const [newTitle, setNewTitle] = useState(""); //state to store updated task title
  const [editTaskId, setEditTaskId] = useState(false); //state to track editing mode

  // Function to handle adding a new task
  function handleNewTask() {
    if (newTask.length !== 2) {
      axios
        .post("https://jsonplaceholder.typicode.com/todos", {
          title: newTask,
          completed: false,
          userId: 1,
        })
        .then(
          (
            response
          ) => setTasks([response.data, ...tasks])
        );
      setNewTask("");
    }
    setNewTask("");
  }

  // Function to handle setting editing mode for a task
  function handleEditingMode(taskId) {
    setEditTaskId(taskId);
  }

  // Function to handle updating an existing task
  function handleUpdate() {
    axios
      .put(`https://jsonplaceholder.typicode.com/todos/${editTaskId}`, {
        title: newTitle,
        completed: false,
      })
      .then((response) => {
        const updatedTask = response.data;
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id == updatedTask.id ? updatedTask : task
          )
        );
      });
    setEditTaskId(false);
  }

  // Function to handle deleting an existing task
  function handleDelete(taskId) {
    const newTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(newTasks);

    axios
      .delete(`https://jsonplaceholder.typicode.com/todos/${taskId}`)
      .then((response) => console.log(response))
      .catch((err) => {
        console.log(err);
      });
  }

  // useEffect hook to fetch initial tasks data from API
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/todos")
      .then(
        (
          response 
        ) => setTasks(response.data)
      )

      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="container">
      {/* Header */}
      <div className="row mt-5">
        <h1 className="mt-5" style={{ textAlign: "center" }}>
          ToDoList App
        </h1>
      </div>

      {/* Input form */}
      <div className="col mt-5">
        <nav className="navbar navbar-light ">
          <div className="container-fluid">
            <form className="d-flex ">
              <input
                className="form-control me-3"
                type="Search"
                placeholder="Create Tasks"
                aria-label="new-task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <button
                className="btn btn-outline-success"
                type="button"
                onClick={() => handleNewTask()}
              >
                ADD
              </button>
            </form>
          </div>
        </nav>
      </div>

      {/* Task list */}
      <div className="container mt-3">
        <div className="row mt-5">
          <div className="col mt-5">
            <ul className="list-group">
              {/* Iterate over tasks */}
              {tasks.map((task) => (
                <React.Fragment key={task.id}>
                  {/* Task item */}
                  <li
                    className={`list-group-item ${
                      task.completed ? "list-group-item-success" : ""
                    } m-1 fs-3`}
                    contentEditable={editTaskId === task.id}
                    onInput={(e) => setNewTitle(e.target.innerText)}
                  >
                    {task.title}
                  </li>

                  {/* Edit and Delete buttons */}
                  <div className="d-flex justify-content-end mt-2 mb-2">
                    {/* Show save button when editing */}
                    {editTaskId === task.id ? (
                      <>
                        <button
                          className="btn btn-success me-2 fs-5"
                          onClick={() =>
                            newTitle.trim().length > 0
                              ? handleUpdate()
                              : setEditTaskId(false)
                          }
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      // Show edit button when not editing
                      <button
                        className="btn btn-primary me-2 fs-5"
                        onClick={() => handleEditingMode(task.id, task.title)}
                      >
                        Edit
                      </button>
                    )}
                    {/* Delete button */}
                    <button
                      className="btn btn-danger fs-5"
                      onClick={() => handleDelete(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </React.Fragment>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
