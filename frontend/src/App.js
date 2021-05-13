import React from "react";
import axios from "axios";
import {
  BrowserRouter,
  NavLink,
  Route,
  withRouter,
  useHistory,
} from "react-router-dom";
import { navigate } from 'hookrouter'

//import Main from "./components/Main.js";
import LoginPage from "./components/LoginPage.js";

import "./App.css";

// const GoToRoom = withRouter(({ history }) => (
//   <button
//     type="button"
//     onClick={() => {
//       history.push("/new-location");
//     }}
//   >
//     Click Me!
//   </button>
// ));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: "",
    };

    this.getForm = this.getForm.bind(this);

    this.userLogin = this.userLogin.bind(this);
    this.userReg = this.userReg.bind(this);
    this.isAuth = this.isAuth.bind(this);
  }

  componentDidMount() {
    this.isAuth();
  }

  getForm(form) {
    this.setState({ form });
  }

  /* send login request funcs */

  userLogin() {
    let username = localStorage.getItem("userLogin");
    let password = localStorage.getItem("userPassword");

    axios
      .post("http://192.168.1.57:8000/api/v1/auth_token/token/login", {
        username,
        password,
      })
      .then((response) => {
        let token = response.data.auth_token;

        localStorage.setItem("token", token);
      });
  }

  userReg() {
    // let username = localStorage.getItem("userLogin");
    // let password = localStorage.getItem("userPassword");
    // axios
    //   .post("http://192.168.1.57:8000/api/v1/auth_token/token/login", {
    //     username,
    //     password,
    //   })
    //   .then((response) => {
    //     let token = response.auth_token;
    //     console.log(token);
    //     localStorage.setItem("token", token);
    //   });
  }

  isAuth() {
    let token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://192.168.1.57:8000/api/v1/auth/users/me", {
          headers: { Authorization: "Token " + token },
        })
        .then((response) => {
          let id = response.data.id;

          navigate("/main/" + id);
        });
    }
  }

  render() {
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
                <button
                  type="button"
                  className="mainBtn"
                  onClick={
                    formTitle === "Авторизация" ? this.userLogin : this.userReg
                  }
                >
                  войти
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="wrapper">
          <Route path="/">
            <LoginPage getForm={this.getForm} />
          </Route>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
