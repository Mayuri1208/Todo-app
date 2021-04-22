import React, { Component } from 'react';
import ReactModal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    border                : '1px solid #4CAF50',
    borderRadius          : '10px',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    background            : '#F6F8FA'
  }
};

export default class Modal extends Component {
  constructor () {
    super();
    this.state = {
    }
  }

  render () {
    return (
      <div>
        <ReactModal
           isOpen={this.props.showModal}
           style={customStyles}
           contentLabel="Minimal Modal Example"
        >          
          <div className="modal-close"><button onClick={this.props.closeModal}>X</button></div>
          {this.props.children}
        </ReactModal>
      </div>
    );
  }

} 