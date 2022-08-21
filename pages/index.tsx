import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { hexToHSL } from "./colors";
import styles from "../styles/Home.module.scss";

type Knot = Record<string, string>;

const Dot = () => <span className={styles.dot}>·</span>;
const Dash = () => <span className={styles.dash}>-</span>;
const Space = () => <span className={styles.space}>⎵</span>;
const Unknown = ({ x }: { x: string }) => (
  <span className={styles.unknown}>{x}</span>
);

const Color = ({ value, set, name }: any) => {
  return (
    <label className={styles.color}>
      {name}
      <input
        type="color"
        value={value}
        onChange={(e) => set(e.currentTarget.value)}
      />
    </label>
  );
};
const Checkbox = ({ value, set, name }: any) => {
  return (
    <label className={styles.checkbox}>
      {name}
      <input type="checkbox" checked={value} onChange={(e) => set(!value)} />
    </label>
  );
};

const IconMixer = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.5 3C4.67157 3 4 3.67157 4 4.5C4 5.32843 4.67157 6 5.5 6C6.32843 6 7 5.32843 7 4.5C7 3.67157 6.32843 3 5.5 3ZM3 5C3.01671 5 3.03323 4.99918 3.04952 4.99758C3.28022 6.1399 4.28967 7 5.5 7C6.71033 7 7.71978 6.1399 7.95048 4.99758C7.96677 4.99918 7.98329 5 8 5H13.5C13.7761 5 14 4.77614 14 4.5C14 4.22386 13.7761 4 13.5 4H8C7.98329 4 7.96677 4.00082 7.95048 4.00242C7.71978 2.86009 6.71033 2 5.5 2C4.28967 2 3.28022 2.86009 3.04952 4.00242C3.03323 4.00082 3.01671 4 3 4H1.5C1.22386 4 1 4.22386 1 4.5C1 4.77614 1.22386 5 1.5 5H3ZM11.9505 10.9976C11.7198 12.1399 10.7103 13 9.5 13C8.28967 13 7.28022 12.1399 7.04952 10.9976C7.03323 10.9992 7.01671 11 7 11H1.5C1.22386 11 1 10.7761 1 10.5C1 10.2239 1.22386 10 1.5 10H7C7.01671 10 7.03323 10.0008 7.04952 10.0024C7.28022 8.8601 8.28967 8 9.5 8C10.7103 8 11.7198 8.8601 11.9505 10.0024C11.9668 10.0008 11.9833 10 12 10H13.5C13.7761 10 14 10.2239 14 10.5C14 10.7761 13.7761 11 13.5 11H12C11.9833 11 11.9668 10.9992 11.9505 10.9976ZM8 10.5C8 9.67157 8.67157 9 9.5 9C10.3284 9 11 9.67157 11 10.5C11 11.3284 10.3284 12 9.5 12C8.67157 12 8 11.3284 8 10.5Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    ></path>
  </svg>
);

const textToMorse: Knot = {
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".--",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
};

const displayChar: Knot = {
  " ": " ",
};

const Letter = ({ char: _char }: { char: string }) => {
  const char = displayChar[_char] || _char;
  const code = textToMorse[char] || char;
  const symbols = code.split("").map((m) => {
    switch (m) {
      case ".": {
        return <Dot />;
      }
      case "-": {
        return <Dash />;
      }
      case " ": {
        return <Space />;
      }
      default: {
        return <Unknown x={m} />;
      }
    }
  });

  return (
    <span className={styles.letter}>
      <div className={styles.charArea}>
        <div className={styles.char}>{char}</div>
      </div>
      <div className={styles.dots}>
        {symbols.map((s, i) => (
          <span key={i} className={styles.symbol}>
            {s}
          </span>
        ))}
      </div>
    </span>
  );
};

const Morse = ({ text }: { text: string }) => {
  const morse = text
    .split("")
    .map((char: string, i: number) => (
      <Letter key={`${char}-${i}`} char={char} />
    ));
  return <div className={styles.morse}>{morse}</div>;
};

const useCustomColor = (name: string, defaultValue: string) => {
  const [value, set] = useState<string>(defaultValue);
  useEffect(() => {
    const hsl = hexToHSL(value);
    document.documentElement.style.setProperty(
      `--color-${name}`,
      value
    );
    if (name === 'bg') {
    document.documentElement.style.setProperty(
      `--color-hsl-${name}`,
      hsl 
    );

    document.documentElement.style.setProperty(
      `--shadow-elevation-high`,
      `0.6px 1px 1.3px hsl(${hsl} / 0.27),
      2.6px 4px 5.1px -0.4px hsl(${hsl} / 0.26),
      4.7px 7.3px 9.3px -0.8px hsl(${hsl} / 0.26),
      7.9px 12.2px 15.6px -1.2px hsl(${hsl} / 0.25),
      12.8px 19.9px 25.4px -1.6px hsl(${hsl} / 0.24),
      20.3px 31.5px 40.2px -2px hsl(${hsl} / 0.23),
      31.3px 48.5px 61.9px -2.4px hsl(${hsl} / 0.22),
      46.4px 72px 91.9px -2.8px hsl(${hsl} / 0.21)`);
    }
  }, [name, value]);
  return [value, set];
};

const Home: NextPage = () => {
  const [text, setText] = useState<string>("hello world ");
  const [controlsExpanded, setControlsExpanded] = useState<boolean>(true);
  const [showSpaces, setShowSpaces] = useState<boolean>(false);
  const [showUnknown, setShowUnknown] = useState<boolean>(false);
  const [colorBg, setColorBg] = useCustomColor("bg", "#FFFFFF");
  const [colorBorder, setColorBorder] = useCustomColor("border", "#000000");
  const [colorText, setColorText] = useCustomColor("text", "#00FF00");
  const [colorDot, setColorDot] = useCustomColor("dot", "#0000FF");
  const [colorDash, setColorDash] = useCustomColor("dash", "#FF0000");

  const space = (x: string) => (showSpaces ? x : x.replace(/ /g, ""));
  const unknown = (x: string) =>
    showUnknown ? x : x.replace(/[^a-zA-Z ]/g, "");

  const visibleText = unknown(space(text));

  return (
    <div className={styles.container}>
      <Head>
        <title>Morse</title>
        <meta name="description" content="morse code typer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <>
          <input
            type="text"
            className={styles.input}
            onChange={(e) => setText(e.currentTarget.value)}
          />

          <div className={styles.controls} aria-expanded={controlsExpanded}>
            <Checkbox name="Spaces" value={showSpaces} set={setShowSpaces} />
            <Checkbox name="Unknown" value={showUnknown} set={setShowUnknown} />
            <br />
            <Color name="Background" value={colorBg} set={setColorBg} />
            <Color name="Border" value={colorBorder} set={setColorBorder} />
            <Color name="Text" value={colorText} set={setColorText} />
            <Color name="Dot" value={colorDot} set={setColorDot} />
            <Color name="Dash" value={colorDash} set={setColorDash} />
            <button
              type="button"
              className={styles.controlsButton}
              onClick={() => setControlsExpanded(!controlsExpanded)}
            >
              <IconMixer />
            </button>
          </div>
          <Morse text={visibleText} />
        </>
      </main>
    </div>
  );
};

export default Home;
