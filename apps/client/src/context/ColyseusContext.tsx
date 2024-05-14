import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Client, Room } from "colyseus.js";
import type { MyRoomState } from "../../../server/src/rooms/schema/MyRoomState";

interface IColyseusContext {
  client: Client | null;
  room: Room<MyRoomState> | null;
  state?: MyRoomState | null;
  connectClient: () => void;
  createRoom: (
    roomName: string,
    options?: any,
  ) => Promise<Room<MyRoomState> | undefined>;
  joinRoom: (
    roomName: string,
    options?: any,
  ) => Promise<Room<MyRoomState> | undefined>;
  leaveRoom: () => Promise<void>;
}

const ColyseusContext = createContext<IColyseusContext | null>(null);

export const useColyseus = () =>
  useContext(ColyseusContext) as IColyseusContext;

interface Props {
  children: ReactNode;
}

export const ColyseusProvider = ({ children }: Props) => {
  const [client, setClient] = useState<Client | null>(null);
  const [room, setRoom] = useState<Room<MyRoomState> | null>(null);
  const [state, setState] = useState<MyRoomState | null>(null);

  const updateGameState = useCallback((newState: MyRoomState) => {
    setState(newState);
  }, []);

  useEffect(() => {
    if (room) {
      setState(room.state);

      const onStateChange = (newState: MyRoomState) => {
        updateGameState(newState.clone());
      };

      room.onStateChange(onStateChange);

      return () => {
        room.onStateChange.remove(onStateChange);
      };
    }
  }, [room, updateGameState]);

  const connectClient = () => {
    const colyseusClient = new Client(
      `${import.meta.env.PROD ? "wss" : "ws"}://${import.meta.env.QPUC_SERVER_URL}`,
    );
    setClient(colyseusClient);
  };

  const createRoom = async (roomName: string, options = {}) => {
    if (!client) {
      console.error("Client not connected to server.");
      return;
    }
    try {
      const joinedRoom = await client.create<MyRoomState>(roomName, options);
      setRoom(joinedRoom);
      console.log(`Created and joined room ${joinedRoom.id}`);
      return joinedRoom;
    } catch (error) {
      console.error("Failed to join room:", error);
    }
  };

  const joinRoom = async (roomId: string, options = {}) => {
    if (!client) {
      console.error("Client not connected to server.");
      return;
    }
    try {
      const joinedRoom = await client.joinById<MyRoomState>(roomId, options);
      setRoom(joinedRoom);
      console.log(`Joined room ${joinedRoom.id}`);
      return joinedRoom;
    } catch (error) {
      console.error("Failed to join room:", error);
    }
  };

  // Fonction pour quitter la room
  const leaveRoom = async () => {
    if (room) {
      await room.leave();
      setState(null);
      setRoom(null);
    }
  };

  return (
    <ColyseusContext.Provider
      value={{
        client,
        room,
        state,
        connectClient,
        createRoom,
        joinRoom,
        leaveRoom,
      }}
    >
      {children}
    </ColyseusContext.Provider>
  );
};
