/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 * 
 * NOTICE: Removed playground-elements workers copies to
 * build folder
 */

import gzipPlugin	from '@luncheon/esbuild-plugin-gzip';
import esbuild		from 'esbuild';
import tinyGlob		from 'tiny-glob';

const DEV		= process.env.NODE_ENV === 'DEV';
const jsFolder		= DEV ? 'lib' : 'build'; // Output folder for TS files
let componentsBuild	= Promise.resolve();

const tsEntrypoints =
	[
		/*
		 * can use glob syntax. this will create a bundle for those specific files.
		 * you want to add SSR'd files here so that you can hydrate them later with
		 * <lit-island import="js/components/element-definition.js"></lit-island>
		 */
		'./src/hydration-entrypoints/**/*.ts',
		'./src/pages/*.ts',
		'./src/ssr-utils/lit-hydrate-support.ts',
		'./src/ssr-utils/lit-island.ts'
	];
const prodConfig = 
	{
		bundle: true,
		outdir: jsFolder,
		minify: true,
		format: 'esm',
		treeShaking: true,
		legalComments: 'external',
		plugins:
		[
			//This plugin currently breaks certain css props for SVGs
			//(circularprogress) minifyHTMLLiteralsPlugin({
			//	shouldMinify: (template)=>{
			//		const tag=template.tag && template.tag.toLowerCase();
			//		return(
			//			!!tag &&
			//			(tag.includes('html') || tag.includes('svg')) &&
			//			// tag name interpolations break
			//			tag!=='statichtml'
			//		);
			//	},
			//}),
			gzipPlugin(
				{
					gzip: true,
				}
			)
		],
		// Needs to be off per the gzipPlugin docs
		write: false,
		splitting: true
	};
const config =
	{
		/*
		 * Shared esbuild config values
		 */
		bundle: true,
		outdir: jsFolder,
		minify: false,
		format: 'esm',
		treeShaking: true,
		write: true,
		sourcemap: true,
		splitting: true
	};


const filesPromises	= tsEntrypoints.map(async (entry) => tinyGlob(entry));
const entryPoints 	= (await Promise.all(filesPromises)).flat();

if(DEV){
	componentsBuild = esbuild.build(
			{
				...config,
				entryPoints,
			}
		)
		.catch(() => process.exit(1));
}else{
	/*
	  * config must be same for SSR and client builds to prevent hydration template
	  * mismatches because we minify the templates in prod
	  */
	config		= prodConfig;
	componentsBuild = esbuild.build(
			{
				...config,
				entryPoints
			}
		)
		.catch(() => process.exit(1));
}

/*
  * seperate build so that the SSR bundle doesn't affect bundling for the
  * frontend
  */
const ssrBuild = esbuild.build(
	{
		...config,
		format: 'iife',
		splitting: false,
		conditions:
		[
			'node'
		],
		entryPoints:
		[
			'src/ssr.ts'
		]
	}
)
.catch(() => process.exit(1));

const tsInlineEntrypoints =
	[
		/*
		  * Glob of files that will be inlined on the page in <script> tags
		  * for performance-senstive parts
		  */
		'./src/ssr-utils/dsd-polyfill.ts',
		'./src/inline/*.ts'
	];
const inlineFilesPromises	= tsInlineEntrypoints.map(async (entry) => tinyGlob(entry));
const inlineEntryPoints		= (await Promise.all(inlineFilesPromises)).flat();
const inlineBuild 		= esbuild.build(
	{
		...config,
		format: 'iife',
		splitting: false,
		entryPoints: inlineEntryPoints
	}
)
.catch(() => process.exit(1));

await Promise.all(
	[
		componentsBuild,
		ssrBuild,
		inlineBuild
	]
);

process.exit(0);
