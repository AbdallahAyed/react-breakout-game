import { useState } from "react";

type GameProps = {
  level: number;
  lives: number;
  score: number;
  speed: number;
  active: boolean;
  gameOver: boolean;
};

function App() {
  const [game, setGame] = useState<GameProps>({
    level: 1,
    lives: 3,
    score: 0,
    speed: 20,
    active: false,
    gameOver: false,
  });

  const [ball, setBall] = useState({
    x: 490,
    y: 32,
    width: 20,
    height: 20,
  });

  const [paddle, setPaddle] = useState({
    x: 400,
  });

  return (
    <>
      <div className="game-board">
        <div>
          <div className="lives"></div>
          <div className="">level</div>
          <div className="">score</div>
        </div>
        <div className="bricks"></div>
        <div className="paddle"></div>
      </div>
    </>
  );
}

export default App;
