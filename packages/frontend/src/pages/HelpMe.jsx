import * as React from "react";
import { Menu } from "../components/Menu";

export function HelpMe() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <button className="p-4 bg-blue-500 text-white rounded hover:bg-blue-600">
        Help me
      </button>
      <Menu />
    </div>
  );
}
