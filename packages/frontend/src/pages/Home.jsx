import { useState, useEffect } from "react";
import { useAsyncFn } from "../hooks/useAsyncFn";
import { redirect } from "react-router-dom";

export function Home() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const onUserNameChange = (event) => {
    setUserName(event.target.value);
  };
  const onEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const [loggedIn, submit] = useAsyncFn(
    async (event) => {
      event.preventDefault();
      console.log({ email, userName, url: process.env.REACT_APP_API_URL });
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        headers: {
          "Content-Type": "application/json",
        },

        method: "POST",
        body: JSON.stringify({
          username: userName,
          userEmail: email,
        }),
      });
      console.log(response);
      if (response.status === 200) {
        const userSession = await response.json();
        localStorage.setItem("userSession", JSON.stringify(userSession));
        return { error: false, loggedIn: true };
      }
      console.log("🤖");
      return { error: true, loggedIn: false };
    },
    [userName, email],
    { value: { error: false, loggedIn: false } }
  );

  useEffect(() => {
    if (loggedIn.loading === false && loggedIn.value.loggedIn === true) {
      setTimeout(() => {
        window.location.href = "/help";
      }, 1500);
    }
  }, [loggedIn]);

  console.log(loggedIn);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form className="p-8 bg-white shadow-md rounded-md">
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Ton nom</label>
          <input
            className="w-full p-2 border rounded"
            type="text"
            placeholder="ton nom ?"
            onChange={onUserNameChange}
            value={userName}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Ton mail</label>
          <input
            className="w-full p-2 border rounded"
            type="email"
            placeholder="ton mail ?"
            onChange={onEmailChange}
            value={email}
          />
        </div>
        <button
          className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={submit}
        >
          Submit
        </button>
        <p>
          {loggedIn.value.loggedIn &&
            "Vous êtes connecté-e 🎉 Redirection dans 3, 2, 1... 🚀"}
        </p>
        <p>{loggedIn.value.error && "Utilise un autre nom 😇"}</p>
      </form>
    </div>
  );
}
