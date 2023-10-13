import { useState, useEffect } from "react";

export const EmojiRain = () => {
  const [emojis, setEmojis] = useState([]);

  useEffect(() => {
    const generateEmoji = () => ({
      id: Math.random(),
      left: Math.random() * 100,
      animationDuration: 4 + Math.random() * 5, // shorter duration, smooth flow
      fontSize: 20 + Math.random() * 30,
    });

    const generateEmojis = () => {
      const newEmoji = generateEmoji();
      setEmojis((prevEmojis) => [...prevEmojis, newEmoji]);
    };

    // Clean up emojis that are out of view
    const cleanUpEmojis = () => {
      setEmojis((prevEmojis) =>
        prevEmojis.filter(
          (emoji) =>
            document.getElementById(emoji.id)?.getBoundingClientRect().top <
            window.innerHeight
        )
      );
    };

    const emojiInterval = setInterval(generateEmojis, 1000); // Generate new emoji every 0.5 second
    const cleanUpInterval = setInterval(cleanUpEmojis, 4000); // Clean up emojis every 2 seconds

    return () => {
      clearInterval(emojiInterval); // Cleanup interval on component unmount
      clearInterval(cleanUpInterval); // Clean up emojis interval on component unmount
    };
  }, []);

  return (
    <>
      {emojis.map(({ id, left, animationDuration, fontSize }) => (
        <span
          key={id}
          id={id}
          className="absolute animate-spin"
          style={{
            left: `${left}vw`,
            top: "-10vh",
            fontSize: `${fontSize}px`,
            animationDuration: `${animationDuration}s`,
            animationName: "slide",
            animationTimingFunction: "linear",
          }}
        >
          🏉
        </span>
      ))}
      <style jsx>{`
        @keyframes slide {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </>
  );
};
