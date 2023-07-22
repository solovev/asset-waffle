/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
module.exports = {
  process(sourceText, sourcePath, options) {
    return {
      code: sourceText.replaceAll("import.meta.env", "{}"),
    };
  },
};
