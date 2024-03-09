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

  const movePaddle = (e: { clientX: number }) => {
    if (e.clientX >= 100 && e.clientX <= 900) {
      setPaddle({ x: e.clientX - 100 });
    }

    if (!game.active) {
      setBall({ ...ball, x: paddle.x + 90 });
    }
  };

  const reset = () => {
    setGame({ ...game, active: !game.active });
    setBall({ ...ball, x: paddle.x + 90, y: 32 });
  };

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
