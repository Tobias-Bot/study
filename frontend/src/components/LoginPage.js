import React from "react";
import axios from 'axios';
import { BrowserRouter, NavLink, Route, withRouter } from "react-router-dom";

import Main from "./components/Main.js";

import "./App.css";
import "..styles/login.css";

const Button = withRouter(({ history }) => (
  <button
    type="button"
    onClick={() => {
      history.push("/new-location");
    }}
  >
    Click Me!
  </button>
));

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {

    return (
      <BrowserRouter>
        <div>Hi login
        </div>
      </BrowserRouter>
    );
  }
}

export default LoginPage;
