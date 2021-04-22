import React, { Component } from 'react';
import { AddTask, TaskList, Modal } from '.';
import {Row,Col,Container} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';   
import {IconContext} from "react-icons";
import {FaPlusCircle} from "react-icons/fa";
import { v4 as uuidv4 } from 'uuid';
import CONFIG from '../Config';
import './Button.css';
import './Modal.css';
import './Table.css';
import './AddForm.css';
import './Tab.css';
import '../App.css';

export default class Task extends Component {

  constructor(props) {
    super(props);
    var today = new Date();
    this.today = today.getFullYear()+ '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' +('0' + today.getDate()).slice(-2) ;
    this.state = {
      summary: null,
      description: null,
      priority: 0,
      dueDate: this.today,
      createdOn: this.today,
      show: false,
      taskStatus: 'open',
      taskList: [],
      checked: new Map(),
      showModal: false,
      searchVal: null,
      page: 'all',
      groupBy: "none",
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addTask = this.addTask.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.tabSelect = this.tabSelect.bind(this);
    this.handleGroupBy = this.handleGroupBy.bind(this);
    this.action = this.action.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.bulkActions = this.bulkActions.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keyup', this.onKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.onKeyUp);
  }

  onKeyUp = (e) => {
    if (e.keyCode === 27) this.setState({ showModal: false })
    if (e && e.ctrlKey && e.shiftKey && e.keyCode === 70) this.searchInput.focus();
  }

  componentDidUpdate(prevProps, prevState) {
    let { searchVal, taskList, groupBy, showModal, } = this.state
    searchVal = searchVal && searchVal.toLowerCase()
    if (!showModal && taskList && taskList.length && searchVal !== prevState.searchVal) {
      this.searchBy()
    }
    if (!showModal && taskList && taskList.length && groupBy !== prevState.groupBy) {
      this.groupBy(this.state.page);
    }
  }

  searchBy() {
    let { taskList, searchVal } = this.state
    taskList.forEach(function (arr) {
      let summary = arr.summary && arr.summary.toLowerCase();
      let description = arr.description && arr.description.toLowerCase();
      if ((summary && summary.includes(searchVal)) || (description && description.includes(searchVal))) {
        arr.show = true;
      } else {
        arr.show = false;
      }
    })
    this.setState({ taskList })
  }

  groupBy(page) {
    let { taskList, groupBy } = this.state
    var groupByList = []
    taskList = this.tabSelect(page, true)
    if (groupBy && groupBy === 'none') {
      this.setState({ page, taskList });
    } else {
      taskList = (taskList || []).reduce(function (r, a) {
        let key = a[groupBy];
        r[key] = r[key] || [];
         r[key].push(a);
        return r;
      }, {})
      Object.keys(taskList).forEach((key) => {
        let match = taskList[key].filter((task) => (task.show && task[groupBy] === key)).length
        if (match) groupByList.push(key)
        taskList[key].forEach((object) => {
          groupByList.push(object)
        });
      });
      this.setState({ page, taskList: groupByList })
    }
  }

  handleChange(event) {
    if (event.target && event.target.id && event.target.value) {
      this.setState({ [event.target.id]: event.target.value });
    }
  }


  handleSubmit() {
    let { summary, description, priority, dueDate, taskList, createdOn, _id, taskStatus } = this.state
    if (_id) {
      var editObject = { _id, summary, description, priority, dueDate, createdOn, show: true, taskStatus }
      let index = taskList.findIndex((task) => task._id === _id)
      taskList[index] = editObject;
      this.setState({ showModal: false, taskList, summary: null, description: null, priority: "None", dueDate: this.today, taskStatus: 'open' })
    } else {
      this.setState({ showModal: false, taskList: [...taskList, { show: true, _id: uuidv4(), summary, description, priority, dueDate, createdOn, taskStatus }], summary: null, description: null, priority: "None", dueDate: this.today, taskStatus: 'open' })
    }
  }

  addTask(type) {
    this.setState({ showModal: true, groupBy: "none", _id: null, summary: null, description: null, priority: "None", dueDate: this.today, taskStatus: 'open' })
  }

//code logic for showing all task,completed task,pending task.

  tabSelect(page, list = false) {
    let { taskList } = this.state;
    switch (page) {
      case "all":
        taskList.forEach(function (arr) {
          if (arr && typeof arr === 'string') return
          arr.show = true;
        });
        break;
      case "completed":
        taskList.forEach(function (arr) {
          if (arr && typeof arr === 'string') return
          if (arr && arr.taskStatus && arr.taskStatus === 're-open') arr.show = true; else arr.show = false;
        });
        break;
      case "pending":
        taskList.forEach(function (arr) {
          if (arr && typeof arr === 'string') return
          if (arr && arr.taskStatus && arr.taskStatus === 'open') arr.show = true; else arr.show = false;
        });
        break;
      default:
    }
    if (list && typeof list === "boolean") {
      taskList = taskList.filter((task) => task && typeof task === "object")
      return taskList;
    } else {
      return this.setState({ taskList, page });
    }
  }

  closeModal(event) {
    if (event.target && event.target.id && event.target.id.includes('cancel')) {
      this.setState({ showModal: false, _id: null, summary: null, description: null, priority: 'None', dueDate: this.today, taskStatus: 'open' })
    } else {
      this.setState({ showModal: false })
    }
  }

  handleSearch(event) {
    if (event.target && event.target.id && event.target.id.includes("search")) {
      this.setState({ searchVal: event.target.value.trim() });
    }
  }

  handleGroupBy(event) {
    this.setState({ groupBy: event.target.value });
  }

  //Code logic for performing edit,delete,re-open actions on tasks.
  action(type, id) {
    let { taskList } = this.state;
    let index = taskList.findIndex((task) => task._id === id)
    let task = {}
    switch (type) {
      case "edit":
        task = taskList[index]
        this.setState({ showModal: true, groupBy: "none", _id: task._id, summary: task.summary, description: task.description, priority: task.priority, dueDate: task.dueDate })
        break;
      case "delete":
        var status = window.confirm("Do you want to delete this task ?");
        if (status) {
          if (index !== -1) taskList.splice(index, 1);
          this.setState({ taskList })
        }
        break;
      case "done":
        task = taskList[index];
        task.taskStatus = 're-open';
        taskList[index] = task;
        this.setState({ taskList })
        break;
      case "re-open":
        task = taskList[index];
        task.taskStatus = 'open';
        taskList[index] = task;
        this.setState({ taskList })
        break;
      default:
    }
  }

  handleCheck(e) {
    const id = e.target.id;
    const isChecked = e.target.checked;
    this.setState(prevState => ({
      checked: prevState.checked.set(id, isChecked)
    }));
  }

  bulkActions(event) {
    let { taskList, checked } = this.state;
    let type = event.target.value
    let allChecked = [...checked].filter(({ 1: v }) => v === true).map(([k]) => k);
    switch (type) {
      case "delete":
        taskList.forEach((arr, index) => {
          if (arr && arr._id) {
            let match = allChecked.indexOf(arr._id);
            match > -1 && taskList.splice(index, 1);
          }
        })
        break;
      case "open":
        taskList.forEach((arr, index) => {
          if (arr && arr._id && arr.taskStatus === "re-open") {
            let match = allChecked.indexOf(arr._id);
            if (match > -1) arr.taskStatus = 'open';
          }
        })
        break;
      case "re-open":
        taskList.forEach((arr, index) => {
          if (arr && arr._id && arr.taskStatus === "open") {
            let match = allChecked.indexOf(arr._id);
            if (match > -1) arr.taskStatus = 're-open';
          }
        })
        break;
      default:
    }
    this.setState({ taskList, checked: new Map() }, this.groupBy('all'))
  }

  render() {
    let { summary, description, priority, dueDate, taskList, showModal, searchVal, page, groupBy, _id, checked } = this.state
    let currentList = taskList.filter((task) => {
      if (task && typeof task === "string") {
        return true
      } else {
        return task.show
      }
    })
    
    return (
      
      <div id='div1'>
        <div className="header">
        <div className="add-btn">
           <IconContext.Provider value={{ style: {fontSize: '40px', color: "blue"}}}><FaPlusCircle onClick={this.addTask}/></IconContext.Provider>
        
        </div>
        <Container>
          <Row style={{paddingTop:'10px'}}>
          <Col sm={6}>
            <div className="search">Search :&nbsp;&nbsp;&nbsp;&nbsp;
            <input type="text" id="search"style={{width:'300px',height:'35px',border:'1px solid grey',
            backgroundColor: '#f5f5f5' }}
           ref={(input) => { this.searchInput = input; }} onChange={this.handleSearch} value={searchVal} /></div>
          </Col>
          <Col sm={5}>
           <div><label>Group By</label> :
              <select id="groupBy" value={groupBy} onChange={this.handleGroupBy}
          style={{width:'200px',
          float:'right',
          border: '1px solid grey',
          borderRadius: '5px',
          backgroundColor: '#f5f5f5' }}>
              {CONFIG.GROUP_BY.map((item) => item.show && <option key={item.key}>{item.value}</option>)}
            </select></div>
          </Col>
          </Row>
        </Container>
      </div>
        <br/>
        <div></div>
        <div class="tab">
          <button className={page && page === "all" ? "tablinks active" : "tablinks"} onClick={this.groupBy.bind(this, 'all')}>All Tasks</button>
          <button className={page && page === "completed" ? "tablinks active" : "tablinks"} onClick={this.groupBy.bind(this, 'completed')}>Completed</button>
          <button className={page && page === "pending" ? "tablinks active" : "tablinks"} onClick={this.groupBy.bind(this, 'pending')}>Pending</button>
        </div>
        
        <TaskList taskList={currentList} groupBy={groupBy} action={this.action} checked={checked} handleCheck={this.handleCheck} />
       
        <Modal showModal={showModal} closeModal={this.closeModal}>
          <AddTask closeModal={this.closeModal} summary={summary} description={description} priority={priority} dueDate={dueDate} handleSubmit={this.handleSubmit} handleChange={this.handleChange} _id={_id} />
        </Modal>       
  </div>)
  }
}