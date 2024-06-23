import { useEffect, useState } from "react";
import { Loader } from "../components/ui";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useColyseus } from "../context/ColyseusContext";

function CreateRoom() {
  const [loadingStatus, setLoadingStatus] = useState(
    "Création d'une nouvelle partie...",
  );

  const navigate = useNavigate();
  const [params, _] = useSearchParams();

  const { createRoom } = useColyseus();

  useEffect(() => {
    setTimeout(() => {
      createRoom("my_room", {
        nickname: params.get("nickname") || "Anonymous",
      }).then((room) => {
        setLoadingStatus("Connexion à la partie...");
        setTimeout(() => {
          navigate(`/room/${room?.id}`, { replace: true });
        }, 1000);
      });
    }, 500);
  }, []);

  return (
    <div className="qpuc-gradient flex flex-1 flex-col items-center justify-center">
      <Loader status={loadingStatus} />
    </div>
  );
}

export default CreateRoom;
