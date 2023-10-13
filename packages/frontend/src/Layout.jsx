import { EmojiRain } from "./pages/EmojiRain";

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <EmojiRain />
      {children}
    </div>
  );
};
