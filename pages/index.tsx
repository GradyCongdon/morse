import type { NextPage } from "next";
import Head from "next/head";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { hexToHSL } from "./colors";
import { defaultsDeep } from "lodash";
import styles from "../styles/Home.module.scss";
import { getNamedRouteRegex } from "next/dist/shared/lib/router/utils/route-regex";
import { moveMessagePortToContext } from "worker_threads";
import { palettes } from "./Palette";
import { getLocalStorageState } from "./getLocalStorageState";

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

const PaletteButton = ({ name, onClick }: any) => {
  const palette = palettes[name];
  const colors = Object.entries(palette).map(([key, x]) => (
    <div
      className={styles.paletteColor}
      style={{ backgroundColor: x }}
      key={key}
    ></div>
  ));
  return (
    <label className={styles.palette}>
      {name}
      <button
        type="button"
        className={styles.paletteButton}
        onClick={onClick}
      ></button>
      <div className={styles.paletteColors}>{colors}</div>
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

const IconCross = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
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
  const isKnown = char.match(/[a-zA-Z]/);
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
      {isKnown && (
        <div className={styles.charArea}>
          <div className={styles.char}>{char}</div>
        </div>
      )}
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

const Hi = () => (
  <div className={styles.hi}>
    <Dot />
    <Dot />
    <Dot />
    <Dot />
    <span className={styles.spacer}> </span>
    <Dot />
    <Dot />
  </div>
);

const useCustomColor = (
  name: string,
  defaultValue: string
): [string, Dispatch<SetStateAction<string>>] => {
  const [value, set] = useState<string>(defaultValue);
  useEffect(() => {
    const hsNoL = hexToHSL(value);
    document.documentElement.style.setProperty(`--color-${name}`, value);
    if (name === "bg") {
      document.documentElement.style.setProperty(`--shadow-color`, hsNoL);
    }
  }, [name, value]);
  return [value, set];
};

export type State = {
  text: string;
  controlsExpanded: boolean;
  displayPlain: boolean;
  showSpaces: boolean;
  showUnknown: boolean;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  colorDot: string;
  colorDash: string;
};
export const defaults = {
  text: "hello world!",
  controlsExpanded: true,
  displayPlain: false,
  showSpaces: false,
  showUnknown: false,
  colorBg: "#FFFFFF",
  colorBorder: "#000000",
  colorText: "#00FF00",
  colorDot: "#0000FF",
  colorDash: "#FF0000",
};

const App = () => {
  const state = getLocalStorageState();
  const [text, setText] = useState<string>(state.text);
  const [controlsExpanded, setControlsExpanded] = useState<boolean>(
    state.controlsExpanded
  );
  const [displayPlain, setDisplayPlain] = useState<boolean>(state.displayPlain);
  const [showSpaces, setShowSpaces] = useState<boolean>(state.showSpaces);
  const [showUnknown, setShowUnknown] = useState<boolean>(state.showUnknown);
  const [colorBg, setColorBg] = useCustomColor("bg", state.colorBg);
  const [colorBorder, setColorBorder] = useCustomColor(
    "border",
    state.colorBorder
  );
  const [colorText, setColorText] = useCustomColor("text", state.colorText);
  const [colorDot, setColorDot] = useCustomColor("dot", state.colorDot);
  const [colorDash, setColorDash] = useCustomColor("dash", state.colorDash);

  const setPalette = (name: string) => {
    const palette = palettes[name];
    if (!palette) return;
    const { bg, border, text, dot, dash } = palette;
    setColorBg(bg);
    setColorBorder(border);
    setColorText(text);
    setColorDot(dot);
    setColorDash(dash);
    return;
  };

  useEffect(() => {
    window.localStorage.setItem(
      "state",
      JSON.stringify({
        text,
        controlsExpanded,
        showSpaces,
        showUnknown,
        colorBg,
        colorBorder,
        colorText,
        colorDot,
        colorDash,
      })
    );
  }, [
    text,
    controlsExpanded,
    showSpaces,
    showUnknown,
    colorBg,
    colorBorder,
    colorText,
    colorDot,
    colorDash,
  ]);

  const space = (x: string) => (showSpaces ? x : x.replace(/ /g, ""));
  const unknown = (x: string) =>
    showUnknown ? x : x.replace(/[^a-zA-Z ]/g, "");

  const visibleText = unknown(space(text.toLowerCase()));

  return (
    <article className={displayPlain ? styles.viewPlain : "view-box"}>
      <div className={styles.inputArea}>
        <input
          type="text"
          className={styles.input}
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
        />
        <button
          className={styles.clear}
          type="button"
          onClick={() => setText("")}
        >
          <IconCross />
        </button>
      </div>

      <div className={styles.controls} aria-expanded={controlsExpanded}>
        <h2>Filters</h2>
        <Checkbox name="Plain" value={displayPlain} set={setDisplayPlain} />
        <Checkbox name="Spaces" value={showSpaces} set={setShowSpaces} />
        <Checkbox name="Unknown" value={showUnknown} set={setShowUnknown} />
        <h2>Colors</h2>
        <Color name="Background" value={colorBg} set={setColorBg} />
        <Color name="Border" value={colorBorder} set={setColorBorder} />
        <Color name="Text" value={colorText} set={setColorText} />
        <Color name="Dot" value={colorDot} set={setColorDot} />
        <Color name="Dash" value={colorDash} set={setColorDash} />
        <h2>Palettes</h2>
        {Object.keys(palettes).map((key) => (
          <PaletteButton key={key} name={key} onClick={() => setPalette(key)} />
        ))}
        <button
          type="button"
          className={styles.controlsButton}
          onClick={() => setControlsExpanded(!controlsExpanded)}
        >
          <IconMixer />
        </button>
      </div>
      {!visibleText ? <Hi /> : <Morse text={visibleText} />}
    </article>
  );
};

const Letters = () => {
  const chars = [];
  for (let i = 65; i <= 90; i++) {
    const char = String.fromCharCode(i);
    chars.push(
      <div className={styles.guide} key={char}>
        <span className={styles.guideChar}>{char}</span>
        {textToMorse[char.toLowerCase()]}
      </div>
    );
  }
  return <div className={styles.letters}>{chars}</div>;
};

const Browser = ({ children, fallback }: any) => {
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  useEffect(() => {
    // setTimeout(() => setHasMounted(true), 200);
    setHasMounted(true);
  }, []);

  if (!hasMounted) return <>{fallback}</>;
  return <>{children}</>;
};

const Blank = () => <></>;

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Morse</title>
        <meta name="description" content="morse code typer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Browser fallback={<Blank />}>
          <App />
        </Browser>
      </main>
    </div>
  );
};

export default Home;
