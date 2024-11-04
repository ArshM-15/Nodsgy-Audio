/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: "#FFE500",
        gray: "#6F6E6E",
        faintyellow: "#FEFFD7",
        "gradient-color-one": "rgb(255, 253, 237)",
        "gradient-color-two": "rgb(255, 249, 198)",
      },
      keyframes: {
        slideInFromBottom: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        confetti: {
          "0%": { transform: "scale(1) rotate(0deg)" },
          "25%": { transform: "scale(1.5) rotate(-10deg)" },
          "50%": { transform: "scale(1.5) rotate(10deg)" },
          "75%": { transform: "scale(1.5) rotate(-10deg)" },
          "100%": { transform: "scale(1) rotate(0deg)" },
        },
      },
      animation: {
        slideInFromBottom: "slideInFromBottom 0.4s ease-out forwards",
        confetti: "confetti 1s ease-in-out",
      },
      screens: {
        "aboutScreenWidth": "1000px", // Custom breakpoint at 1000px
      },
    },
  },
};
