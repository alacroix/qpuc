import { version } from "../../../../package.json";

function Version() {
  return (
    <footer className="text-center text-sm leading-6 text-gray-400">
      <span>
        v{version}
        {import.meta.env.NODE_ENV === "development" ? "@dev" : ""}
      </span>
    </footer>
  );
}

export default Version;
