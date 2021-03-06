import React from "react";

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
    let token = localStorage.getItem("token");

    let myIframe = document.getElementById("appFrame");

    myIframe.contentWindow.postMessage({ id, token }, "*");
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
