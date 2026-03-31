/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  // This block MUST be at the same level as 'plugins'
  daisyui: {
    themes: true, // This is a shortcut that tells DaisyUI to include ALL 30+ themes
  },
}