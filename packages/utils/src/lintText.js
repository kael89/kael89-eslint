const lintText = async (eslint, text, options = {}) => {
  // ESLint.lintText always returns an array containing one element
  const [results] = await eslint.lintText(text, options);
  return results;
};

module.exports = { lintText };
