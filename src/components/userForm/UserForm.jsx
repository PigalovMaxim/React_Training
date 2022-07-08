import React, { Component } from "react";
import cn from 'clsx';
import { login, registration } from "../../other/requests";
import s from "./UserForm.module.css";

class UserForm extends Component {
  constructor(props) {
    super(props);
    this.login = props.login;
    this.state = {
      isLoginForm: false,
      classnames: cn(s.message, s.hidden),
      errortext: ''
    };
    this.history = props.history;
    this.loginEmail = React.createRef();
    this.loginPassword = React.createRef();
    this.registerEmail = React.createRef();
    this.registerName = React.createRef();
    this.registerPassword = React.createRef();
    this.registerPasswordConfirmation = React.createRef();
    this.changeFormClickHandler = this.changeFormClickHandler.bind(this);
    this.registrationSubmitHandler = this.registrationSubmitHandler.bind(this);
    this.showMessageBox = this.showMessageBox.bind(this);
  }
  async loginSubmitHandler(e) {
    e.preventDefault();
    const result = await login(this.loginEmail.current.value,
      this.loginPassword.current.value);
    if(result.status_code === 500) this.showMessageBox('Такого пользователя не существует');
    if(result.status_code === 422) {
      const error = this.makeErrorsStr(result.errors);
      this.showMessageBox(error);
   }
    if(!result.status) return;
    this.login(result.data.access_token);
    localStorage.setItem('isUserLogin', true);
    localStorage.setItem('access_token', result.data.access_token);
    this.history.push('/Game');
  }
  async registrationSubmitHandler(e) {
    e.preventDefault();
    const result = await registration(
      this.registerEmail.current.value,
      this.registerName.current.value,
      this.registerPassword.current.value,
      this.registerPasswordConfirmation.current.value
    );
    if(!result) this.showMessageBox('Все поля должны быть заполнены!');
    if(result && result.status) this.setState({isLoginForm: true});
    if(result && !result.status) {
       const error = this.makeErrorsStr(result.errors);
       this.showMessageBox(error);
    }
  }
  changeFormClickHandler() {
    this.setState((prevState) => ({ isLoginForm: !prevState.isLoginForm }));
  }
  makeErrorsStr(obj) {
    const keys = Object.keys(obj);
    let error = '';
    keys.forEach(key => {
      obj[key].forEach(err => {
        error += err;
      });
    });
    return error;
  }
  showMessageBox(text) {
    this.setState({classnames: s.message, errortext: text});
    setTimeout(() => {
        this.setState({classnames: cn(s.message, s.opacity0)});
    }, 2000);
    setTimeout(() => {
        this.setState({classnames: cn(s.message, s.hidden)});
    }, 2500);
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
        <div className={this.state.classnames}>{this.state.errortext}</div>
      </div>
    );
  }
}

export default UserForm;
