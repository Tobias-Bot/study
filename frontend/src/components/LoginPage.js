import React from "react";
import axios from "axios";
import { BrowserRouter, withRouter } from "react-router-dom";
import { navigate } from "hookrouter";

import "../App.css";
import "../styles/login.css";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.getLoginForm = this.getLoginForm.bind(this);
    this.getRegForm = this.getRegForm.bind(this);

    this.isAuth = this.isAuth.bind(this);
  }

  componentDidMount() {
    this.isAuth();
  }

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
            localStorage.setItem("userPassword", e.target.value);
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

  isAuth() {
    let token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://172.20.96.1:8000/api/v1/auth/users/me", {
          headers: { Authorization: "Token " + token },
        })
        .then((response) => {
          let id = response.data.id;

          localStorage.setItem("userId", id);

          navigate("/main/" + id);
          window.location.reload();
        });
    }
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
