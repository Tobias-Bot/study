import React from "react";
// import { NavLink } from "react-router-dom";
import Transition from "react-transition-group/Transition";

import apps from "../data/apps";

import "../styles/main.css";
import "../styles/chat.css";
import { NavLink } from "react-router-dom";

// import background from "../static/MainBackground.jpg";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,

      msgText: "",
      dialogs: [],
    };

    this.msgInputRef = React.createRef();

    this.domain = "192.168.1.57:8000";

    this.status = "disconnected";
    this.chatSocket = "";

    this.getApps = this.getApps.bind(this);
    this.showAnimation = this.showAnimation.bind(this);
    this.saveMsgText = this.saveMsgText.bind(this);
    this.getDialogs = this.getDialogs.bind(this);

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
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

  /* msg send funcs */

  saveMsgText(e) {
    this.setState({ msgText: e.target.value });
  }

  render() {
    let show = this.state.show;
    let username = localStorage.getItem("userLogin");

    let apps = this.getApps();
    let dialogs = this.getDialogs();

    return (
      <div>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <br />
          <div className="infoTitle">приложения</div>
          <br />
          {apps}
        </div>

        {!show ? (
          <div className="header">
            <span className="chatInfo">
              <i className="fas fa-user"></i> {username}
            </span>
            <span className="chatInfo">
              <i className="fas fa-users"></i> 8
            </span>
          </div>
        ) : (
          ""
        )}

        <div className="chat">{dialogs}</div>

        <div className="msgInputBar">
          <div className="row">
            <div className="col-10">
              <textarea
                className="msgInput"
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

        <div className="footer">
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
        </div>
      </div>
    );
  }
}

export default Main;
