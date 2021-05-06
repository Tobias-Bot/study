import React from "react";
import { NavLink } from "react-router-dom";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    console.log(this.props.route);

    return (
      <div>
          <NavLink to="/other">back</NavLink>
      </div>
    );
  }
}

export default Main;
