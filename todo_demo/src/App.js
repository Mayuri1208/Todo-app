import React, { Component } from 'react';
import './App.css';
import { Task } from './Components'
import {Collapse,Navbar,NavbarText} from 'reactstrap';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    return (

      <div className="App">
      <>
       <Navbar color="light" dark expand="md">
          <Collapse navbar>
          <NavbarText style={{fontSize: '24px', color: 'black'}}>&nbsp;&nbsp;&nbsp;To Do Application</NavbarText>
          </Collapse>
       </Navbar>
      </>
        <div className="row">
          <div className="column1">
          </div>
          <div className="column2">
            <Task/>
          </div>
          <div className="column3">
          </div>
        </div>
      </div>
    );
  }
}

export default App;