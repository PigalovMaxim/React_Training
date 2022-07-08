import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import UnloginPage from "./components/unloginPage/UnloginPage";
import UserForm from "./components/userForm/UserForm";
import Game from "./components//game/Game";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserLogin: false,
      access_token: null,
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }
  login(access_token) {
    localStorage.setItem("isUserLogin", true);
    localStorage.setItem("access_token", access_token);
    this.setState({ isUserLogin: true, access_token });
  }
  logout() {
    localStorage.removeItem("isUserLogin");
    localStorage.removeItem("access_token");
    this.setState({ isUserLogin: false, access_token: null });
  }
  componentDidMount() {
    if (localStorage.getItem("isUserLogin")) {
      this.setState({
        isUserLogin: localStorage.getItem("isUserLogin"),
        access_token: localStorage.getItem("access_token"),
      });
    }
    if (
      window.location.href === "http://localhost:3000/" &&
      localStorage.getItem("isUserLogin")
    ) {
      window.location.assign("http://localhost:3000/Game");
    }
    if (
      window.location.href === "http://localhost:3000/" &&
      !localStorage.getItem("isUserLogin")
    ) {
      window.location.assign("http://localhost:3000/Unlogin");
    }
  }
  render() {
    return (
      <div className="App">
        <Routes>
          {!this.state.isUserLogin ? (
            <React.Fragment>
              <Route path="/*" element={<UnloginPage />} />
              <Route path="/Form" element={<UserForm login={this.login} />} />
            </React.Fragment>
          ) : (
            <Route
              path="/Game"
              element={
                <Game token={this.state.access_token} logout={this.logout} />
              }
            />
          )}
        </Routes>
      </div>
    );
  }
}

export default App;
