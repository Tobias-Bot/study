import React from "react";
import { BrowserRouter, NavLink, Route } from "react-router-dom";

import Main from "./components/Main.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.domain = "192.168.1.57:8000";

    this.mes = "Hello world!";
    this.dialogs = [];
    this.status = "disconnected";
    this.chatSocket = "";

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    this.connect();
  }

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

  render() {
    let index = 118;

    return (
      <BrowserRouter>
        <div>
          <button type="button" onClick={this.sendMessage}>тык</button>
          <Route path={`/main/:${index}`}>
            <Main />
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
