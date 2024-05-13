import { useEffect, useState } from "react";
import { Loader } from "../components/ui";
import { useNavigate } from "react-router-dom";
import { useColyseus } from "../context/ColyseusContext";

function CreateRoom() {
  const [loadingStatus, setLoadingStatus] = useState("Creating new game...");

  const navigate = useNavigate();

  const { createRoom } = useColyseus();

  useEffect(() => {
    setTimeout(() => {
      createRoom("my_room").then((room) => {
        setLoadingStatus("Joining room...");
        setTimeout(() => {
          navigate(`/room/${room?.id}`);
        }, 1000);
      });
    }, 500);
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Loader status={loadingStatus} />
    </div>
  );
}

export default CreateRoom;
