import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import TodoComponent from "./components/TodoComponent";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="card">
        <TodoComponent />
      </div>
    </>
  );
}

export default App;
