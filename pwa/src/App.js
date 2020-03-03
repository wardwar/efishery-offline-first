import React from 'react';

import {  Checkbox,Table,Form,Button} from 'semantic-ui-react'

import taskStore from './store/tasks';

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
    isInitialized: false
    }

  render() {
    if (!this.state.isInitialized) {
      return null;
    }

    return (
      <Home />
    );
  }

  async componentDidMount() {
    taskStore.setName("task-manager");
    await taskStore.initialize();
    this.setState({
      isInitialized: true,
    });
  }

  async componentDidUpdate() {
  
      console.log('popup initialize all offline data...');
      taskStore.setName("task-manager");
      await taskStore.initialize();
      console.log('popup done');
  
  }

  componentWillUnmount() {
    this.unsubUser();
  }

}
class Home extends BaseComponent {
  constructor(props){
    super(props);
    this.state = {
      id:'',
      input_text: '',
      isEdit : false
    }
  }
  

  handleChange = (e,{value,checked,id}) => {
   this.editSingle({
     id,
     checked,
     value
   })
  }


  render() {
    return (
      <div className="ui container">
    <h2 className="title">{this.state.isEdit ?"Edit Task":"Add New Task"}</h2>
         <Form onSubmit={this.addTask}>
        <Form.Group>
          <Form.Input
            placeholder='Content'
            name='content'
            value={this.state.input_text}
             onChange={this.setInput_text}
            
          />
          <Form.Button content='Submit' />
        </Form.Group>
      </Form>
        
        <Table celled compact definition>
  <Table.Header fullWidth>
    <Table.Row>
      <Table.HeaderCell >Completation</Table.HeaderCell>
      <Table.HeaderCell>Content</Table.HeaderCell>
      <Table.HeaderCell>Created At</Table.HeaderCell>
      <Table.HeaderCell>Action</Table.HeaderCell>
    </Table.Row>
  </Table.Header>

  <Table.Body>
      {
           taskStore.data.map((task,index) => (
              <Table.Row>
              <Table.Cell collapsing>
                <Checkbox 
                defaultChecked={task.checked}
                toggle
                id={task._id}
                onChange={this.handleChangeCheckbox}
                 />
              </Table.Cell>
              <Table.Cell>{task.content}</Table.Cell>
              <Table.Cell>{task.createdAt}</Table.Cell>
              <Table.Cell>
                  <Button.Group>
                      <Button onClick={this.handleUpdate} id={task._id} content={task.content}>Update</Button>
                      <Button color="red" id={task._id} onClick={this.handleDelete}>Delete</Button>
                  </Button.Group>
              </Table.Cell>
            </Table.Row>
           ))
      }
   
  </Table.Body>

  <Table.Footer fullWidth>
    <Table.Row>
      <Table.HeaderCell />
      <Table.HeaderCell colSpan='4'>

        <Button
          floated='right'
          primary
          size='small'
          onClick={this.upload}
        >{`Sync (${taskStore.countUnuploadeds()})`}
        </Button>
      </Table.HeaderCell>
    </Table.Row>
  </Table.Footer>
</Table>
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

  handleUpdate = (event,{id,content}) => {
    this.setState({
      id:id,
      isEdit : true,
      input_text: content
    })

  }

  addTask = async (event) => {
    event.preventDefault();
    if(this.state.isEdit){
      await taskStore.editItem(this.state.id,{
        content:this.state.input_text,
      })
    }else{
    await taskStore.addItem({
      content: this.state.input_text,
      checked: false
    }, taskStore.data);
  }
    this.setState({ input_text: '' ,isEdit:false,id:''});
  }

  handleDelete = async (event,{id}) => {
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

  handleChangeCheckbox = async (event,{checked,id}) => {
 
    await taskStore.editItem(id,{
      checked : checked
    })

  }

  
}

export default App;
