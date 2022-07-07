import React, {Component} from 'react';
import s from './Game.module.css';

class Game extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={s.wrapper}>
        <button className={s.logout}>Выйти из аккаунта</button>
      </div>
    );
  }
}

export default Game;
