import React from "react";
// import axios from "axios";
// import { BrowserRouter, NavLink, Route, withRouter } from "react-router-dom";

import "../App.css";
import "../styles/app.css";

class AppPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.sendId = this.sendId.bind(this);
  }

  componentDidMount() {}

  sendId() {
    let id = localStorage.getItem("currRoomId");

    let myIframe = document.getElementById("appFrame");

    myIframe.contentWindow.postMessage(id, "*");
  }

  render() {
    let appUrl = localStorage.getItem("recentUsedApp");

    return (
      <div>
        <iframe
          id="appFrame"
          title="appFrame"
          src={appUrl}
          onLoad={this.sendId}
        ></iframe>
      </div>
    );
  }
}

export default AppPage;
