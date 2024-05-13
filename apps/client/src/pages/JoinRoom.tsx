import { useEffect, useState } from "react";
import { Loader } from "../components/ui";
import { useNavigate, useParams } from "react-router-dom";
import { useColyseus } from "../context/ColyseusContext";

function JoinRoom() {
  const [loadingStatus, _] = useState("Joining room...");

  const navigate = useNavigate();
  const { roomId } = useParams();

  const { joinRoom } = useColyseus();

  useEffect(() => {
    if (roomId) {
      joinRoom(roomId, {}).then((room) => {
        setTimeout(() => {
          navigate(`/room/${room?.id}`);
        }, 1000);
      });
    }
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Loader status={loadingStatus} />
    </div>
  );
}

export default JoinRoom;
