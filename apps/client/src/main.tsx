import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Lobby from "./pages/Lobby.tsx";
import { ColyseusProvider } from "./context/ColyseusContext.tsx";
import CreateRoom from "./pages/CreateRoom.tsx";
import Play from "./pages/Play.tsx";
import JoinRoom from "./pages/JoinRoom.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Lobby />,
  },
  {
    path: "/room/create",
    element: <CreateRoom />,
  },
  {
    path: "/join/:roomId",
    element: <JoinRoom />,
  },
  {
    path: "/room/:roomId",
    element: <Play />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <ColyseusProvider>
    <RouterProvider router={router} />
  </ColyseusProvider>,
  // </React.StrictMode>,
);
