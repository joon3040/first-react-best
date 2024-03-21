import { useState } from "react";
import "./App.css";
import Box from "./component/Box";
import Button from "./component/Button";
import ScoreBoard from "./component/ScoreBoard";

const choice = {
  rock: {
    name: "Rock",
    img: "./image/rock.png",
  },
  scissor: {
    name: "Scissor",
    img: "./image/scissor.png",
  },
  paper: {
    name: "Paper",
    img: "./image/paper.png",
  },
};

const player = {
  user: {
    name: "User",
    img: "./image/user.png",
  },
  computer: {
    name: "Computer",
    img: "./image/robot.png",
  },
};

const gameList = ["Rock Scissor Paper", "Quickness Test"];
let pointGap = 20;
let interval = 1500;
let goalLevel = 5;
let intervalId;
let isFirst = true;
let isEmpty = false;
function App() {
  const [userSelect, setUserSelect] = useState(null);
  const [computerSelect, setComputerSelect] = useState(null);
  const [userResult, setUserResult] = useState("");
  const [computerResult, setComputerResult] = useState("");
  const [currentGameIdx, setCurrentGameIdx] = useState(0);
  const [currentGameName, setCurrentGameName] = useState("Rock Scissor Paper");
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [isLastGame, setIsLastGame] = useState(false);
  const [isFirstGame, setIsFirstGame] = useState(true);
  const [isStart, setIsStart] = useState(false);
  const [point, setPoint] = useState(0);
  const [level, setLevel] = useState(1);
  const [btnDisable, setBtnDisable] = useState(false);
  //const [isEmpty, setIsEmpty] = useState(true);
  // 1. 유저가 start 버튼을 누른다.
  // 2. 컴퓨터의 가위바위보가 랜덤으로 interval 만큼의 시간을 주기로 나온다.
  //    2-1.유저가 이겼을 경우 point를 pointGap만큼 증가시킨다.
  //    2-2.지거나 비기거나 내지 못했을 경우 point를 pointGap만큼 감소 시킨다.
  //        2-2-1. point가 100이 되었을 경우 levelUp함수를 실행시킨다.
  //            2-2-1-1. level이 goalLevel 이 되었을 경우 게임을 종료한다.
  //            2-2-1-2. point를 0으로 초기화 시키고, interval이 감소하며 level이 1 증가한다.
  //        2-2-2. point가 음수가 되었을 경우 "Game over"를 출력하고 게임을 종료하며 점수를 표시한다.

  // 문제 2. 컴퓨터가 동일한 걸 냈을 때 새로 낸건지 이전 게 그대로 있는건지 분간이 안됨
  // 해결책 1. interval에 비례하여 투명도 100 -> 0 까지 transition 해주기
  //      문제 1. 자바스크립트에서 css로 interval 변수를 전달할 방법이 없으므로
  //              html 태그에 직접 스타일을 줘야함.
  const games = {
    "Rock Scissor Paper": {
      name: "Rock Scissor Paper",
      isCurrent: true,
      func: function (userChoice) {
        setUserSelect(choice[userChoice]);
        let computerChoice = randomChoice();
        setComputerSelect(choice[computerChoice]);
        let user = judgement(choice[userChoice], choice[computerChoice]);
        let computer = user === "Tie" ? "Tie" : user === "Win" ? "Lose" : "Win";
        setUserResult(user);
        setComputerResult(computer);
        increaseScore(user, computer);
      },
    },
    "Quickness Test": {
      name: "Quickness Test",
      isCurrent: false,
      func: function (userChoice) {
        setUserSelect(choice[userChoice]);
        let user = judgement(choice[userChoice], computerSelect);
        let computer = user === "Tie" ? "Tie" : user === "Win" ? "Lose" : "Win";
        setUserResult(user);
        setComputerResult(computer);
        adjustPoint(user);
        setBtnDisable(true);
        isEmpty = false;
        isFirst = false;
      },
    },
  };

  const start = (currentGame) => {
    setIsStart(true);
    if (currentGame === "Quickness Test") {
      setBtnDisable(true);
      intervalId = setInterval(intervalSelect, interval);
    }
  };
  let play = (userChoice) => {
    games[currentGameName].func(userChoice);
  };
  const randomChoice = () => {
    let itemArray = Object.keys(choice);
    let randomItem = Math.floor(Math.random() * itemArray.length);
    return itemArray[randomItem];
  };
  //prettier-ignore
  const judgement = (user, computer) => {
    if (user.name === computer.name) return "Tie";
    else if (user.name === "Scissor") return computer.name === "Paper" ? "Win" : "Lose";
    else if (user.name === "Rock") return computer.name === "Scissor" ? "Win" : "Lose";
    else if (user.name === "Paper") return computer.name === "Rock" ? "Win" : "Lose";
  };
  const increaseScore = (user, computer) => {
    setUserScore(user === "Win" ? userScore + 1 : userScore);
    setComputerScore(computer === "Win" ? computerScore + 1 : computerScore);
  };
  const intervalSelect = () => {
    // 버튼 활성화
    setBtnDisable(false);
    // 검정 테두리로 초기화
    setUserResult("Tie");
    setComputerResult("Tie");
    // 비워주기
    setUserSelect("");
    let computerChoice = randomChoice();
    setComputerSelect(choice[computerChoice]);
    if (isEmpty && !isFirst) {
      setUserResult("Lose");
      setComputerResult("Win");
      adjustPoint("Lose");
    }
    // 다음 번에 내지 않을 경우 isEmpty는 true가 됨
    isEmpty = !isEmpty;
  };
  const levelUp = () => {
    interval /= 2;
    if (level + 1 === goalLevel) {
      clearInterval(intervalId);
    } else {
      setPoint(0);
      setLevel(level + 1);
    }
  };
  const adjustPoint = (user) => {
    console.log(point);
    if (user === "Win") {
      setPoint(point + pointGap);
      if (point + pointGap >= 100) levelUp();
    } else if (user === "Lose") {
      setPoint(point - pointGap);
      console.log(point - pointGap);
      if (point - pointGap < 0) {
        clearInterval(intervalId);
      }
    }
  };
  const clickNextGame = () => {
    if (currentGameIdx < gameList.length - 1) {
      let curGame = games[gameList[currentGameIdx]];
      let nextGame = games[gameList[currentGameIdx + 1]];
      curGame.isCurrent = false;
      nextGame.isCurrent = true;
      setCurrentGameName(nextGame.name);
      setCurrentGameIdx(currentGameIdx + 1);
      if (currentGameIdx === gameList.length - 2) {
        setIsLastGame(true);
        setIsFirstGame(false);
      } else setIsFirstGame(false);
    }
  };
  const clickPreGame = () => {
    if (currentGameIdx > 0) {
      let curGame = games[gameList[currentGameIdx]];
      let preGame = games[gameList[currentGameIdx - 1]];
      curGame.isCurrent = false;
      preGame.isCurrent = true;
      setCurrentGameName(preGame.name);
      setCurrentGameIdx(currentGameIdx - 1);
      if (currentGameIdx === 1) {
        setIsFirstGame(true);
        setIsLastGame(false);
      } else setIsLastGame(false);
    }
  };
  return (
    <div>
      {/* 점수판 */}
      <div
        className={`score-container ${
          currentGameName === "Rock Scissor Paper" ? "" : "display-none"
        }`}
      >
        <ScoreBoard
          score={userScore}
          player={player.user}
          result={userResult}
        />
        <ScoreBoard
          score={computerScore}
          player={player.computer}
          result={computerResult}
        />
      </div>
      <div className="game-container">
        <div className={`game-header ${isStart && "display-none"}`}>
          <button
            onClick={() => clickPreGame()}
            className={`arrow-button ${isFirstGame && "disabled"}`}
          >
            <img src="./image/left_arrow.png" className="pre-button"></img>
          </button>
          <div className={`game-name`}>{currentGameName}</div>
          <button
            onClick={() => clickNextGame()}
            className={`arrow-button ${isLastGame && "disabled"}`}
          >
            <img src="./image/right_arrow.png" className="next-button"></img>
          </button>
        </div>
        {/* <div className={`${isStart || "display-none"}`}>
          <ScoreBoard score={level} player={player.user} result={userResult} />
        </div> */}
        <div className="main">
          <Box player={player.user} item={userSelect} result={userResult} />
          <img className="versus" src="./image/versus.png"></img>
          <Box
            player={player.computer}
            item={computerSelect}
            result={computerResult}
          />
        </div>
        <div
          className={`point-box ${
            currentGameName === "Quickness Test" || "display-none"
          }`}
        >
          <progress max={100} value={point}></progress>
        </div>

        <div className={`button-container`}>
          {/* 시작 버튼 */}
          <button
            className={`start-button ${isStart && "display-none"}`}
            onClick={() => start(currentGameName)}
          >
            <div className="start-button-content">
              <div className="start-button-text">START</div>
            </div>
          </button>
          <button
            onClick={() => play("scissor")}
            className={`${isStart || "display-none"} ${
              btnDisable ? "btn-disabled" : ""
            }`}
            disabled={btnDisable}
          >
            <Button item={choice.scissor} />
          </button>
          <button
            onClick={() => play("rock")}
            className={`${isStart || "display-none"} ${
              btnDisable ? "btn-disabled" : ""
            }`}
            disabled={btnDisable}
          >
            <Button item={choice.rock} />
          </button>
          <button
            onClick={() => play("paper")}
            className={`${isStart || "display-none"} ${
              btnDisable ? "btn-disabled" : ""
            }`}
            disabled={btnDisable}
          >
            <Button item={choice.paper} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
