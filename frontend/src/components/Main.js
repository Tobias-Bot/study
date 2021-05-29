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
import "../styles/rooms.css";

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
      },
    };

    this.uploadedFile = "";

    this.msgInputRef = React.createRef();
    this.fileInputRef = React.createRef();
    this.imgRef = React.createRef();
    this.titleInputRef = React.createRef();
    this.bioInputRef = React.createRef();
    this.colorInputRef = React.createRef();

    this.domain = "192.168.1.57:8000";

    this.status = "disconnected";
    this.chatSocket = "";

    this.getApps = this.getApps.bind(this);
    this.showAnimation = this.showAnimation.bind(this);
    this.saveMsgText = this.saveMsgText.bind(this);
    this.getDialogs = this.getDialogs.bind(this);
    this.getSettings = this.getSettings.bind(this);
    this.userLogout = this.userLogout.bind(this);
    this.saveRoomSettings = this.saveRoomSettings.bind(this);
    this.getRooms = this.getRooms.bind(this);

    this.getImagePreview = this.getImagePreview.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    let t = localStorage.getItem("chatTheme");
    let userId = localStorage.getItem("userId");
    let token = localStorage.getItem("token");

    if (t) this.setState({ theme: t });

    axios
      .get(`http://${this.domain}/api/v1/server/room_detail/${userId}/`, {
        headers: { Authorization: "Token " + token },
      })
      .then((response) => {
        let room = response.data[0];

        this.setState({ room });

        localStorage.setItem("currRoomTitle", room.title);
        localStorage.setItem("currRoomId", room.user);
      });

    this.connect();
  }

  showAnimation() {
    let show = this.state.show;
    this.setState({ show: !show });
  }

  /* render funcs */

  getApps() {
    let id = localStorage.getItem("currRoomId");

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
    let userId = localStorage.getItem("currRoomId");
    let currUser = localStorage.getItem("userId");
    let token = localStorage.getItem("token");

    let admin = !(currUser === userId);

    axios
      .get(`http://${this.domain}/api/v1/server/room_detail/${userId}/`, {
        headers: { Authorization: "Token " + token },
      })
      .then((response) => {
        let room = response.data[0];

        this.setState({ room });

        this.titleInputRef.current.value = room.title;
        this.bioInputRef.current.value = room.bio;
        this.imgRef.current.src = room.avatar;
        this.colorInputRef.current.value = room.color;
      });

    let form = (
      <div>
        <div className="settingTitle">Комната</div>
        <div style={{ width: "100%" }}>
          <input
            className="inputForm"
            ref={this.titleInputRef}
            type="text"
            placeholder="Название"
            readOnly={admin}
          />
          <img
            className="roomCoverPreview"
            ref={this.imgRef}
            src=""
            alt="Обложка комнаты"
          />
          <button
            className="btn btnFile"
            onClick={() => {
              this.fileInputRef.current.click();
            }}
            hidden={admin}
          >
            <i className="fas fa-camera"></i> загрузить обложку
          </button>
          <input
            className="inputForm"
            ref={this.colorInputRef}
            type="color"
            hidden={admin}
          />
          <input
            type="file"
            accept="image/jpeg, image/gif, image/png"
            ref={this.fileInputRef}
            hidden={true}
            onChange={this.handleFileUpload}
          />
          <textarea
            className="inputForm"
            rows="5"
            ref={this.bioInputRef}
            placeholder="Описание"
            readOnly={admin}
          ></textarea>
        </div>
        <div style={{ width: "100%", textAlign: "center" }} hidden={admin}>
          <button className="btnSave" onClick={this.saveRoomSettings}>
            сохранить
          </button>
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
        <br />
      </div>
    );

    this.props.setSettingsForm(form);
  }

  getRooms() {
    let userId = localStorage.getItem("userId");
    let username = localStorage.getItem("userLogin");
    let token = localStorage.getItem("token");

    axios
      .get(`http://${this.domain}/api/v1/server/room_list/`, {
        headers: { Authorization: "Token " + token },
      })
      .then((response) => {
        let rooms = response.data;

        let form = rooms.map((room) => {
          return (
            <div
              key={room.user}
              className="roomView"
              style={{ backgroundColor: room.color }}
            >
              <div
                className="btnEnterRoom"
                style={{ backgroundColor: room.color }}
                onClick={() => {
                  localStorage.setItem("currRoomId", room.user);
                  localStorage.setItem("currRoomTitle", room.title);
                  navigate("/main/" + room.user);
                  window.location.reload();
                }}
              >
                войти
              </div>
              <img
                className="roomCover"
                src={room.avatar}
                alt="Обложка комнаты"
              />
              <div className="roomText">
                <div className="roomTitle">{room.title}</div>
                <div className="roomBio">{room.bio}</div>
              </div>
            </div>
          );
        });

        this.props.setRoomsForm(form);
      });
  }

  /* image upload funcs */

  getImagePreview(file) {
    if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
      let reader = new FileReader();

      reader.addEventListener("load", () => {
        let url = reader.result;
        let room = this.state.room;

        room.avatar = url;

        this.setState({ room });
        this.imgRef.current.src = url;
      });

      reader.readAsDataURL(file);
    }
  }

  handleFileUpload() {
    this.uploadedFile = this.fileInputRef.current.files[0];

    this.getImagePreview(this.uploadedFile);
  }

  /* websocket funcs */

  connect() {
    let id = localStorage.getItem("currRoomId");

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

  saveRoomSettings() {
    let token = localStorage.getItem("token");
    let id = localStorage.getItem("userId");

    let data = {
      title: this.titleInputRef.current.value,
      bio: this.bioInputRef.current.value,
      color: this.colorInputRef.current.value,
      avatar: this.uploadedFile,
      user: id,
    };

    let formData = new FormData();
    formData.append("title", data.title);
    formData.append("bio", data.bio);
    formData.append("avatar", data.avatar);
    formData.append("color", data.color);
    formData.append("user", data.user);

    axios
      .put(`http://${this.domain}/api/v1/server/room_update/${id}/`, formData, {
        headers: {
          Authorization: "Token " + token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
      });
  }

  render() {
    let show = this.state.show;
    let roomTitle = localStorage.getItem("currRoomTitle");
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
                <i className="fas fa-user"></i>{" "}
                {roomTitle ? roomTitle.substring(0, 30) : ""}
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
              onClick={this.getRooms}
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
