import { loadFont as loadSora } from "@remotion/google-fonts/Sora";
import { loadFont as loadHanken } from "@remotion/google-fonts/HankenGrotesk";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexMono";

export const sora = loadSora("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
}).fontFamily;

export const hanken = loadHanken("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
}).fontFamily;

export const plexMono = loadPlex("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
}).fontFamily;
