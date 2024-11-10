// module.exports = {
//   root: true,
//   parserOptions: {
//     parser: 'babel-eslint',
//     sourceType: 'module'
//   },
//   env: {
//     browser: true,
//     node: true,
//     es6: true
//   },
//   extends: ['plugin:vue/essential', 'eslint:recommended'],

//   rules: {
//     // 'vue/max-attributes-per-line': [2, {
//     //   'singleline': 400,
//     //   'multiline': {
//     //     'max': 1,
//     //     'allowFirstLine': false
//     //   }
//     // }],
//     'accessor-pairs': 2,
//     'array-bracket-spacing': [2, 'never'],
//     'arrow-spacing': [2, {
//       'before': true,
//       'after': true
//     }],
//     'block-spacing': [2, 'always'],
//     'brace-style': [2, '1tbs', {
//       'allowSingleLine': true
//     }],
//     'camelcase': [0, {
//       'properties': 'always'
//     }],
//     'comma-spacing': [2, {
//       'before': false,
//       'after': true
//     }], // 逗号前后是否有空格
//     'comma-style': [2, 'last'], // 逗号位于行尾部
//     'eol-last': 1, // 文件最后一行必须有一个空行
//     'func-call-spacing': 1, // 函数名和执行它的括号之间禁止有空格
//     'generator-star-spacing': [2, {
//       'before': true,
//       'after': true
//     }],
//     'indent': [2, 2, {
//       'SwitchCase': 1
//     }],
//     'multiline-ternary': 0,
//     'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
//     'no-multiple-empty-lines': [1, {
//       'max': 3
//     }], // 禁止出现连续三行的空行
//     "no-eval": 1, // 禁止使用eval
//     'no-multi-spaces': 1, // 不允许多个空格
//     'no-undef': 1, // 不允许使用未申明变量
//     'no-unused-vars': 0, // 变量定义未使用
//     'no-self-compare': 2,
//     'no-implied-eval': 2,
//     'no-regex-spaces': 2, // 正则中出现连续表达式
//     'no-duplicate-case': 2,
//     'no-mixed-spaces-and-tabs': 2,  // 禁止混用空格 tab来缩进
//     "no-const-assign": 2, //禁止修改const声明的变量
//     "no-loop-func": 1, // 禁止在循环中使用函数
//     "no-var": 1, // 禁用var，用let和const代替
//     'new-cap': [2, {
//       'newIsCap': true,
//       'capIsNew': false
//     }],
//     'operator-linebreak': ["error", "before"], // 换行时，操作符放在行首
//     "padded-blocks": 0, // 代码块首位不要空行
//     'quotes': [2, 'single', {
//       'avoidEscape': true,
//       'allowTemplateLiterals': true
//     }],
//     "semi": [2, "always"],  // 结尾必须有分号
//     'semi-spacing': [2, {
//       'before': false,
//       'after': true
//     }],
//     "space-in-parens": ["error", "never"], // 小括号首位不要有空格
//     'space-infix-ops': 'error', // 操作符左右要有空格
//     "spaced-comment": 1, // 注释前后需要有空格
//     'template-curly-spacing': 1, // ${name} 内的首尾禁止有空格
//     'key-spacing': [2, {
//       'beforeColon': false,
//       'afterColon': true
//     }],
//     'keyword-spacing': [2, {
//       'before': true,
//       'after': true
//     }],
//   }
// }
module.exports = {
  extends: ['@tencent/eslint-config-tencent'],
};
