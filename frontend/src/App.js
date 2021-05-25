import React from "react";
import axios from "axios";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { navigate } from "hookrouter";

import Main from "./components/Main.js";
import LoginPage from "./components/LoginPage.js";
import AppPage from "./components/AppPage.js";

import "./App.css";

// const routes = {
//   "/": () => <LoginPage getForm={App.getForm} />,
//   "/main/:id": ({ id }) => <Main id={id} />,
// };

// const GetRoutes = () => {
//   const routeResult = useRoutes(routes);

//   return routeResult;
// };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: "",

      settingForm: "",
    };

    this.getForm = this.getForm.bind(this);
    this.getSettings = this.getSettings.bind(this);

    this.userLogin = this.userLogin.bind(this);
    this.userReg = this.userReg.bind(this);
  }

  componentDidMount() {}

  getForm(form) {
    this.setState({ form });
  }

  getSettings(settingForm) {
    this.setState({ settingForm });
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

        if (token) {
          axios
            .get("http://192.168.1.57:8000/api/v1/auth/users/me", {
              headers: { Authorization: "Token " + token },
            })
            .then((response) => {
              let id = response.data.id;

              localStorage.setItem("userId", id);

              navigate("/main/" + id);
              window.location.reload();
            });

          localStorage.setItem("token", token);
        }
      });
  }

  userReg() {
    let username = localStorage.getItem("userLogin");
    let password = localStorage.getItem("userPassword");

    axios
      .post("http://192.168.1.57:8000/api/v1/auth/users/", {
        username,
        password,
      })
      .then((response) => {
        this.userLogin();
      });
  }

  render() {
    let form = this.state.form.form;
    let formTitle = this.state.form.title;

    let settingForm = this.state.settingForm;

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
                  data-bs-dismiss="modal"
                >
                  войти
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="RoomsModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Комнаты
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">...</div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="SettingsModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Настройки
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">{settingForm}</div>
            </div>
          </div>
        </div>

        <div className="wrapper">
          <Switch>
            <Route exact path="/">
              <LoginPage getForm={this.getForm} />
            </Route>
            <Route path="/main/:id">
              <Main setSettingsForm={this.getSettings} />
            </Route>
            <Route path="/app/:id">
              <AppPage />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
