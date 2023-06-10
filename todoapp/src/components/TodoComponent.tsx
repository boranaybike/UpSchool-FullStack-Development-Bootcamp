import { useState } from "react";
import { Button, List, Input } from "semantic-ui-react";

interface Task {
  id: number;
  task: string;
  isCompleted: boolean;
  createdDate: Date;
}

function sortArray(arr: Task[], order: string) {
  if (order === "asc") {
    return arr.sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());
  } else if (order === "desc") {
    return arr.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
  }
}

const TodoComponent = () => {
  const [todoList, setTodoList] = useState<Task[]>([]);
  const [newTaskValue, setNewTaskValue] = useState("");
  const [order, setOrder] = useState("asc");

  const addTask = () => {
    const todoArray: Task[] = [...todoList];

    const id = todoArray[todoArray.length - 1]?.id ? (todoArray[todoArray.length - 1].id += 1) : 1;
    const task: Task = {
      id: id,
      task: newTaskValue,
      isCompleted: false,
      createdDate: new Date(),
    };
    todoArray.push(task as Task);

    setTodoList(todoArray);
    setNewTaskValue("");
  };

  const changeIsCompleted = (event: any, item: Task) => {
    const completedTask = event.detail == 2 ? true : false;
    const todoArray: Task[] = [...todoList];

    const index = todoArray.indexOf(item);
    todoArray.splice(index, 1);

    const editedTask: Task = {
      ...item,
      isCompleted: completedTask,
    };
    todoArray.push(editedTask as Task);

    setTodoList(todoArray);
  };

  const removeTask = (item: Task) => {
    const todoArray: Task[] = [...todoList];

    if (alert("Do you want to remove this task?") !== null) {
      const index = todoArray.indexOf(item);
      todoArray.splice(index, 1);
      setTodoList(todoArray);
    }
  };

  const filteredTask = sortArray(todoList, order);

  return (
    <>
      <h2>My To Do App</h2>
      <Input
        type="text"
        placeholder="Add new task..."
        action={
          <Button circular color="linkedin" icon="add" disabled={!newTaskValue} onClick={addTask}>
            {/* <Icon name="add" inverted circular link /> */}
          </Button>
        }
        value={newTaskValue}
        onChange={(event) => setNewTaskValue(event.target.value)}
      />
      <h2>Todos</h2>
      <h3>Order By Date</h3>
      <Button.Group>
        <Button toggle active={order == "desc"} onClick={() => setOrder("desc")}>
          Descending
        </Button>
        <Button.Or />
        <Button toggle active={order == "asc"} onClick={() => setOrder("asc")}>
          Ascending
        </Button>
      </Button.Group>
      <List animated divided verticalAlign="middle" size="big">
        {filteredTask!.map((x, index) => (
          <List.Item key={index}>
            <List.Content floated="right">
              <Button circular color="google plus" icon="trash" onClick={() => removeTask(x)}></Button>
            </List.Content>
            <List.Content verticalAlign="middle" onClick={(event: any) => changeIsCompleted(event, x)}>
              <List.Header>{x.isCompleted ? <s>{x.task}</s> : <span>{x.task}</span>}</List.Header>
            </List.Content>
          </List.Item>
        ))}
      </List>
    </>
  );
};

export default TodoComponent;
