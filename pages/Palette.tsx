type Palette = {
  bg: string;
  border: string;
  text: string;
  dot: string;
  dash: string;
};
const plains = {
  bg: "#CCD5AE",
  border: "#E9EDC9",
  text: "#FEFAE0",
  dot: "#FAEDCD",
  dash: "#D4A373",
};
const rgb = {
  bg: "#FFFFFF",
  border: "#000000",
  text: "#00ff00",
  dot: "#ff0000",
  dash: "#0000ff",
};
const fructose = {
  bg: "#264653",
  border: "#2a9d8f",
  text: "#e9c46a",
  dot: "#f4a261",
  dash: "#e76f51",
};
const candy = {
  bg: "#cdb4db",
  border: "#ffc8dd",
  text: "#ffafcc",
  dot: "#bde0fe",
  dash: "#a2d2ff",
};
const tough = {
  bg: "#fffcf2",
  border: "#ccc5b9",
  text: "#403d39",
  dot: "#252422",
  dash: "#eb5e28",
};
const moss = {
  bg: "#cad2c5",
  border: "#84a98c",
  text: "#52796f",
  dot: "#354f52",
  dash: "#2f3e46",
};

const cmyk = {
  bg: "#000000",
  border: "#ffffff",
  text: "#FFFF00",
  dot: "#00FFFF",
  dash: "#FF00FF",
};

export const palettes: Record<string, Palette> = {
  rgb: rgb,
  cmyk: cmyk,
  fructose: fructose,
  plains: plains,
  candy: candy,
  tough: tough,
  moss: moss,
};
