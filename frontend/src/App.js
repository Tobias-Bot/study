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
    this.state = {
      form: "",
    };

    this.getForm = this.getForm.bind(this);
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

  getForm(form) {
    this.setState({ form });
  }

  render() {
    // let index = 118;
    let form = this.state.form.form;
    let formTitle = this.state.form.title;

    return (
      <BrowserRouter>
        <div
          className="modal fade"
          id="LoginModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  {formTitle}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">{form}</div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary">
                  ok
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="wrapper">
          <Route path="/">
            <LoginPage getForm={this.getForm} />
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
