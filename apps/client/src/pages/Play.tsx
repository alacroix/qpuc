import { useNavigate } from "react-router-dom";
import {
  useColyseus,
  GameState,
  ParticipantType,
} from "../context/ColyseusContext";
import { Buzzer, Dashboard, Display, Waiting } from "../components/play";

function Play() {
  const { room, state } = useColyseus();
  const navigate = useNavigate();

  if (!room || !state) {
    setTimeout(() => {
      navigate("/");
    }, 1000);
    return <div>you're not supposed to be here yet</div>;
  }

  // Everything has the same screen in the lobby
  if (state.gameState === GameState.WAITING) {
    return <Waiting />;
  }

  const playerType = state.participants.get(room.sessionId)?.type;

  switch (playerType) {
    case ParticipantType.Player:
      return (
        <Buzzer
          buzzerState={state.participants.get(room.sessionId)!.buzzerState}
        />
      );
    case ParticipantType.Host:
      return <Dashboard gameState={state.gameState} />;
    case ParticipantType.Display:
      return <Display gameState={state.gameState} />;
  }
}

export default Play;
