const path = require("path");
const intros = require("eleventy-introspector");

let inputDir;
let outputDir;

let cache = new Map();

const outputPathFilter = function(currentPage) {
  return function(inputPath) {
    let resolvedInputPath;
    if (inputPath[0] === "/") {
      resolvedInputPath = inputDir + inputPath;
    } else {
      let currentDir = path.dirname(currentPage(this).inputPath);
      resolvedInputPath = path.resolve(currentDir, inputPath);
    }

    let outputPath = cache.get(resolvedInputPath);
    if (outputPath)
      return outputPath;

    outputPath = intros.eleventy.writer.templateMap.getMap().find(mapEntry => {
      return path.relative(mapEntry.inputPath, resolvedInputPath) === "";
    })?.outputPath;
    if (outputPath) {
      outputPath = "/" + path.relative(outputDir, outputPath);
      if (outputPath.endsWith("/index.html"))
        outputPath = outputPath.slice(0, -10);
      cache.set(resolvedInputPath, outputPath);
      return outputPath;
    }
  };
};

const currentPage_Liquid     = binding => binding.context.environments.page;
const currentPage_Nunjucks   = binding => binding.ctx.page;
const currentPage_JavaScript = binding => binding.page;

let isConfigured = false;
const eleventyPluginOutputPath = function(eleventyConfig) {
  if (isConfigured) return;
  isConfigured = true

  eleventyConfig.on("eleventy.before", function() {
    inputDir = intros.eleventy.inputDir;
    outputDir = intros.eleventy.outputDir;
    cache.clear();
  });

  eleventyConfig.addLiquidFilter("outputPath", outputPathFilter(currentPage_Liquid));
  eleventyConfig.addNunjucksFilter("outputPath", outputPathFilter(currentPage_Nunjucks));
  eleventyConfig.addHandlebarsHelper("outputPath", outputPathFilter(currentPage_JavaScript));
  eleventyConfig.addJavaScriptFunction("outputPath", outputPathFilter(currentPage_JavaScript));
};


const plugin = {
  configFunction: eleventyPluginOutputPath,
  name: "eleventy-plugin-output-path"
};

module.exports = plugin;
