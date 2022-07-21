import Link from "next/link";
import React from "react";

interface Props {}

function Header(props: Props) {
  const {} = props;

  return (
    <header className="p-5 max-w-7xl mx-auto">
      <div className="flex items-center space-x-5 w-full">
        <div className="">
          <Link href="/">
            <img
              className="w-44 object-contain cursor-pointer"
              src="https://links.papareact.com/yvf"
            />
          </Link>
        </div>

        <div className="flex space-x-3 items-center">
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className="text-white bg-green-600 px-3 py-1 rounded-full">
            Follow
          </h3>
        </div>

        <div className="flex space-x-3 text-green-600 ml-auto high-specificity items-center">
          <h3>Sign In</h3>
          <h3 className="border-green-600 border rounded-full px-2 py-1">
            Get Started
          </h3>
        </div>
      </div>
    </header>
  );
}

export default Header;
