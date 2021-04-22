import React, { useState, useMemo } from 'react'
import {IconContext} from "react-icons"
import {FaEdit,FaTrashAlt} from "react-icons/fa";
import '../Table.css';
const useSortableData = (items, config = null, groupBy) => {

  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  //code logic for sorting data
  const requestSort = (key) => {
    let direction = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};


const TaskTable = (props) => {
  const { items, requestSort } = useSortableData(props.taskList || {}, props.groupBy);
  return (
    <table id="table">
      <thead>
        <tr>
        {/* <th></th> */}
        <th onClick={() => requestSort('priority')}>Summary</th>
        <th onClick={() => requestSort('priority')}>Priority</th>
        <th onClick={() => requestSort('createdOn')}>Created On</th>
        <th onClick={() => requestSort('dueDate')}>Due Date</th>
        <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {(items && !items.length) ? <tr><td colSpan="6"><br/><br/><h5> There are no any tasks...</h5> </td></tr> :         
        items.map((task, index) => (
          (task && typeof task === "string")
          ? 
          <tr key={index}><td colSpan="6">{task && task.toUpperCase()}</td></tr> 
          :
          <tr key={index} className={task.taskStatus}>
            <td>{task.summary}</td>
            <td>{task.priority}</td>
            <td>{task.createdOn}</td>
            <td>{task.dueDate}</td>
            <td>
               <span title="Edit task" onClick={() => props.action('edit', task._id)}><IconContext.Provider value={{ style: {fontSize: '30px', color: "rgb(0, 123, 255)"}}}><FaEdit/></IconContext.Provider> &nbsp; </span>
              {task && task.taskStatus === "open" ? <button type="button" title="Done task" class="btn btn-success btn-xs" onClick={() => props.action('done', task._id)} >Done</button> : 
              <button type="button" title="Re-open task" class="btn btn-primary btn-xs" onClick={() => props.action('re-open', task._id)} >Re-open</button>} &nbsp;&nbsp;
              <span title="Delete task"onClick={() => props.action('delete', task._id)}> <IconContext.Provider value={{ style: {fontSize: '30px', color: "rgb(223, 45, 7)"}}}><FaTrashAlt/></IconContext.Provider> &nbsp; </span>

            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default function TaskList(props) {
  return (
    <div className="TaskList">
      <TaskTable taskList={props.taskList} groupBy={props.groupBy} action={props.action} checked={props.checked} handleCheck={props.handleCheck} />
    </div>
  );
}
