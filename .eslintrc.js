// .eslintrc.js
module.exports = {
  parserOptions: {
    "parser": "babel-eslint",
    "ecmaVersion": 2017,
    "sourceType": "module",
    "allowImportExportEverywhere": false,
    "codeFrame": false
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/essential",
    "plugin:vue/strongly-recommended",
    "plugin:vue/recommended",
  ],
  rules: {
    "vue/no-side-effects-in-computed-properties": "off",
    "vue/no-reserved-keys": "warn",
    "vue/require-prop-types": "warn",
    "vue/name-property-casing": "warn",
    "vue/max-attributes-per-line": "off",
    "vue/require-v-for-key": "warn",
    "vue/valid-v-for": "warn",
    "vue/no-parsing-error": "warn",
    "vue/no-v-html": "off",
    "vue/order-in-components": "warn",
    "vue/attributes-order": "warn",
    "vue/html-indent": "warn",
    "vue/component-name-in-template-casing": ["warn", "kebab-case", {
      "ignores": []
    }],
    "vue/html-closing-bracket-spacing": ["warn", {
      "startTag": "never",
      "endTag": "never",
      "selfClosingTag": "never"
    }],
    "vue/no-template-shadow": "off",
    "vue/no-use-v-if-with-v-for": "off",
    "no-process-env": "off",
    "no-unused-vars": ["warn", {"args": "none", "ignoreRestSiblings": true}],
    "no-undef": "error",
    "no-redeclare": "warn",
    "no-empty": ["warn", { "allowEmptyCatch": true }],
    "no-console": "warn",
    "quotes": ["warn", "double", {"allowTemplateLiterals": true}],
    "comma-spacing": "warn",
    "indent": ["warn", 2, {"ignoredNodes": ["TemplateLiteral"]}],
    "object-curly-spacing": ["warn", "never"],
    "key-spacing": "warn",
    "array-bracket-spacing": "warn",
    "block-spacing": ["warn", "never"],
    "func-call-spacing": ["warn", "never"],
    "require-atomic-updates": "off",
    "arrow-spacing": "warn",
    "keyword-spacing": "warn",
    "space-before-blocks": "warn",
    "space-before-function-paren": ["warn", {"anonymous": "always", "named": "never", "asyncArrow": "always"}],
    "space-in-parens": "warn",
    "space-infix-ops": "warn",
    "space-unary-ops": "warn",
    "curly": ["warn", "multi-line"],
  },
  env: {
    "browser": true,
    "node": true,
    "amd": true,
  }
}
