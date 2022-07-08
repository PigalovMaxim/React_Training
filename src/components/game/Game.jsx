import React, { Component } from "react";
import cn from "clsx";
import { startGame, answerQuestion } from "../../other/requests";
import s from "./Game.module.css";

const PAGES = {
  start: "START",
  play: "PLAY",
  result: "RESULT",
};

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currPage: PAGES.start,
      question: "",
      questions: [],
      options: "",
      points: "",
      time: 0,
      difficult: 1,
      classnames: cn(s.message, s.hidden),
      errortext: "",
    };
    this.canAnswer = true;
    this.intervals = [];
    this.startGameClickHandler = this.startGameClickHandler.bind(this);
    this.answerClickHandler = this.answerClickHandler.bind(this);
    this.setTimer = this.setTimer.bind(this);
    this.goBack = this.goBack.bind(this);
    this.difficultSelect = React.createRef();
  }
  async startGameClickHandler() {
    const difficult = this.difficultSelect.current.value;
    const result = await startGame(difficult, this.props.token);
    if (result.status) {
      const { question, options, points, time } = result.data;
      this.setState({
        currPage: PAGES.play,
        question,
        options,
        points,
        time,
        difficult,
      });
      this.setTimer();
    }
  }
  async answerClickHandler(answer) {
    if (!this.canAnswer) return;
    this.canAnswer = false;
    const questionNums = this.state.question
      .replace(/[^0-9, ]/g, "")
      .replaceAll("  ", " ")
      .split(" ");
    if (
      parseInt(answer) !==
      parseInt(questionNums[0]) * parseInt(questionNums[1])
    )
      this.showMessageBox(
        `Правильный ответ - ${
          parseInt(questionNums[0]) * parseInt(questionNums[1])
        }`
      );
    const result = await answerQuestion(
      answer,
      this.state.difficult,
      this.props.token
    );

    if (result.status && !result.questions) {
      const { question, options, points, time } = result.data;
      this.setState({ currPage: PAGES.play, question, options, points, time });
    }
    if (result.status && result.data.questions) {
      const { questions, points } = result.data;
      this.setState({ currPage: PAGES.result, questions, points });
    }
    if (result.status) {
      this.canAnswer = true;
      this.setTimer();
    }
  }
  setTimer() {
    this.intervals.forEach((value) => clearInterval(value));
    const interval = setInterval(() => {
      this.setState((prevState) => ({ time: prevState.time - 1 }));
      if (this.state.time === 1) {
        clearInterval(interval);
        this.setState({ currInterval: null });
      }
    }, 1000);
    this.intervals.push(interval);
  }
  goBack() {
    this.setState({ currPage: PAGES.start });
  }
  showMessageBox(text) {
    this.setState({ classnames: s.message, errortext: text });
    setTimeout(() => {
      this.setState({ classnames: cn(s.message, s.opacity0) });
    }, 2000);
    setTimeout(() => {
      this.setState({ classnames: cn(s.message, s.hidden) });
    }, 2500);
  }
  render() {
    return (
      <div className={s.wrapper}>
        {this.state.currPage === PAGES.start ? (
          <div className={s.verticalBox}>
            <select className={s.select} ref={this.difficultSelect}>
              <option disabled>Выберите сложность</option>
              <option value="1">Легко/Easy</option>
              <option value="2">Сложно/Hard</option>
            </select>
            <button
              onClick={() => this.startGameClickHandler()}
              className={s.startGame}
            >
              Start
            </button>
          </div>
        ) : this.state.currPage === PAGES.play ? (
          <div className={s.verticalBox}>
            <label className={s.title}>Score: {this.state.points}</label>
            <label className={s.title}>Timer: {this.state.time}</label>
            <label className={s.title}>{this.state.question} = ?</label>
            <div className={s.row}>
              {this.state.options.map((option, i) => (
                <div
                  key={i}
                  onClick={() => this.answerClickHandler(option)}
                  className={s.option}
                >
                  {option}
                </div>
              ))}
            </div>
            <button className={s.mt20px} onClick={() => this.goBack()}>
              GO BACK
            </button>
          </div>
        ) : (
          <div className={s.verticalBox}>
            <label className={s.title}>Score: {this.state.points}</label>
            <label className={s.title}>END GAME</label>
            <div className={s.answerTable}>
              <div className={s.rowAnswer}>
                <label className={s.rowText}>Question</label>
                <label className={s.rowText}>Answer</label>
                <label className={s.rowText}>Correct</label>
              </div>
              {this.state.questions.map((question) => (
                <div className={s.rowAnswer}>
                  <label className={s.rowText}>{question.question}</label>
                  <label className={s.rowText}>{question.answer}</label>
                  <label className={s.rowText}>{question.current_answer}</label>
                </div>
              ))}
            </div>
            <button className={s.mt20px} onClick={() => this.goBack()}>
              GO BACK
            </button>
          </div>
        )}
        <button onClick={() => this.props.logout()} className={s.logout}>
          Выйти из аккаунта
        </button>
        <div className={this.state.classnames}>{this.state.errortext}</div>
      </div>
    );
  }
}

export default Game;
