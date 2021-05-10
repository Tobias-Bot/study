import React from "react";
import { NavLink } from "react-router-dom";
import Transition from "react-transition-group/Transition";

import apps from "../data/apps";

import "../styles/main.css";
import "../styles/chat.css";

// import background from "../static/MainBackground.jpg";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,

      msgText: "",
    };

    this.domain = "192.168.1.57:8000";

    this.mes = "Hello world!";
    this.dialogs = [];
    this.status = "disconnected";
    this.chatSocket = "";

    this.getApps = this.getApps.bind(this);
    this.showAnimation = this.showAnimation.bind(this);

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

  getApps() {
    let response = apps.map((app, i) => {
      return (
        <Transition key={i} in={this.state.show} timeout={100 + i * 150}>
          {(state) => {
            return (
              <div
                className={"btnInfo-" + state}
                style={{ backgroundColor: app.color }}
                data-toggle="modal"
                data-target="#postModal"
                onClick={() =>
                  this.setModalForm(this.getTopicForm(app.form, app.title), {
                    color: app.color,
                  })
                }
              >
                <i className={app.icon}></i> {app.title}
              </div>
            );
          }}
        </Transition>
      );
    });

    return response;
  }

  /* websocket funcs */

  connect() {
    this.chatSocket = new WebSocket("ws://" + this.domain + "/ws/chat/111/");

    this.chatSocket.onopen = () => {
      this.status = "connected";

      this.chatSocket.onmessage = ({ data }) => {
        this.dialogs.push(JSON.parse(data));
      };
    };
  }

  disconnect() {
    this.chatSocket.close();
    this.status = "disconnected";
    this.dialogs.splice(0, this.dialogs.length);
  }

  sendMessage() {
    let message = this.mes;
    let username = "Oleg";

    this.chatSocket.send(
      JSON.stringify({
        message,
        username,
      })
    );

    this.mes = "";
  }

  /* msg send funcs */

  saveMsgText(e) {
    this.setState({ msgText: e.target.value });
  }

  render() {
    let show = this.state.show;

    let apps = this.getApps();

    return (
      <div>
        <div className="wrapper">
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <br />
            <div className="infoTitle">приложения</div>
            <br />
            {apps}
          </div>

          {!show ? (
            <div className="header">
              <span className="chatInfo">
                <i className="fas fa-users"></i> 8
              </span>
            </div>
          ) : (
            ""
          )}

          <div className="chat"></div>

          <div className="msgInputBar">
            <div className="row">
              <div className="col-10">
                <textarea
                  className="msgInput"
                  rows="2"
                  placeholder="Введите сообщение.."
                  onChange={this.saveMsgText}
                ></textarea>
              </div>
              <div className="col">
                <div className="msgSendBtn">
                  <i className="fas fa-paper-plane"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="footer">
            <div
              className="btnFooterMain"
              data-toggle="collapse"
              data-target="#navbarNavDropdown"
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
      </div>
    );
  }
}

export default Main;
