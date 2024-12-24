import React from "react";
import { useSelector } from "react-redux";

const Error = () => {
  const error = useSelector((state) => state.items);

  return <div>Error: {error}</div>;
};

export default Error;
