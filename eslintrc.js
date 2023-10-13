module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest", // 5（默认）， 你可以使用 6、7、8、9 或 10 来指定你想要使用的 ECMAScript 版本。你也可以用年份命名的版本号，你也可以用 latest 来指向最新的版本。
    sourceType: "module", // 设置为 "script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)。
    ecmaFeatures: {
      // 表示你想使用的额外的语言特性
      jsx: true // 启用 JSX
    }
  },
  env: {
    node: true,
    es6: true,
    browser: true
  },
  extends: [
    "eslint:recommended",
    "prettier",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  plugins: ["prettier", "react", "react-hooks", "@typescript-eslint"],
  rules: {
    quotes: [2, "single"],
    "react/no-this-in-sfc": 0,
    "react/prop-types": 0,
    "react/display-name": "off",
    // eslint-plugin-react-hooks 的配置
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive -deps": "warn"
  }
}
