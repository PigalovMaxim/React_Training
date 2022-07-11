import React, { Component } from "react";
import cn from 'clsx';
import { login, registration } from "../../other/requests";
import s from "./UserForm.module.css";

const INPUTS = {
  logEmail: 'loginEmailValue',
  logPass: 'loginPasswordValue',
  regEmail: 'registerEmailValue',
  regName: 'registerNameValue',
  regPass: 'registerPasswordValue',
  regPassConf: 'registerPasswordConfirmationValue'
}

class UserForm extends Component {
  constructor(props) {
    super(props);
    this.login = props.login;
    this.state = {
      isLoginForm: false,
      classnames: cn(s.message, s.hidden),
      errortext: '',
      loginEmailValue: '',
      loginPasswordValue: '',
      registerEmailValue: '',
      registerNameValue: '',
      registerPasswordValue: '',
      registerPasswordConfirmationValue: '',
    };
    this.history = props.history;

    this.changeFormClickHandler = this.changeFormClickHandler.bind(this);
    this.registrationSubmitHandler = this.registrationSubmitHandler.bind(this);
    this.showMessageBox = this.showMessageBox.bind(this);
  }
  onChangeinputData(event, changeElement) {
    const newValue = event.target.value;
    switch(changeElement) {
      case INPUTS.logEmail: {
        this.setState({ loginEmailValue: newValue });
        break;
      }
      case INPUTS.logPass: {
        this.setState({ loginPasswordValue: newValue });
        break;
      }
      case INPUTS.regEmail: {
        this.setState({ registerEmailValue: newValue });
        break;
      }
      case INPUTS.regName: {
        this.setState({ registerNameValue: newValue });
        break;
      }
      case INPUTS.regPass: {
        this.setState({ registerPasswordValue: newValue });
        break;
      }
      default: {
        this.setState({ registerPasswordConfirmationValue: newValue });
        break;
      }
    }
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
            <input onChange={e => this.onChangeinputData(e, INPUTS.logEmail)} placeholder="Email" />
            <input onChange={e => this.onChangeinputData(e, INPUTS.logPass)} placeholder="Password" />
            <button>Авторизоваться</button>
          </form>
        ) : (
          <form onSubmit={(e) => this.registrationSubmitHandler(e)}>
            <label className={s.title}>Регистрация</label>
            <input onChange={e => this.onChangeinputData(e, INPUTS.regEmail)} placeholder="Email" />
            <input onChange={e => this.onChangeinputData(e, INPUTS.regName)} placeholder="Name" />
            <input onChange={e => this.onChangeinputData(e, INPUTS.regPass)} placeholder="Password" />
            <input
              onChange={e => this.onChangeinputData(e, INPUTS.regPassConf)}
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
