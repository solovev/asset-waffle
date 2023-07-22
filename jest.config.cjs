// eslint-disable-next-line no-undef
const cwd = global.process.cwd();

// eslint-disable-next-line no-undef
module.exports = {
  setupFiles: ["<rootDir>/tests/setupTests.js"],
  transform: {
    "^.+\\.(t|j)sx?$": [
      "jest-chain-transform",
      {
        transformers: [
          `${cwd}/tests/importMetaEnvTransformer.cjs`,
          "@swc/jest",
        ],
      },
    ],
    "^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "jest-transform-stub",
  },
};
