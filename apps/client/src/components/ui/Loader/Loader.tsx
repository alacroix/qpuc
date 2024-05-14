interface Props {
  status?: string;
}

function Loader({ status }: Props) {
  return <div className="font-kimberley text-white">{status}</div>;
}

export default Loader;
