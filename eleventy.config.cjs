/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 * 
 * NOTICE: Removed playgroundExample, permalinks, filterToc
 * filterSort, mdMarkdown and copyCodeButtonPlugin helpers.
 * Don't add passthrough copies for site folders that do not
 * exist in the starter template.
 */

const litPlugin = require('@lit-labs/eleventy-plugin-lit');
const inlineCss = require('./eleventy-helpers/shortcodes/inline-css.cjs');
const inlineJS = require('./eleventy-helpers/shortcodes/inline-js.cjs');
const minifyHTML = require('./eleventy-helpers/transforms/minify-html.cjs');
const pluginTOC = require('eleventy-plugin-nesting-toc');
const markdownIt = require('markdown-it');
const { compress } = require('eleventy-plugin-compress');

// dev mode build
const DEV = process.env.NODE_ENV === 'DEV';
// where the JS files are outputted
const jsDir = DEV ? 'lib' : 'build';
// where to output 11ty output
const outputFolder = DEV ? '_dev' : '_prod';

module.exports = function (eleventyConfig) {
  // copy folders to the 11ty output folder
  eleventyConfig
    .addPassthroughCopy({ [`${jsDir}/`]: 'js/' })
    .addPassthroughCopy('site/css')
    .addPassthroughCopy('site/images')

  // add the lit-ssr plugin
  eleventyConfig.addPlugin(litPlugin, {
    mode: 'worker',
    componentModules: [`./${jsDir}/ssr.js`],
  });

  // Add this for 11ty's --watch flag
  eleventyConfig.addWatchTarget(`./${jsDir}/**/*.js`);

  // install shortcodes
  inlineCss(eleventyConfig, DEV);
  inlineJS(eleventyConfig, DEV, { jsDir });

  // install transforms
  minifyHTML(eleventyConfig, DEV);

  const md = markdownIt({
    html: true,
    breaks: false, // 2 newlines for paragraph break instead of 1
    linkify: true,
  });

  eleventyConfig.setLibrary('md', md);

  // Add a TOC plugin (implementation is wip for now)
  eleventyConfig.addPlugin(pluginTOC, {
    tags: ['h2', 'h3', 'h4'],
    wrapper: 'div',
  });

  eleventyConfig.addPlugin(compress, {
    enabled: !DEV,
  });

  // set output folders and use nunjucks for html templating engine. see
  // nunjucks docs and 11ty docs for more info on nunjucks templating
  return {
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    dir: {
      input: 'site',
      output: outputFolder,
    },
  };
};