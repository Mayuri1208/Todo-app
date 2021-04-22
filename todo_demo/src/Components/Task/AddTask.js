import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class AddTask extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  //code logic for validation
  validation() {
    let { summary, description } = this.props
    summary = summary && summary.trim();
    description = description && description.trim();
    if (summary && summary.length < 10) return alert("Required minimum 10 Characters");
    if (summary && description.length < 10) return alert("Required minimum 10 Characters...");
    return true
  }

  handleSubmit(prevProps) {
    let isValid = this.validation()
    if (!isValid) return;
    if (this.props && this.props._id) return this.props.handleSubmit();
    if (window.confirm("Are you sure to save  the task ?")) {
      this.props.handleSubmit()
    } else {
      return false;
    }
  }

  render() {
    let { handleChange, summary, description, priority, dueDate, closeModal, _id } = this.props
    return (
      <div className="container">
        <div class="modal-header">
          <div class="modal-title">Add Task</div>
        </div>
        <div className="modal-body">
          <form className="form" action="#" onSubmit={this.handleSubmit}>
            <label className='form-label'>
              <span>Summary</span><input type="text" value={summary} onChange={handleChange} id="summary" required="true" />
            </label>
            <label className="form-label description">
              <span>Description</span><textarea value={description} rows="4" cols="50" id="description" onChange={handleChange} required="true" />
            </label>
            <label className='form-label'>
            <span>Priority </span>
                <select id="priority"  className='priority' value={priority} onChange={handleChange}>
                  <option value="None">None</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </label>
              <label className='form-label'>
                <span>Due Date  </span><input type="date" value={dueDate} onChange={handleChange} id="dueDate" required="true" />
              </label>
            <div className="actions">
              <span> </span><input type="button" id="cancel1" onClick={closeModal} value="Cancel" />
              <span> </span><input type="submit" id="save" value={_id ? "Edit" : "Save"} />
            </div>
          </form>
        </div>
      </div>)
  }
}