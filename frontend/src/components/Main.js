import React from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Transition from "react-transition-group/Transition";
import { navigate } from "hookrouter";

import apps from "../data/apps";

import "../styles/main.css";
import "../styles/chat.css";
import "../styles/login.css";
import "../styles/settings.css";

// import background from "../static/MainBackground.jpg";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,

      msgText: "",
      dialogs: [],

      theme: "",

      room: {
        title: "",
        bio: "",
        color: "",
        avatar: "",
      }
    };

    this.msgInputRef = React.createRef();

    this.domain = "192.168.1.57:8000";

    this.status = "disconnected";
    this.chatSocket = "";

    this.getApps = this.getApps.bind(this);
    this.showAnimation = this.showAnimation.bind(this);
    this.saveMsgText = this.saveMsgText.bind(this);
    this.getDialogs = this.getDialogs.bind(this);
    this.getSettings = this.getSettings.bind(this);
    this.userLogout = this.userLogout.bind(this);

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    let t = localStorage.getItem("chatTheme");

    if (t) this.setState({ theme: t });

    this.connect();
  }

  showAnimation() {
    let show = this.state.show;
    this.setState({ show: !show });
  }

  /* render funcs */

  getApps() {
    let id = localStorage.getItem("userId");

    let response = apps.map((app, i) => {
      return (
        <Transition key={i} in={this.state.show} timeout={100 + i * 150}>
          {(state) => {
            return (
              <NavLink to={`/app/${id}`}>
                <div
                  className={"btnInfo-" + state}
                  style={{ backgroundColor: app.color }}
                  onClick={() => {
                    localStorage.setItem("recentUsedApp", app.url);
                  }}
                >
                  <i className={app.icon}></i> {app.title}
                </div>
              </NavLink>
            );
          }}
        </Transition>
      );
    });

    return response;
  }

  getDialogs() {
    let dialogs = this.state.dialogs;
    let myName = localStorage.getItem("userLogin");

    let response = dialogs.map((msg, i) => {
      return (
        <div key={msg.username + i}>
          {myName === msg.username ? (
            <div className={"chatMsg"} style={{ textAlign: "right" }}>
              <div className="chatMsgMe">
                <div className="msgUsername">{msg.username}</div>
                <div className="msgText">{msg.message}</div>
              </div>
            </div>
          ) : (
            <div className={"chatMsg"} style={{ textAlign: "left" }}>
              <div className="chatMsgOther">
                <div className="msgUsername">{msg.username}</div>
                <div className="msgText">{msg.message}</div>
              </div>
            </div>
          )}
        </div>
      );
    });

    return response;
  }

  getSettings() {
    let username = localStorage.getItem("userLogin");

    let form = (
      <div>
        <div className="settingTitle">Комната</div>
        <div style={{ width: "100%" }}>
          <input className="inputForm" type="text" placeholder="Название" />
          <textarea className="inputForm" rows="5" placeholder="Описание"></textarea>
          <input className="inputForm" type="color" />
          <input className="inputForm" type="img" />
        </div>
        <br />
        <div className="settingTitle">Тема</div>
        <div style={{ textAlign: "center" }}>
          <div
            className="themeBlock"
            style={{ backgroundColor: "rgb(16, 16, 27)" }}
            onClick={() => {
              this.setState({ theme: "" });
              localStorage.setItem("chatTheme", "");
            }}
          ></div>
          <div
            className="themeBlock"
            style={{ backgroundColor: "rgba(222, 231, 255)" }}
            onClick={() => {
              this.setState({ theme: "white" });
              localStorage.setItem("chatTheme", "white");
            }}
          ></div>
        </div>
        <br />
        <div className="settingTitle">Пользователь</div>
        <div style={{ width: "100%", textAlign: "center" }}>
          <button
            type="button"
            className="btn btn-outline-danger"
            data-bs-dismiss="modal"
            onClick={this.userLogout}
          >
            Выйти из {username}
          </button>
        </div>
      </div>
    );

    this.props.setSettingsForm(form);
  }

  /* websocket funcs */

  connect() {
    let id = localStorage.getItem("userId");

    this.chatSocket = new WebSocket(`ws://${this.domain}/ws/chat/${id}/`);

    this.chatSocket.onopen = () => {
      this.status = "connected";

      this.chatSocket.onmessage = ({ data }) => {
        let msg = [];
        let dialogs = this.state.dialogs;

        msg.push(JSON.parse(data));
        this.setState({ dialogs: [...dialogs, ...msg] });
      };
    };
  }

  disconnect() {
    this.chatSocket.close();
    this.status = "disconnected";
    this.dialogs.splice(0, this.dialogs.length);
  }

  sendMessage() {
    let message = this.state.msgText;
    let username = localStorage.getItem("userLogin");

    this.chatSocket.send(
      JSON.stringify({
        message,
        username,
      })
    );

    this.setState({ msgText: "" });
    this.msgInputRef.current.value = "";
  }

  userLogout() {
    let token = localStorage.getItem("token");

    axios
      .options("/api/v1/auth_token/token/logout", {
        headers: { Authorization: "Token " + token },
      })
      .then((response) => {
        localStorage.setItem("userLogin", "");
        localStorage.setItem("userPassword", "");
        localStorage.setItem("userId", "");
        localStorage.setItem("token", "");

        navigate("/");
        window.location.reload();
      });
  }

  /* msg send funcs */

  saveMsgText(e) {
    this.setState({ msgText: e.target.value });
  }

  render() {
    let show = this.state.show;
    let username = localStorage.getItem("userLogin");
    let theme = this.state.theme;

    let apps = this.getApps();
    let dialogs = this.getDialogs();

    return (
      <div>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <br />
          <br />
          {apps}
        </div>

        <div
          className="header"
          style={{ backgroundColor: theme ? "white" : "" }}
        >
          {!show ? (
            <div>
              <span className="chatInfo">
                <i className="fas fa-user"></i> {username}
              </span>
              <span className="chatInfo">
                <i className="fas fa-users"></i> 8
              </span>
            </div>
          ) : (
            <div className="infoTitle">приложения</div>
          )}
        </div>

        <div
          className="chat"
          style={{ backgroundColor: theme ? "rgba(222, 231, 255, 0.8)" : "" }}
        >
          {dialogs}
        </div>

        <div
          className="msgInputBar"
          style={{
            backgroundColor: theme ? "white" : "",
          }}
        >
          <div className="row">
            <div className="col-10">
              <textarea
                className="msgInput"
                style={{ color: theme ? "black" : "" }}
                ref={this.msgInputRef}
                rows="2"
                placeholder="Введите сообщение.."
                onChange={this.saveMsgText}
              ></textarea>
            </div>
            <div className="col">
              <div className="msgSendBtn" onClick={this.sendMessage}>
                <i className="fas fa-paper-plane"></i>
              </div>
            </div>
          </div>
        </div>

        <div
          className="footer"
          style={{ backgroundColor: theme ? "white" : "" }}
        >
          {!show ? (
            <div
              className="btnFooter"
              data-bs-toggle="modal"
              data-bs-target="#RoomsModal"
            >
              <i className="fas fa-coffee"></i>
            </div>
          ) : (
            ""
          )}
          <div
            className="btnFooterMain"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            onClick={this.showAnimation}
          >
            {!show ? (
              <i className="fas fa-th-large"></i>
            ) : (
              <i className="fas fa-times" ref={this.closeRef}></i>
            )}
          </div>
          {!show ? (
            <div
              className="btnFooter"
              data-bs-toggle="modal"
              data-bs-target="#SettingsModal"
              onClick={this.getSettings}
            >
              <i className="fas fa-sliders-h"></i>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default Main;
