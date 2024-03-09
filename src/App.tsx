import { useState } from "react";
import { getBricks } from "./utils";

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
    if (e.clientX >= 270 && e.clientX <= 985) {
      setPaddle({ x: e.clientX - 240 });
    }

    if (!game.active) {
      setBall({ ...ball, x: paddle.x + 90 });
    }
  };

  const reset = () => {
    setGame({ ...game, active: !game.active });
    setBall({ ...ball, x: paddle.x + 90, y: 32 });
  };

  const isCollide = (
    a: { y: number; height: number; x: number; width: number },
    b: { y: number; height: number; x: number; width: number }
  ) => {
    return !(
      a.y + a.height < b.y ||
      a.y > b.y + b.height ||
      a.x + a.width < b.x ||
      a.x > b.x + b.width
    );
  };

  const bounceAngle = (a: number, b: number, c: number) => {
    const l = b - a + 1;
    const p = (c * 100) / l;
    return p <= 20 ? -3 : p <= 40 ? -2 : p <= 60 ? 1 : p <= 80 ? 2 : 3;
  };

  return (
    <>
      <div className="game-board" onMouseMove={(e) => movePaddle(e)}>
        <div className="navbar">
          <div className="">level</div>
          <div className="lives"></div>
          <div className="">score</div>
        </div>
        <div className="bricks">
          {getBricks(4, 6).map((row) => (
            <div>
              {row.map(() => (
                <div className="brick"></div>
              ))}
            </div>
          ))}
        </div>
        <div className="paddle" style={{ left: `${paddle.x}px` }}></div>
      </div>
    </>
  );
}

export default App;
