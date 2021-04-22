import React, { Component } from 'react';

export default class SearchData extends Component {
  constructor () {
    super();
    this.state = {
    }
    this.handleSearch = this.handleSearch.bind(this)
  }

  handleSearch(event) {
    var text= event.target.value
    if(text)
    {
      var searchpara=document.getElementsByClassName("row").innerHTML;
      var pattern=new RegExp("("+text+")", "gi");
      var new_text=searchpara && searchpara.replace(pattern, "<span class='highlight'>"+text+"</span>");
      document.getElementsByClassName("row").innerHTML=new_text;
    }
  }

  render () {
    let { searchValue } = this.state
    return (
      <div className="container">
        <div className="header">
          <div className="search">Search : <input type="text" id="search" ref={(input) => { this.searchInput = input; }} onChange={this.handleSearch} value={searchValue || ""} /></div>
        </div>
      </div>
    );
  }

} 