/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}","./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
    colors:{
      c1:'#F9F8F6',
      c2:'#EFE9E3',
      c3:'#D9CFC7',
      c4:'#C9B59C',
      g1:'#BBC863'
    }
  },
  plugins: [],
}