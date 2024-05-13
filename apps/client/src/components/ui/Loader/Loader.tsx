interface Props {
  status?: string;
}

function Loader({ status }: Props) {
  return <div>{status}</div>;
}

export default Loader;
