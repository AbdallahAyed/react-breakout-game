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

type BallProps = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type BricksProps = {
  x: number;
  y: number;
  height: number;
  width: number;
  destroyed: boolean;
}[];

function App() {
  const [game, setGame] = useState<GameProps>({
    level: 1,
    lives: 3,
    score: 0,
    speed: 20,
    active: false,
    gameOver: false,
  });

  const [ball, setBall] = useState<BallProps>({
    x: 490,
    y: 32,
    width: 20,
    height: 20,
  });

  const [paddle, setPaddle] = useState({
    x: 400,
  });

  const [bricks, setBricks] = useState<BricksProps>();

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

  const flashBricks = () => {
    let all = document.getElementsByClassName(
      "brick"
    ) as HTMLCollectionOf<HTMLElement>;
    for (let index = 0; index < bricks!.length; index++) {
      const el = bricks![index];
      if (!el.destroyed) {
        let times = 0;
        all[index].style.backgroundColor = "tomato";
        let interval = setInterval(() => {
          if (times % 2 === 0) {
            all[index].style.backgroundColor = "rgb(60, 238, 43)";
          } else {
            all[index].style.backgroundColor = "tomato";
          }
          ++times;
          if (times === 5) {
            clearInterval(interval);
          }
        }, 100);
      }
    }
  };

  const gameOver = (
    bX: number,
    bY: number,
    pX: number,
    interval: number | undefined
  ) => {
    if (bY < -20 && (bX < pX || bX > pX + 200)) {
      if (game.lives > 0) {
        setGame({ ...game, lives: game.lives - 1 });
        clearInterval(interval);
        setTimeout(() => {
          flashBricks();
          reset();
        }, 0);
      } else {
        clearInterval(interval);
        setGame({ ...game, gameOver: true });
      }
    }
  };

  let nextLevel = () => {
    let all = document.getElementsByClassName(
      "brick"
    ) as HTMLCollectionOf<HTMLElement>;
    setTimeout(() => {
      let updatedBricksArray = [];
      for (let index = 0; index < all.length; index++) {
        const el = all[index];
        el.style.backgroundColor = "rgb(60, 238, 43)";
        updatedBricksArray.push({
          x: el.offsetLeft,
          y: 580 - el.offsetTop,
          height: el.clientHeight,
          width: el.clientWidth,
          destroyed: false,
        });
      }
      setBricks(updatedBricksArray);
    }, 0);
  };

  const initGame = () => {
    setGame({ ...game, active: !game.active });

    if (game.active) {
      let up = 8;
      let right = 1;

      const init = setInterval(() => {
        let leftBricks = 0;
        bricks?.forEach((el, index) => {
          if (isCollide(ball, el) && !el.destroyed) {
            const all = document.getElementsByClassName(
              "brick"
            ) as HTMLCollectionOf<HTMLElement>;
            all[index].style.backgroundColor = "transparent";
            el.destroyed = true;
            setGame({ ...game, score: game.score + 1 });
            up = -up;
          }

          if (!el.destroyed) {
            leftBricks++;
          }

          if (leftBricks === 0 && index + 1 === bricks.length) {
            setGame({ ...game, level: game.level + 1 });
            if (game.speed) {
              setGame({ ...game, speed: game.speed - 1 });
            }
            setTimeout(() => {
              clearInterval(init);
              reset();
              nextLevel();
            }, 0);
          }

          // bounce against the ceilings and floor
          if (ball.y > 530 || ball.y < -50) {
            up = -up;
          }

          // bounce against paddle
          if (
            ball.y < 30 &&
            ball.x + 20 > paddle.x &&
            ball.x < paddle.x + 200
          ) {
            let res = bounceAngle(
              paddle.x,
              paddle.x + 200,
              ball.x + 10 - paddle.x
            );
            if (res === 1) {
              up = -up;
              right = right / Math.abs(right);
            } else {
              up = -up;
              right = 1 * res;
            }
          }

          // bounce against side walls
          if (ball.x > 980 || ball.x < 0) {
            right = -right;
          }

          setBall({ ...ball, y: ball.y + up, x: ball.x + right });

          gameOver(ball.x, ball.y, paddle.x, init);
        }, game.speed);
      });
    }
  };

  return (
    <>
      <div
        className="game-board"
        onMouseMove={(e) => movePaddle(e)}
        onClick={() => initGame()}
      >
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
        <div
          className="ball"
          style={{ left: `${ball.x}px`, bottom: `${ball.y}px` }}
        ></div>
        <div className="paddle" style={{ left: `${paddle.x}px` }}></div>
      </div>
    </>
  );
}

export default App;
