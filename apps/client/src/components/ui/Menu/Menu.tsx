import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QrCode } from "@phosphor-icons/react";
import { useColyseus } from "../../../context/ColyseusContext";
import Button from "../Button";
import Loader from "../Loader";
import Input from "../Input";

function Menu() {
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const { connectClient } = useColyseus();
  const [error, setError] = useState();
  const navigate = useNavigate();

  const handleJoinClick = () => {
    const roomId = prompt("Saisir l'ID de la partie");
    if (roomId) {
      navigate(`/join/${roomId}`);
    }
  };

  const handleNicknameChange = (e: FormEvent<HTMLInputElement>) => {
    setNickname(e.currentTarget.value);
  };

  useEffect(() => {
    fetch(
      `${import.meta.env.PROD ? "https" : "http"}://${import.meta.env.QPUC_SERVER_URL}/status`,
    )
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
    return (
      <div className="text-center text-white">
        <Loader status="Connexion au serveur..." />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col p-6 text-center text-white md:p-10">
      <div className="mx-auto h-24 md:h-32">
        <img src="/logo.png" alt="logo" className="h-full" />
      </div>

      <div className="mt-12 md:mb-32 md:mt-24">
        <div className="text-left">
          <Input
            label="Votre pseudo :"
            placeholder="Samuel"
            value={nickname}
            onChange={handleNicknameChange}
          />
        </div>
        <div className="mt-8 flex flex-col space-y-4">
          <div>
            <Link to={"/room/create"}>
              <Button className="w-full" disabled={!nickname}>
                Créer une partie
              </Button>
            </Link>
          </div>
          <div className="flex w-full">
            <Button
              className="flex-1"
              onClick={handleJoinClick}
              disabled={!nickname}
            >
              Rejoindre une partie
            </Button>
            <Button className="ml-4" disabled={!nickname}>
              <QrCode size={24} weight="bold" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
