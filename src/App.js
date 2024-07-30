import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import EntryPage from "./entryPage";
import ExitPage from "./exitPage";

function App() {
  const [currentPage, setCurrentPage] = useState(null);
  return (
    <>
      <div>
        {!currentPage && (
          <>
            <h1>Which form do you want to use?</h1>
            <button
              className="btn-style"
              onClick={() => setCurrentPage("Entry")}
            >
              Entry Form
            </button>
            <button
              className="btn-style"
              onClick={() => setCurrentPage("Exit")}
            >
              Exit Form
            </button>
          </>
        )}
      </div>
      <div className="App">
        {currentPage && (
          <div>
            <button onClick={() => setCurrentPage(null)}>&#x25c0;{" Back"}</button>
          </div>
        )}
        {currentPage === "Entry" ? (
          <EntryPage />
        ) : (
          currentPage === "Exit" && <ExitPage />
        )}
      </div>
    </>
  );
}

export default App;
