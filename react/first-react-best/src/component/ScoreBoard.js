import React from "react";

const ScoreBoard = (props) => {
  return (
    <div className="score-component">
      <div className="player-name">{props.player.name}</div>
      <div className={`score-board ${props.result === "Win" ? "Win" : ""}`}>
        <div className="score">{props.score}</div>
      </div>
    </div>
  );
};

export default ScoreBoard;
