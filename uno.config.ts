import { defineConfig, presetUno, presetAttributify } from "unocss";

export default defineConfig({
  content: {
    filesystem: ["**/*.{js,ts,jsx,tsx}"],
  },
  theme: {
    screens: {
      md: "640px",
      lg: "768px",
      xl: "1024px",
      "2xl": "1280px",
    },
  },
  safelist: [
    "animate-bounce-in",
    "animate-bounce-out",
    "animate-slide-out-left",
    "duration-100",
  ],
  presets: [presetUno(), presetAttributify()],
});

