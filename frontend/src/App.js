import React from "react";
import axios from 'axios';
import { BrowserRouter, NavLink, Route } from "react-router-dom";

import Main from "./components/Main.js";

import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  getUserInfo() {
    axios
      .get("http://127.0.0.1:8000/api/v1/home/profile/", {
        headers: { Authorization: "Token " + token },
      })
      .then((response) => {
      });
  }

  render() {
    let index = 118;

    return (
      <BrowserRouter>
        <div>
          <Route path="/">
            <Main />
          </Route>
          <Route path="/other">
            <NavLink to="/main">Go to main</NavLink>
          </Route>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
