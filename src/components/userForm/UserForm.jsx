import React, { Component } from "react";
import { login, registration } from "../../other/requests";
import s from "./UserForm.module.css";

class UserForm extends Component {
  constructor(props) {
    super(props);
    this.login = props.login;
    this.state = {
      isLoginForm: false,
    };
    this.loginEmail = React.createRef();
    this.loginPassword = React.createRef();
    this.registerEmail = React.createRef();
    this.registerName = React.createRef();
    this.registerPassword = React.createRef();
    this.registerPasswordConfirmation = React.createRef();
    this.changeFormClickHandler = this.changeFormClickHandler.bind(this);
  }
  async loginSubmitHandler(e) {
    e.preventDefault();
    const result = await login(this.loginEmail.current.value,
      this.loginPassword.current.value);
    if(!result.status) return;
    this.login(result.data.access_token);
    localStorage.setItem('isUserLogin', true);
    localStorage.setItem('access_token', result.data.access_token);
    window.location.assign('http://localhost:3000/Game');
  }
  async registrationSubmitHandler(e) {
    e.preventDefault();
    const a = await registration(
      this.registerEmail.current.value,
      this.registerName.current.value,
      this.registerPassword.current.value,
      this.registerPasswordConfirmation.current.value
    );
    console.log(a);
  }
  changeFormClickHandler() {
    this.setState((prevState) => ({ isLoginForm: !prevState.isLoginForm }));
  }
  render() {
    return (
      <div className={s.wrapper}>
        <button
          className={s.changeForm}
          onClick={() => this.changeFormClickHandler()}
        >
          Сменить форму
        </button>
        {this.state.isLoginForm ? (
          <form onSubmit={(e) => this.loginSubmitHandler(e)}>
            <label className={s.title}>Авторизация</label>
            <input ref={this.loginEmail} placeholder="Email" />
            <input ref={this.loginPassword} placeholder="Password" />
            <button>Авторизоваться</button>
          </form>
        ) : (
          <form onSubmit={(e) => this.registrationSubmitHandler(e)}>
            <label className={s.title}>Регистрация</label>
            <input ref={this.registerEmail} placeholder="Email" />
            <input ref={this.registerName} placeholder="Name" />
            <input ref={this.registerPassword} placeholder="Password" />
            <input
              ref={this.registerPasswordConfirmation}
              placeholder="Confirm Password"
            />
            <button>Зарегистрироваться</button>
          </form>
        )}
      </div>
    );
  }
}

export default UserForm;
