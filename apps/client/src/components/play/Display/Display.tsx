import { GameState } from "../../../context/ColyseusContext";

type Props = {
  gameState: GameState;
};

const mapGameStateToTitle = (gameState: GameState) => {
  switch (gameState) {
    case GameState.NINE_TO_WIN:
      return "9 points gagnants";
  }
};

function Display({ gameState }: Props) {
  return (
    <div className="qpuc-gradient flex flex-1 flex-col">
      <div className="mt-8 flex flex-col items-center justify-center">
        <img src="/logo.png" alt="logo" className="h-32" />
        <h1 className="font-kimberley mt-4 text-2xl text-white">
          {mapGameStateToTitle(gameState)}
        </h1>
      </div>
      <div className="flex flex-1 items-center justify-around">
        <article className="font-kimberley flex flex-col text-center text-white">
          <span className="text-4xl">Samuel</span>
          <span className="text-9xl font-black">1</span>
        </article>
      </div>
    </div>
  );
}

export default Display;
