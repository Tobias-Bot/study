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
    };

    this.getApps = this.getApps.bind(this);
    this.showAnimation = this.showAnimation.bind(this);
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

  render() {
    let show = this.state.show;

    let apps = this.getApps();

    return (
      <div>
        <div className="wrapper">
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <div className="infoTitle">приложения</div>
            <br />
            {apps}
          </div>

          <div className="chat"></div>
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
