/** @type {import("next-css-obfuscator").Options} */
module.exports = {
    enable: true,
    mode: "simplify",
    allowExtensions: [".jsx", ".tsx", ".js", ".ts", ".html"],
    refreshClassConversionJson: process.env.NODE_ENV === "development",
    buildFolderPath: ".next",
    blackListedFolderPaths: [
      '.next/dev'
    ]
  };