# eleventy-plugin-output-path
An Eleventy plugin that adds an `outputPath` filter to get `outputPath` from `inputPath`.

## Installation

```shell
npm install eleventy-plugin-output-path
```

Add it to Eleventy config file (usually `.eleventy.js`)
```javascript
const outputPath = require("eleventy-plugin-output-path");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(outputPath);
};
```

## Usage

This simple plugin adds a filter, `outputPath`, that converts an `inputPath` to an `outputPath`.

The return value of `outputPath` filter is not a file path, but the path part of a URL. (You must know
Eleventy's [`page` variable](https://www.11ty.dev/docs/data-eleventy-supplied/#page-variable).
The return value of `outputPath` filter is like the `url` property of the
[`page` variable](https://www.11ty.dev/docs/data-eleventy-supplied/#page-variable) instead of the
`outputPath` property of that.)

Suppose you have the following project (`input` directory is `src` and `output` directory is `dist`):
```bash
.
├── .eleventy.js
├── dist
│   ├── css
│   │   └── style-42df228b.css
│   └── index.html
│       └── some
│            └── nested
│                └── dir
│                    └── file
│                        └── index.html
└── src
    ├── index.md
    ├── scss
    │   └── style.scss
    └── some
        └── nested
            └── dir
                └── file.md
```

The link tag to your CSS file will be the following:
```html
<link rel="stylesheet" href="/css/style-42df228b.css" />
```

By using `outputPath` filter, you can write the above link tag as follows:
```liquid
<link rel="stylesheet" href="{{ "/scss/style.scss" | outputPath }}" />
```

You can also use relative paths. From `src/index.md`:
```liquid
<link rel="stylesheet" href="{{ "scss/style.scss" | outputPath }}" />
```

From `src/some/nested/dir/file.md`:
```liquid
<link rel="stylesheet" href="{{ "../../../scss/style.scss" | outputPath }}" />
```

