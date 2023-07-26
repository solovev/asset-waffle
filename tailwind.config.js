/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // Fix mantine.ui styles: https://github.com/orgs/mantinedev/discussions/1672#discussioncomment-5922089
  corePlugins: { preflight: false },
  theme: {
    extend: {},
  },
  plugins: [],
};

