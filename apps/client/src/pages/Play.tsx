import { useNavigate } from "react-router-dom";
import {
  useColyseus,
  GameState,
  ParticipantType,
} from "../context/ColyseusContext";
import { Waiting } from "../components/play";

function Play() {
  const { room, state } = useColyseus();
  const navigate = useNavigate();

  if (!room || !state) {
    setTimeout(() => {
      navigate("/");
    }, 1000);
    return <div>you're not supposed to be here yet</div>;
  }

  if (state.gameState === GameState.WAITING) {
    return <Waiting />;
  }

  const playerType = state.participants.get(room.sessionId)?.type;

  if (playerType === ParticipantType.Player) {
    return <div>buzzer</div>;
  }

  switch (state.gameState) {
    case GameState.NINE_TO_WIN:
      return <div>nine to win</div>;
  }
}

export default Play;
