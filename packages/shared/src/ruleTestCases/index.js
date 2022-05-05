const { baseTestCases: base } = require('./base');
const { reactTestCases: react } = require('./react');

const ruleTestCases = {
  ...base,
  ...react,
};

module.exports = { ruleTestCases };
