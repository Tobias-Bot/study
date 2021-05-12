import React from "react";
// import axios from 'axios';
import { BrowserRouter, NavLink, Route, withRouter } from "react-router-dom";

//import Main from "./components/Main.js";
import LoginPage from "./components/LoginPage.js";

import "./App.css";

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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  getUserInfo() {
    // axios
    //   .get("http://127.0.0.1:8000/api/v1/home/profile/", {
    //     headers: { Authorization: "Token " + token },
    //   })
    //   .then((response) => {
    //   });
  }

  render() {
    // let index = 118;

    return (
      <BrowserRouter>
        <div className="wrapper">
          <Route path="/">
            <LoginPage />
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
