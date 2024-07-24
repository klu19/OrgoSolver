import React, { Fragment } from 'react';
import './App.css';

// Components
import InputTodo from './components/InputTodos';
import ListTodos from './components/ListTodo';
import ChemicalDrawingTool from './components/ChemicalDrawingTool';

function App() {
  return (
    <Fragment>
      <div className="container">
        <InputTodo />
        <ListTodos />
        <ChemicalDrawingTool />
      </div>
    </Fragment>
  );
}

export default App;
