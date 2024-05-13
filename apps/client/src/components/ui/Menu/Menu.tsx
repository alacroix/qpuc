import { useEffect, useState } from "react";
import Button from "../Button";
import { useColyseus } from "../../../context/ColyseusContext";
import { Link, useNavigate } from "react-router-dom";

function Menu() {
  const [loading, setLoading] = useState(true);
  const { connectClient } = useColyseus();
  const [error, setError] = useState();
  const navigate = useNavigate();

  const handleJoinClick = () => {
    const roomId = prompt("Saisir l'ID de la partie");
    if (roomId) {
      navigate(`/join/${roomId}`);
    }
  };

  useEffect(() => {
    fetch(`http://${import.meta.env.QPUC_SERVER_URL}/status`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Server is not reachable");
        }
        connectClient();
        setLoading(false);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="space-y-2 text-center text-white">
        <h4>Impossible de se connecter au serveur</h4>
        <span className="text-sm leading-6 text-gray-400">{error}</span>
      </div>
    );
  }

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="flex w-full flex-col p-6 text-center text-white md:p-10">
      <div className="mx-auto h-32">
        <img src="/logo.png" alt="logo" className="h-full" />
      </div>

      <div className="mb-32 mt-24">
        <div>
          <label>Votre pseudo:</label>
          <input type="text" />
        </div>
        <div className="mt-4 flex flex-col space-y-4">
          <div>
            <Link to={"/room/create"}>
              <Button className="w-full">Créer une partie</Button>
            </Link>
          </div>
          <div className="flex w-full">
            <Button className="flex-1" onClick={handleJoinClick}>
              Rejoindre une partie
            </Button>
            <Button className="ml-4">QRCode</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
