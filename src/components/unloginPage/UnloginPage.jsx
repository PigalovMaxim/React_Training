import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import s from './UnloginPage.module.css';

class UnloginPage extends Component {
  constructor() {
    super();

  }
  render() {
    return (
      <div className={s.wrapper}>
        <label className={s.text}>Вы не авторизованы</label>
        <Link to="/Form">Перейти в форму регистрации/авторизации</Link>
      </div>
    );
  }
}

export default UnloginPage;
