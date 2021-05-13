import React from "react";
import axios from "axios";
import { BrowserRouter, NavLink, Route, withRouter } from "react-router-dom";

import Main from "./Main.js";

import "../App.css";
import "../styles/login.css";

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

    this.getLoginForm = this.getLoginForm.bind(this);
    this.getRegForm = this.getRegForm.bind(this);
  }

  componentDidMount() {}

  /* form render funcs */

  getLoginForm() {
    let response = {};

    response.form = (
      <div>
        <div className="inputTitle">Логин</div>
        <input
          className="inputForm"
          type="text"
          placeholder="введите логин"
          onChange={(e) => {
            localStorage.setItem("userLogin", e.target.value);
          }}
        />
        <br />
        <br />
        <div className="inputTitle">Пароль</div>
        <input
          className="inputForm"
          type="password"
          placeholder="введите пароль"
          onChange={(e) => {
            localStorage.setItem("userPassword", e.target.value);
          }}
        />
      </div>
    );

    response.title = "Авторизация";

    this.props.getForm(response);
  }

  getRegForm() {
    let response = {};

    response.form = (
      <div>
        <div className="inputTitle">Логин</div>
        <input
          className="inputForm"
          type="text"
          placeholder="придумайте имя пользователя"
          onChange={(e) => {
            localStorage.setItem("userLogin", e.target.value);
          }}
        />
        <br />
        <br />
        <div className="inputTitle">Пароль</div>
        <input
          className="inputForm"
          type="password"
          placeholder="придумайте пароль"
          onChange={(e) => {
            localStorage.setItem("userLogin", e.target.value);
          }}
        />
        <br />
        <br />
        <input
          className="inputForm"
          type="password"
          placeholder="подтверждение пароля"
        />
      </div>
    );

    response.title = "Регистрация";

    this.props.getForm(response);
  }

  render() {
    return (
      <BrowserRouter>
        <div
          className="authBtn"
          style={{ marginTop: "45vh" }}
          data-bs-toggle="modal"
          data-bs-target="#LoginModal"
          onClick={this.getLoginForm}
        >
          войти
        </div>
        <div
          className="authBtn"
          data-bs-toggle="modal"
          data-bs-target="#LoginModal"
          onClick={this.getRegForm}
        >
          регистрация
        </div>
      </BrowserRouter>
    );
  }
}

export default LoginPage;
