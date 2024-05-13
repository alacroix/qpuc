import { Menu, Version } from "../components/ui";

function Lobby() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col justify-center md:mx-auto md:max-w-96">
        <Menu />
      </div>
      <div className="flex h-12 items-center justify-center">
        <Version />
      </div>
    </div>
  );
}

export default Lobby;
