import { useEffect, useState } from "react";
import c from "clsx";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import {
  CallBell,
  CheckFat,
  MicrophoneStage,
  Monitor,
  X,
} from "@phosphor-icons/react";
import { Button } from "../../ui";
import { useColyseus, ParticipantType } from "../../../context/ColyseusContext";

const mapParticipantTypeToString = (type: ParticipantType) => {
  switch (type) {
    case ParticipantType.Player:
      return "Joueur";
    case ParticipantType.Host:
      return "Présentateur";
    case ParticipantType.Display:
      return "TV";
  }
};

const mapParticipantTypeToIcon = (type: ParticipantType) => {
  switch (type) {
    case ParticipantType.Player:
      return <CallBell size={24} />;
    case ParticipantType.Host:
      return <MicrophoneStage size={24} />;
    case ParticipantType.Display:
      return <Monitor size={24} />;
  }
};

function Waiting() {
  const { room, state } = useColyseus();
  const navigate = useNavigate();
  const [playerType, setPlayerType] = useState<ParticipantType>(
    ParticipantType.Player,
  );

  if (!room || !state) {
    setTimeout(() => {
      navigate("/");
    }, 1000);
    return <div>you're not supposed to be here yet</div>;
  }

  // server-side verifications
  useEffect(() => {
    const serverSideType = state.participants.get(room.sessionId)?.type;
    if (serverSideType && serverSideType !== playerType) {
      setPlayerType(serverSideType);
    }
  }, [state]);

  function toggleReadyState() {
    if (room) {
      room.send("Lobby:ToggleReadyState");
    }
  }

  function handlePlayerTypeChange(newType: ParticipantType) {
    // optimistic UI
    setPlayerType(newType);
    if (room) {
      room.send("Lobby:UpdatePlayerType", newType);
    }
  }

  function handleStartGameClick() {
    if (room) {
      room.send("Lobby:StartGame");
    }
  }

  return (
    <div className="qpuc-gradient flex h-full flex-1 flex-col p-4">
      <div className="flex flex-1 flex-col">
        <div className="flex justify-center">
          <img src="/logo.png" alt="logo" className="h-16" />
        </div>
        <div className="mt-8 flex-1 md:mt-32 md:flex md:justify-around">
          <div className="pl-8 md:mx-auto md:pl-0">
            <h2 className="font-kimberley text-3xl font-black">Participants</h2>
            <ul className="mt-4 space-y-3">
              {Array.from(state.participants.values()).map((participant) => (
                <li
                  key={participant.sessionId}
                  className={c("flex items-center space-x-2", {
                    "-ml-8": participant.type === ParticipantType.Player,
                  })}
                >
                  {participant.type === ParticipantType.Player &&
                    (participant.isReady ? (
                      <CheckFat
                        weight="fill"
                        className="fill-green-400"
                        size={24}
                      />
                    ) : (
                      <X
                        weight="bold"
                        size={24}
                        stroke="currentColor"
                        strokeWidth={24}
                        className="fill-red-400 text-red-400"
                      />
                    ))}
                  <span className="font-kimberley text-xl">
                    {participant.nickname}
                  </span>
                  {mapParticipantTypeToIcon(participant.type)}
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden rounded-2xl md:flex md:w-1/2 md:flex-col md:items-center">
            {playerType === ParticipantType.Display && (
              <>
                <QRCodeSVG
                  value={room.roomId}
                  size={256}
                  className="rounded-xl"
                />
                <span className="mt-4 text-xl leading-8 text-gray-300">
                  Scannez ce QRCode pour rejoindre la partie
                </span>
                <span className="mt-2 text-xl leading-6 text-gray-400">
                  ID de la partie : <pre className="inline">{room.roomId}</pre>
                </span>
              </>
            )}
            {playerType === ParticipantType.Host && (
              <div className="w-64">
                <h2 className="font-kimberley text-3xl font-black">Options</h2>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mb-4 space-y-4">
        <div className="md:flex md:justify-center">
          {playerType === ParticipantType.Host && (
            <Button onClick={handleStartGameClick} className="w-full md:w-64">
              🚀 Lancer la partie
            </Button>
          )}
          {playerType === ParticipantType.Player && (
            <Button onClick={toggleReadyState} className="w-full md:w-64">
              {state.participants.get(room.sessionId)?.isReady
                ? "❌  Pas prêt"
                : "✅  Prêt ?"}
            </Button>
          )}
        </div>

        <div className="hidden md:flex md:justify-center">
          <div className="flex space-x-6 rounded-l-full rounded-r-full bg-gray-800 px-8 py-3 ring-2 ring-gray-600">
            {Object.values(ParticipantType)
              .filter((v) => !isNaN(Number(v)))
              .map((type) => (
                <div key={type}>
                  <input
                    type="radio"
                    className="cursor-pointer disabled:cursor-not-allowed"
                    id={type.toString()}
                    name={mapParticipantTypeToString(type as ParticipantType)}
                    value={type}
                    onChange={() =>
                      handlePlayerTypeChange(type as ParticipantType)
                    }
                    checked={playerType === type}
                    disabled={
                      type === ParticipantType.Host &&
                      Array.from(state.participants.values()).some(
                        (v) => v.type === ParticipantType.Host,
                      )
                    }
                  />
                  <label
                    htmlFor={type.toString()}
                    className="cursor-pointer pl-1"
                  >
                    {mapParticipantTypeToString(type as ParticipantType)}
                  </label>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Waiting;
