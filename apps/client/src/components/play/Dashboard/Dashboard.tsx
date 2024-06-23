import { CheckFat, Timer, X } from "@phosphor-icons/react";
import Markdown from "react-markdown";
import c from "clsx";
import useSound from "use-sound";
import {
  GameState,
  ParticipantType,
  useColyseus,
} from "../../../context/ColyseusContext";
import { Button } from "../../ui";
import { BuzzerState } from "../Buzzer/Buzzer";

type Props = {
  gameState: GameState;
};

const mapGameStateToTitle = (gameState: GameState) => {
  switch (gameState) {
    case GameState.NINE_TO_WIN:
      return "9 points gagnants";
  }
};

function Dashboard({ gameState }: Props) {
  const { room, state } = useColyseus();

  const hasActiveParticipant = !!state?.activeParticipant?.sessionId;

  const [playTimeElapsed] = useSound("/sfx/time_out.mp3");

  const handleTimeElapsed = () => {
    room?.send("NineToWin:HostInput", "TimeElapsed");
    playTimeElapsed();
  };

  const handleWrongAnswer = () => {
    room?.send("NineToWin:HostInput", "WrongAnswer");
  };

  const handleValidAnswer = () => {
    room?.send("NineToWin:HostInput", "ValidAnswer");
  };

  return (
    <div className="qpuc-gradient flex flex-1 flex-col">
      <div className="m-16 flex flex-1 flex-col rounded-md border border-gray-200 bg-gray-200 p-4 shadow-2xl">
        <div className="flex items-center space-x-8">
          <img src="/logo.png" alt="logo" className="h-16 invert" />
          <h1 className="font-kimberley text-2xl text-gray-800">
            {mapGameStateToTitle(gameState)}
          </h1>
        </div>
        <div className="mt-24 flex flex-1">
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col">
              <div className="flex items-baseline justify-between px-16">
                <h2 className="font-kimberley text-3xl font-black text-gray-900">
                  Question
                </h2>
                <span className="font-kimberley text-2xl text-gray-700">
                  {state?.question.points} pt
                  {state!.question.points > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center px-16">
                <div className="text-center text-xl text-gray-900">
                  <Markdown>{state?.question.question}</Markdown>
                </div>
                <div className="font-kimberley mt-16 text-center text-2xl font-black text-orange-400">
                  <Markdown>{state?.question.answer}</Markdown>
                </div>
              </div>
              <div className="flex h-24 space-x-8 text-center">
                <Button
                  block
                  className="flex items-center justify-center"
                  onClick={handleTimeElapsed}
                >
                  <Timer size={48} weight="fill" className="fill-gray-100" />
                </Button>
                <Button
                  block
                  disabled={!hasActiveParticipant}
                  variant="danger"
                  className="flex items-center justify-center"
                  onClick={handleWrongAnswer}
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
                  disabled={!hasActiveParticipant}
                  variant="success"
                  className="flex items-center justify-center"
                  onClick={handleValidAnswer}
                >
                  <CheckFat weight="fill" className="fill-gray-100" size={48} />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex w-1/3 flex-col px-16">
            <h2 className="font-kimberley w-full pl-4 text-3xl font-black text-gray-800">
              Participants
            </h2>
            <ul className="mt-4 w-full space-y-4">
              {Array.from(state!.participants.values())
                .filter(({ type }) => type === ParticipantType.Player)
                .map((participant) => (
                  <li
                    key={participant.sessionId}
                    className={c(
                      "flex items-center justify-between rounded px-4 py-2",
                      {
                        "bg-amber-500 text-gray-100":
                          participant.buzzerState === BuzzerState.Active,
                        "bg-green-500 text-gray-100":
                          participant.buzzerState === BuzzerState.Valid,
                        "bg-red-500 text-gray-100":
                          participant.buzzerState === BuzzerState.Wrong,
                        "text-gray-800":
                          participant.buzzerState === BuzzerState.Idle ||
                          participant.buzzerState === BuzzerState.Disabled,
                      },
                    )}
                  >
                    <span className="font-kimberley text-2xl">
                      {participant.nickname}
                    </span>
                    <span className="font-kimberley text-3xl">
                      {participant.points}
                    </span>
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
