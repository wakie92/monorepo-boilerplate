import rnConfig from "@repo/eslint-config/react-native";

const config = [
  ...rnConfig,
  {
    ignores: [".expo/**", "node_modules/**", "metro.config.js", "babel.config.js"],
  },
];

export default config;
