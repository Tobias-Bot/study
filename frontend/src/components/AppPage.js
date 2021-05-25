import React from "react";
// import axios from "axios";
// import { BrowserRouter, NavLink, Route, withRouter } from "react-router-dom";

import "../App.css";
import "../styles/app.css";

class AppPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    let appUrl = localStorage.getItem("recentUsedApp");

    return (
      <div>
        <iframe name="appFrame" src={appUrl}></iframe>
      </div>
    );
  }
}

export default AppPage;
