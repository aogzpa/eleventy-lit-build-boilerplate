/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 *
 * NOTICE: Changed code style.
 */

const htmlMinifier = require('html-minifier');

/**
 * Minifies HTML in production mode. Does nothing in dev mode for a faster build
 * and debuggability
 *
 * @param eleventyConfig The 11ty config in which to attach this transform.
 * @param isDev {boolean} Whether or not the build is in development mode.
 */
function
minifyHTML(eleventyConfig, isDev)
{
	eleventyConfig.addTransform(
		'htmlMinify',
		function
		(content, outputPath)
		{
			if(isDev || !outputPath.endsWith('.html')){
				return content;
			}
			const minified=htmlMinifier.minify(
				content, 
				{
					useShortDoctype: true,
					removeComments: true,
					collapseWhitespace: true
				}
			);
			return minified;
		}
	);
}

module.exports = minifyHTML;
