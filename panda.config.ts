import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      tokens: {
        colors: {
          retro: {
            50: { value: "#f4f5f0" },
            100: { value: "#e7e8df" },
            200: { value: "#d1d4c2" },
            300: { value: "#b4b99d" },
            400: { value: "#979e7c" },
            500: { value: "#7b8260" },
            600: { value: "#5f664a" },
            700: { value: "#4b503b" },
            800: { value: "#3e4232" },
            900: { value: "#363a2d" },
            950: { value: "#1b1d16" },
          },
        },
        shadows: {
          "inset-retro": {
            value: "3px 3px 0px 0px rgba(0, 0, 0, 0.25) inset",
          },
          "inset-retro-xs": {
            value: "2px 2px 0px 0px rgba(0, 0, 0, 0.25) inset",
          },
          "retro-xs": {
            value:
              "2px 2px 0px 0px rgba(0, 0, 0, 0.25) inset, 8px 8px 0px 0px rgba(0, 0, 0, 0.25)",
          },
        },
        borders: {
          "retro-border": {
            value: "4px solid",
            description: "A 4px solid border",
          },
          "retro-border-xs": {
            value: "2px solid",
            description: "A 2px solid border",
          },
        },
      },
    },
  },

  jsxFramework: "react",

  // The output directory for your css system
  outdir: "styled-system",

  strictTokens: true,
  strictPropertyValues: true,
});
