import { useEffect, useState } from "react";
import { Loader } from "../components/ui";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useColyseus } from "../context/ColyseusContext";

function JoinRoom() {
  const [loadingStatus, _] = useState("Joining room...");

  const navigate = useNavigate();
  const { roomId } = useParams();
  const [params, __] = useSearchParams();

  const { joinRoom } = useColyseus();

  useEffect(() => {
    if (roomId) {
      joinRoom(roomId, {
        nickname: params.get("nickname") || "Anonymous",
      }).then((room) => {
        setTimeout(() => {
          navigate(`/room/${room?.id}`, { replace: true });
        }, 1000);
      });
    }
  }, []);

  return (
    <div className="qpuc-gradient flex flex-1 flex-col items-center justify-center">
      <Loader status={loadingStatus} />
    </div>
  );
}

export default JoinRoom;
