import React from 'react';

import taskStore from './store/tasks';

import logo from './logo.svg';
import './App.css';

window.taskStore = taskStore;

class BaseComponent extends React.PureComponent {
  rerender = () => {
    this.setState({
      _rerender: new Date(),
    });
  }
}

class App extends BaseComponent {
  state = {
    isInitialized: false,
  }

  render() {
    if (!this.state.isInitialized) {
      return null;
    }

    return (
      <Home />
      // userStore.data.email ? (
      //   <Home />
      // ) : (
      //   <Login />
      // )
    );
  }
  async componentDidMount() {
    taskStore.setName("task-manager");
    await taskStore.initialize();
    this.setState({
      isInitialized: true,
    });
  }

    // this.taskStore = taskStore.subscribe(this.rerender);
  // }

  async componentDidUpdate() {
    // if (userStore.data.email && !todosStore.isInitialized) {
      console.log('popup initialize all offline data...');
      taskStore.setName("task-manager");
      await taskStore.initialize();
      console.log('popup done');
    // }
  }

  componentWillUnmount() {
    this.unsubUser();
  }

}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

class Home extends BaseComponent {
  state = {
    input_text: '',
  }

  render() {
    return (
      <div>
        <p>
          halo {taskStore.data.content} <button onClick={this.logout}>logout</button>
        </p>

        <h2>
          todos: <button onClick={this.upload}>
            {`upload (${taskStore.countUnuploadeds()})`}
          </button>
        </h2>
        <pre>
          {/* last upload: {taskStore.dataMeta.tsUpload} */}
        </pre>
        {
          taskStore.data.map((todo, index) => (
            <p key={todo._id}>
              {index + 1}. {todo.text}
              {
                !taskStore.checkIsUploaded(todo) && (
                  ` (belum upload)`
                )
              }
              {` `}
              <button onClick={() => this.deleteTodo(todo._id)}>
                X
              </button>
            </p>
          ))
        }

        <h2>add new todo</h2>
        <form onSubmit={this.addTodo}>
          <p><input type='text' value={this.state.input_text} onChange={this.setInput_text} /></p>
          <p><button>submit</button></p>
        </form>
      </div>
    );
  }

  componentDidMount() {
    this.unsubTodos = taskStore.subscribe(this.rerender);
  }

  componentWillUnmount() {
    this.unsubTodos();
  }

  setInput_text = (event) => {
    this.setState({
      input_text: event.target.value,
    });
  }

  logout = async () => {
    await taskStore.deinitialize();
    // await userStore.deleteSingle();
  }

  addTodo = async (event) => {
    event.preventDefault();
    await taskStore.addItem({
      text: this.state.input_text,
    }, taskStore.data);
    this.setState({ input_text: '' });
  }

  deleteTodo = async (id) => {
    taskStore.deleteItem(id, taskStore.data);
  }

  upload = async () => {
    console.log('uploading...');
    try {
      await taskStore.upload();
      console.log('upload done');
    } catch (err) {
      alert(err.message);
      console.log('upload failed');
    }
  }
}

export default App;
