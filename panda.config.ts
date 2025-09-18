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
      recipes: {
        srOnly: {
          className: "sr-only",
          description: "Accessibility helper that visually hides an element",
          base: {
            position: "absolute",
            width: "[1px]",
            height: "[1px]",
            padding: "0",
            margin: "-[1px]",
            overflow: "hidden",
            whiteSpace: "nowrap",
            borderWidth: "0",
            clip: "rect(0, 0, 0, 0)",
          },
        },
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },

        bottomToTop: {
          from: { transform: "translate3d(0, 99vh, 0)" },
          to: { transform: "translate3d(0, 0vh, 0)" },
        },

        crtTextShadow: {
          "0%": {
            textShadow:
              "0.4389924193300864px 0 1px rgba(0,30,255,0.5), -0.4389924193300864px 0 1px rgba(255,0,80,0.3), 0 0 3px",
          },
          "5%": {
            textShadow:
              "2.7928974010788217px 0 1px rgba(0,30,255,0.5), -2.7928974010788217px 0 1px rgba(255,0,80,0.3), 0 0 3px",
          },
          "10%": {
            textShadow:
              "0.02956275843481219px 0 1px rgba(0,30,255,0.5), -0.02956275843481219px 0 1px rgba(255,0,80,0.3), 0 0 3px",
          },
          "15%": {
            textShadow:
              "0.40218538552878136px 0 1px rgba(0,30,255,0.5), -0.40218538552878136px 0 1px rgba(255,0,80,0.3), 0 0 3px",
          },
          "20%": {
            textShadow:
              "3.4794037899852017px 0 1px rgba(0,30,255,0.5), -3.4794037899852017px 0 1px rgba(255,0,80,0.3), 0 0 3px",
          },
          "25%": {
            textShadow:
              "1.6125630401149584px 0 1px rgba(0,30,255,0.5), -1.6125630401149584px 0 1px rgba(255,0,80,0.3), 0 0 3px",
          },
          "30%": {
            textShadow:
              "0.7015590085143956px 0 1px rgba(0,30,255,0.5), -0.7015590085143956px 0 1px rgba(255,0,80,0.3), 0 0 3px",
          },
          "35%": {
            textShadow:
              "3.896914047650351px 0 1px rgba(0,30,255,0.5), -3.896914047650351px 0 1px rgba(255,0,80,0.3), 0 0 3px",
          },
          "40%": {
            textShadow:
              "3.870905614848819px 0 1px rgba(0,30,255,0.5), -3.870905614848819px 0 1px rgba(255,0,80,0.3), 0 0 3px",
          },
          "45%": {
            textShadow:
              "2.231056963361899px 0 1px rgba(0,30,255,0.5), -2.231056963361899px 0 1px rgba(255,0,80,0.3), 0 0 3px",
          },
          "50%": {
            textShadow:
              "0.08084290417898504px 0 1px rgba(0,30,255,0.5), -0.08084290417898504px 0 1px rgba(255,0,80,0.3), 0 0 3px",
          },
          "55%": {
            textShadow:
              "2.3758461067427543px 0 1px rgba(0,30,255,0.5), -2.3758461067427543px 0 1px rgba(255,0,80,0.3), 0 0 3px",
          },
          "60%": {
            textShadow:
              "2.202193051050636px 0 1px rgba(0,30,255,0.5), -2.202193051050636px 0 1px rgba(255,0,80,0.3), 0 0 3px",
          },
          "65%": {
            textShadow:
              "2.8638780614874975px 0 1px rgba(0,30,255,0.5), -2.8638780614874975px 0 1px rgba(255,0,80,0.3), 0 0 3px",
          },
          "70%": {
            textShadow:
              "0.48874025155497314px 0 1px rgba(0,30,255,0.5), -0.48874025155497314px 0 1px rgba(255,0,80,0.3), 0 0 3px",
          },
          "75%": {
            textShadow:
              "1.8948491305757957px 0 1px rgba(0,30,255,0.5), -1.8948491305757957px 0 1px rgba(255,0,80,0.3), 0 0 3px",
          },
          "80%": {
            textShadow:
              "0.0833037308038857px 0 1px rgba(0,30,255,0.5), -0.0833037308038857px 0 1px rgba(255,0,80,0.3), 0 0 3px",
          },
          "85%": {
            textShadow:
              "0.09769827255241735px 0 1px rgba(0,30,255,0.5), -0.09769827255241735px 0 1px rgba(255,0,80,0.3), 0 0 3px",
          },
          "90%": {
            textShadow:
              "3.443339761481782px 0 1px rgba(0,30,255,0.5), -3.443339761481782px 0 1px rgba(255,0,80,0.3), 0 0 3px",
          },
          "95%": {
            textShadow:
              "2.1841838852799786px 0 1px rgba(0,30,255,0.5), -2.1841838852799786px 0 1px rgba(255,0,80,0.3), 0 0 3px",
          },
          "100%": {
            textShadow:
              "2.6208764473832513px 0 1px rgba(0,30,255,0.5), -2.6208764473832513px 0 1px rgba(255,0,80,0.3), 0 0 3px",
          },
        },
      },
      tokens: {
        animations: {
          crtTextShadow: {
            value: "crtTextShadow 1.6s infinite",
          },
          bottomToTop: {
            value: "bottomToTop 8s linear infinite",
          },
        },
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
          retro: {
            value:
              "3px 3px 0px 0px rgba(0, 0, 0, 0.25) inset, 12px 12px 0px 0px rgba(0, 0, 0, 0.25)",
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
