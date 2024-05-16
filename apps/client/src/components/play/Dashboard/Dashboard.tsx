import { CheckFat, Timer, X } from "@phosphor-icons/react";
import Markdown from "react-markdown";
import c from "clsx";
import { GameState, useColyseus } from "../../../context/ColyseusContext";
import { Button } from "../../ui";

type Props = {
  gameState: GameState;
};

const mapGameStateToTitle = (gameState: GameState) => {
  switch (gameState) {
    case GameState.NINE_TO_WIN:
      return "9 points gagnants";
  }
};

const question = {
  question:
    "Quel nom désignant familièrement un individu qui se fait remarquer par son extravagance et ses excentricités est tiré de celui d'un empereur romain du Ve siècle ?",
  answer: "olibrius (un)",
  points: 3,
};

function Dashboard({ gameState }: Props) {
  const { state } = useColyseus();

  return (
    <div className="qpuc-gradient flex flex-1 flex-col">
      {/* <div className="mt-8 flex flex-col items-center justify-center">
        <img src="/logo.png" alt="logo" className="h-32" />
        <h1 className="font-kimberley mt-4 text-2xl text-white"></h1>
      </div> */}
      <div className="m-16 flex flex-1 flex-col rounded-md border border-gray-200 bg-gray-200 shadow-2xl">
        <div className="flex flex-1">
          <div className="flex flex-1 flex-col p-4">
            <div className="flex items-center space-x-8">
              <img src="/logo.png" alt="logo" className="h-16 invert" />
              <h1 className="font-kimberley text-2xl text-gray-800">
                {mapGameStateToTitle(gameState)}
              </h1>
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="mt-24 flex items-baseline justify-between px-16">
                <h2 className="font-kimberley text-3xl font-black text-gray-900">
                  Question
                </h2>
                <span className="font-kimberley text-2xl text-gray-700">
                  {question.points} pt{question.points > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center px-16">
                <div className="text-center text-xl text-gray-900">
                  <Markdown>{question.question}</Markdown>
                </div>
                <div className="font-kimberley mt-16 text-center text-2xl font-black text-orange-400">
                  <Markdown>{question.answer}</Markdown>
                </div>
              </div>
              <div className="flex h-24 space-x-8 text-center">
                <Button block className="flex items-center justify-center">
                  <Timer size={48} weight="fill" className="fill-gray-100" />
                </Button>
                <Button
                  block
                  variant="danger"
                  className="flex items-center justify-center"
                >
                  <X
                    weight="bold"
                    size={48}
                    stroke="currentColor"
                    strokeWidth={24}
                    className="fill-gray-100 text-gray-100"
                  />
                </Button>
                <Button
                  block
                  variant="success"
                  className="flex items-center justify-center"
                >
                  <CheckFat weight="fill" className="fill-gray-100" size={48} />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex w-1/3 flex-col items-center justify-center px-16">
            <h2 className="font-kimberley w-full pl-4 text-3xl font-black text-gray-800">
              Participants
            </h2>
            <ul className="mt-4 w-full space-y-4">
              {Array.from(state!.participants.values()).map((participant) => (
                <li
                  key={participant.sessionId}
                  className={c(
                    "flex items-center justify-between rounded px-4 py-2",
                    {
                      "bg-amber-500 text-gray-100": false,
                      "text-gray-800": true,
                    },
                  )}
                >
                  <span className="font-kimberley text-2xl">
                    {participant.nickname}
                  </span>
                  <span className="font-kimberley text-3xl font-black">2</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
