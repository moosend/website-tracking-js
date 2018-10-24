module.exports = {
    moduleFileExtensions: ["ts", "js"],
    preset: "ts-jest",
    transform: {
      "^.+\\.(j|t)sx?$": "ts-jest",
    },
    transformIgnorePatterns: [
      "<rootDir>/node_modules/(?!lodash-es/.*)"
    ]
};