const test = require("ava");
const Eleventy = require("@11ty/eleventy");
const pluginOutputPath = require("..");


let hash = Buffer.from(Math.random().toString()).toString("base64").slice(0,8);
let expected = `/foo/something-${ hash }/`;

let result;

test.before(async t => {
  let elev = new Eleventy(
    "./test/fixture",
    "./test/fixture/_site",
    {
      config: function(eleventyConfig) {
        eleventyConfig.addPlugin(pluginOutputPath);
        eleventyConfig.addTemplateFormats(["foo"]);
        eleventyConfig.addExtension("foo", {
          compileOptions: {
            permalink: function(contents, inputPath) {
              return (data) => {
                return data.page.filePathStem + "-" + hash + "/index.html";
              }
            }
          },
          compile: function(content, inputPath) {
            return (data) => content;
          }
        });
      }
    }
  );
  result = await elev.toJSON();
});

test("outputPath filter for Liquid with relative path", async t => {
  t.is(result.filter(entry => entry.url === "/liquid/relative/")[0].content.trim(), expected);
});

test("outputPath filter for Liquid with absolute path", async t => {
  t.is(result.filter(entry => entry.url === "/liquid/absolute/")[0].content.trim(), expected);
});

test("outputPath filter for Nunjucks with relative path", async t => {
  t.is(result.filter(entry => entry.url === "/nunjucks/relative/")[0].content.trim(), expected);
});

test("outputPath filter for Nunjucks with absolute path", async t => {
  t.is(result.filter(entry => entry.url === "/nunjucks/absolute/")[0].content.trim(), expected);
});

test("outputPath helper for Handlebars with relative path", async t => {
  t.is(result.filter(entry => entry.url === "/handlebars/relative/")[0].content.trim(), expected);
});

test("outputPath helper for Handlebars with absolute path", async t => {
  t.is(result.filter(entry => entry.url === "/handlebars/absolute/")[0].content.trim(), expected);
});

test("outputPath function for JavaScript with relative path", async t => {
  t.is(result.filter(entry => entry.url === "/js/relative-foo/")[0].content.trim(), expected);
});

test("outputPath function for JavaScript with absolute path", async t => {
  t.is(result.filter(entry => entry.url === "/js/absolute-foo/")[0].content.trim(), expected);
});

