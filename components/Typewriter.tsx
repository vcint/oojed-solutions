"use client";
import React, { useEffect, useState } from "react";

type Props = {
  text: string;
  speed?: number; // ms per character
  delay?: number; // ms before starting
};

export default function Typewriter({ text, speed = 10, delay = 60 }: Props) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let isMounted = true;
    let idx = 0;
    let tickId: number | undefined;
    let startId: number | undefined;

    setDisplay("");

    startId = window.setTimeout(() => {
      tickId = window.setInterval(() => {
        idx += 1;
        if (!isMounted) return;
        setDisplay(text.slice(0, idx));
        if (idx >= text.length && tickId) {
          window.clearInterval(tickId);
        }
      }, speed) as unknown as number;
    }, delay) as unknown as number;

    return () => {
      isMounted = false;
      if (startId) window.clearTimeout(startId as number);
      if (tickId) window.clearInterval(tickId as number);
    };
  }, [text, speed, delay]);

  return (
    <span className="typewriter-text" aria-live="polite">
      {display}
      <span className="typewriter-cursor" aria-hidden={true}>{"\u258C"}</span>
    </span>
  );
}
