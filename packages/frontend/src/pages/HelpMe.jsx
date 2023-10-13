import { Menu } from "../components/Menu";
import { QuestionForm } from "../components/QuestionForm";
import { useState } from "react";

export function HelpMe() {
  const [iNeedHelp, setINeedHelp] = useState(false);
  const onClick = () => {
    setINeedHelp(true);
  };
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      {!iNeedHelp && (
        <button
          className="p-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={onClick}
        >
          Help me 🙀🙀🙀🙀
        </button>
      )}

      {iNeedHelp && <QuestionForm />}
      <Menu />
    </div>
  );
}
