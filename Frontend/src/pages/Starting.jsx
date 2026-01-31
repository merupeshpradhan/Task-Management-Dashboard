import React from "react";
import { Link } from "react-router-dom";

function starting() {
  return (
    <div className="h-[99.9vh] w-full bg-[#24242477]">
      <div className="h-full flex justify-center items-center flex-col gap-3 text-md font-semibold tracking-wider">
        <Link
          className="bg-blue-600 px-20 py-2 text-white rounded-lg"
          to={"signin"}
        >
          SignIn
        </Link>
        <Link
          className="bg-white px-20 py-2 text-black rounded-lg"
          to={"signup"}
        >
          SignUp
        </Link>
      </div>
    </div>
  );
}

export default starting;
