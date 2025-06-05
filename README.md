# Eleventy+Lit build boilerplate

This project serves as a foundational boilerplate for architecting static websites utilizing the [Eleventy](https://www.11ty.dev/) static site generator (SSG). It incorporates [Lit](https://lit.dev/) web components with server-side rendering (SSR) capabilities and integrates [Preact](https://preactjs.com/) signals for reactive state management, following the style of some Google products.        
It provides the essential toolkit for developing sites and progressively enhancing them with TypeScript.

> **Note:** Please ensure your editor uses a monospaced font with tab spaces set to 8. If viewing on GitHub, you can force this setting by adding `?ts=8` to the end of the address bar or setting it in your account preferences.

**Install**

1. [Install Node.js.](http://nodejs.org/)
2. Clone the repository or download the Eleventy+Lit Boilerplate source.
3. Start creating your site in `site` and `src` directories.

**Quick Start**

Tasks are managed by [wireit](https://github.com/google/wireit).        
Default environments are `dev` and `prod`.

> **Note:** Due to reliance on POSIX-specific environment variable handling within scripts, this project's execution is limited to *POSIX-compliant console environments*.

To launch the dev environment:
1. In bash/terminal/command line, `cd` into your project directory.
2. Run `npm install`.
3. Run `npm run dev`.

This will spin up a dev server in the background and your default browser will automatically open the Eleventy site.

## Documentation

This is a boilerplate that you can use as a starting point for your projects.

[Running Tasks](#running-tasks) · [Eleventy](#eleventy) · [TypeScript](#typescript) · [SSR](#ssr) · [Inline scripts](#inline-scripts) · [Signals](#signals) · [Fonts](#fonts) · [Images](#images)


### Running Tasks

The boilerplate uses the `npm run` command to run tasks.

```text
# Main Tasks
npm run dev        # alias of serve:dev --watch (watch mode for md, html, css and ts files)
npm start          # alias of serve:prod --watch (watch mode for md, html, css and ts files)
npm run serve:dev  # typechecks, builds TS code and starts 11ty server (watch mode for md, html and css)
npm run serve:prod # typechecks, builds TS code and starts 11ty server (watch mode for md, html and css)
npm run build:dev  # typechecks, builds TS code and generates the dev env site
npm run build:prod # typechecks, builds TS code and generates the prod env site

# Modular Tasks
npm run build:type-check    # incrementally type checks TypeScript files
npm run build:dev:eleventy  # runs 11ty to build the dev environment static site
npm run build:dev:ts        # build dev env ts files to lib folder
npm run build:prod:eleventy # runs 11ty to build the prod environment static site
npm run build:prod:ts       # build prod env ts files to build folder
```
[**⇡**](#documentation)

### Eleventy

Eleventy is a static site generator (SSG) that sets up various aspects of how the site is built. This system employs a plugin-driven architecture, facilitating surgical customization of the final HTML, CSS, and JavaScript output.

#### Plugin includes
* `@lit-labs/eleventy-plugin-lit`: This is for integrating Lit web components with server-side rendering (SSR).
	<details>
		<summary>
			<b>eleventy.config.cjs</b>
			(Click to expand)
		</summary>

	```text
	const litPlugin = require('@lit-labs/eleventy-plugin-lit');

	eleventyConfig.addPlugin(litPlugin,
	        {
	                mode: 'worker',             // SSR should run in a worker thread.
	                componentModules:
	                [
	                        `./${jsDir}/ssr.js`  // entry point for your Lit SSRd components.
		       ]
	        }
	);
	```
	</details>
* `inline-css.cjs` and `inline-js.cjs`: Custom shortcodes for inlining CSS and JavaScript.
	<details>
		<summary>
			<b>eleventy.config.cjs</b>
			(Click to expand)
		</summary>

	```text
	const inlineCss = require('./eleventy-helpers/shortcodes/inline-css.cjs');
	const inlineJS  = require('./eleventy-helpers/shortcodes/inline-js.cjs');

	inlineCss(eleventyConfig, DEV);
	inlineJS(eleventyConfig, DEV,
	        {
	                jsDir
	        }
	);
	```
	</details>
* `minify-html.cjs`: A custom transform to minify the output HTML.
	<details>
		<summary>
			<b>eleventy.config.cjs</b>
			(Click to expand)
		</summary>

	```text
	const minifyHTML = require('./eleventy-helpers/transforms/minify-html.cjs');

	minifyHTML(eleventyConfig, DEV);
	```
	</details>
* `eleventy-plugin-nesting-toc`: For generating a table of contents.
	<details>
		<summary>
 			<b>eleventy.config.cjs</b>
			(Click to expand)
		</summary>
        
	```text
	const pluginTOC = require('eleventy-plugin-nesting-toc');

	eleventyConfig.addPlugin(pluginTOC,
	        {
	                tags:
	                [
	                        'h2',
	                        'h3',
	                        'h4'
	                ],
	                wrapper: 'div'
	       }
	);
	```
	</details>
* `markdown-it`: A markdown parser.
	<details>
		<summary>
			<b>eleventy.config.cjs</b>
			(Click to expand)
		</summary>

	```text
	const markdownIt = require('markdown-it');

	const md = markdownIt(
	        {
	                html: true,
	                breaks: false, // 2 newlines for paragraph break instead of 1
	                linkify: true
	        }
	);

	eleventyConfig.setLibrary('md', md);
	```
	</details>
* `eleventy-plugin-compress`: For compressing output files.
	<details>
		<summary>
			<b>eleventy.config.cjs</b>
			(Click to expand)
		</summary>

	```text
	const {compress} = require('eleventy-plugin-compress');

	eleventyConfig.addPlugin(compress,
	        {
	                enabled: !DEV
	        }
	);
	```
	</details>

[**⇡**](#documentation)

#### Environments
This boilerplate implements a dual-environment configuration, leveraging an `ENV` environment variable passed to node runners as a boolean flag to differentiate between development and production builds.

When `ENV` evaluates to `DEV`, Eleventy will dynamically resolve JavaScript modules from the `lib` directory. Conversely, for `PROD` builds, scripts resolution will default to the `build` directory. Correspondingly, the build output destination for the entire site will be set to `_dev` in development and `_prod` in production.

<details>
	<summary>
		<b>eleventy.config.cjs</b>
		(Click to expand)
	</summary>

```text
const DEV           = process.env.NODE_ENV === 'DEV';
const jsDir         = DEV ? 'lib' : 'build';
const outputFolder  = DEV ? '_dev' : '_prod';

module.exports=
function
(eleventyConfig)
{
        eleventyConfig.addPassthroughCopy(
                {
                        [`${jsDir}/`]: 'js/'
                }
        )

        eleventyConfig.addPlugin(compress,
                {
                        enabled: !DEV, // Only compress files in PROD env.
                }
        );

        return{
                dir:
                {
                        input: 'site',
                        output: outputFolder
                }
        };
};
```
</details>

[**⇡**](#documentation)


### TypeScript

The boilerplate uses [esbuild](https://esbuild.github.io/) with the [esbuild-plugin-gzip](https://github.com/luncheon/esbuild-plugin-gzip) and [tiny-glob](https://github.com/terkelg/tiny-glob) plugins to parse, compile, and minify TypeScript files.

<details>
	<summary>
		<b>package.json</b>
		(Click to expand)
	</summary>

```text
{
        "devDependencies":
        {
                "esbuild": "^0.17.14",
                "esbuild-plugin-minify-html-literals": "^1.0.1",
                "@luncheon/esbuild-plugin-gzip": "^0.1.0",
                "tiny-glob": "^0.2.9",
                "typescript": "~5.1.6"
        }
}
```
</details>

In the `esbuild.config.mjs` file, there's a `config` object that can be used to control how esbuild should behave.

The development environment configuration is straightforward:

<details>
	<summary>
		<b>esbuild.config.mjs</b>
		(Click to expand)
	</summary>

```text
const DEV       = process.env.NODE_ENV === 'DEV';
const jsFolder  = DEV ? 'lib' : 'build';
let config      =
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
```
</details>

Conversely, the production environment configuration incorporates more advanced setups:
<details>
	<summary>
		<b>esbuild.config.mjs</b>
		(Click to expand)
	</summary>

```text
import gzipPlugin from '@luncheon/esbuild-plugin-gzip';

const DEV         = process.env.NODE_ENV === 'DEV';
const jsFolder    = DEV ? 'lib' : 'build';

let config =
        {
                bundle: true,
                outdir: jsFolder,
                minify: true,                      // Minify JS
                format: 'esm',
                treeShaking: true,
                /*
                 * any comments marked as "legal" (like JSDoc comments or comments containing
                 * specific keywords like /*! or // @license) will be extracted from the bundled
                 * JavaScript file and placed into a separate file.
                 */ 
                legalComments: 'external',
                plugins:
                [
                        gzipPlugin(
                                {
                                        gzip: true // Compress output files with gzip
                                }
                        )
                ],
                write: false,                      // Needs to be off per the gzipPlugin docs
                splitting: true
        };
```
</details>

There's an issue with the `minifyHTMLLiteralsPlugin` in esbuild. It's currently breaking certain CSS properties when applied to SVGs. The problem stems from how the plugin's shouldMinify function is configured. While it attempts to conditionally minify based on tags like `<html>` and `<svg>`, it seems to be causing unintended side effects on SVG styling. This is why the plugin is currently commented out.

TypeScript files should be in the `src` directory. Use `npm run build:dev:ts` or `npm run build:prod:ts` task to run the build.

[**⇡**](#documentation)

### SSR

This boilerplate's primary objective is to optimize static web page generation, specifically targeting content-centric sites with minimal dynamic user interaction. Consequently, the output assets are intended for direct static HTML file serving. TypeScript-powered components integrated into templates must undergo pre-rendering and transformation into static HTML markup to achieve a fully Server-Side Rendered (SSR) output file.        
While Lit's SSR remains a nascent feature, currently in its 'Labs' phase, it delivers substantial advantages. These benefits are primarily focused on optimizing initial load performance, enhancing Search Engine Optimization (SEO), and elevating the overall user experience.

The `esbuild.config.mjs` configuration explicitly defines a build step dedicated to the SSR transformation of TypeScript source files:

<details>
	<summary>
		<b>esbuild.config.mjs</b>
		(Click to expand)
	</summary>

```text
/*
 * Seperate build of the SSR bundle
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
        .catch(()=>process.exit(1));
```
</details>

In simpler terms: Any module imported into `src/ssr.ts` will undergo Server-Side Rendering.

<details>
	<summary>
		<b>src/ssr.ts</b>
		(Click to expand)
	</summary>

```text
import './components/inst-selector.js';
```
</details>

You'll see that the component layout is rendered even when JavaScript is disabled—one can test that by disabling JavaScript in DevTools. 

#### Island architecture 

Island Architecture is a web development pattern that aims to deliver highly performant websites by striking a balance between server-side rendering (SSR) and client-side interactivity. The idea is that the majority of the HTML content is generated on the server (or at build time for SSGs like Eleventy). This provides a fast "first paint" and is good for SEO. Then, only the JavaScript necessary for "islands" of interactive functionality is sent.

In order for this SSRd components to have some kind of interactivity and to function with their full client-side behavior—including their lifecycle callbacks and event handling—we have to hydrate them with their scripts using the Lit tag `<lit-island>`. This tag is provided by the `@lit-labs/eleventy-plugin-lit` to facilitate the "island" pattern.
Essentially, a `<lit-island>` component is a wrapper or a container designed to encapsulate other Lit components (or any client-side JavaScript components) and control when and how they are hydrated (become interactive) on the client side.

To activate the interactive features of the boilerplate examples, a `<lit-island>` tag is incorporated into `site/index.html`. This tag is configured with the entrypoint file as a parameter, and the relevant components are nested within it.
<details>
	<summary>
		<b>site/index.html</b>
		(Click to expand)
	</summary>

```text
<lit-island on:idle import="/js/hydration-entrypoints/home-page.js">
        <inst-sel name="drums"></inst-sel>
        <inst-view></inst-view>
</lit-island>
```
</details>

These are the contents of the entrypoints file
<details>
	<summary>
		<b>src/hydration-entrypoints/home-page.ts</b>
		(Click to expand)
	</summary>

```text
import '../components/inst-selector.js';
import '../components/inst-viewer.js';
```
</details>

Similarly, dynamic content can leverage a front matter boolean parameter named `ssrOnly`. This parameter can be configured to surgically include web component entrypoints via Eleventy layout conditionals, thereby controlling client-side hydration.

<details>
	<summary>
		<b>site/_includes/layouts/posts.html</b>
		(Click to expand)
	</summary>

```text
{% block content %}
        {% if not ssrOnly %}
                <!-- Loads page JS on idle callback at src/hydration-entrypoints/posts/md-file-name.ts -->
                <lit-island on:idle
                        import="/js/hydration-entrypoints{{ page.filePathStem }}.js">
                        {{ content | safe }}
                </lit-island>
        {% else %}
                {{ content | safe }}
        {% endif %}
{% endblock %}
```
</details>

In the boilerplate examples, the initial post replicates the web component set present on the `index.html` page. Consequently, a dedicated entrypoint file responsible for importing both components is required for this post's client-side functionality.

<details>
	<summary>
		<b>src/hydration-entrypoints/posts/post-1.ts</b>
		(Click to expand)
	</summary>

```text
import '../../components/inst-selector.js';
import '../../components/inst-viewer.js';
```
</details>

[**⇡**](#documentation)

### Inline scripts

Inline JavaScript refers to JavaScript code that is directly embedded within an HTML document, typically within `<script>` tags in the `<head>` or `<body>` sections, or as attribute values like `onclick="..."` or `onmouseover="..."`.

When incorporating micro-scripts into a page, inline JavaScript proves beneficial. This approach reduces the number of requisite HTTP requests, thereby minimizing initial render-blocking and accelerating content delivery.        
This is also useful if a script is absolutely critical for the initial rendering of content or for setting up crucial page-level functionality that must execute before anything else, placing it inline within the `<head>` can ensure it runs immediately, e.g. setting the dark/light theme before rendering to avoid [FOUC](https://developer.mozilla.org/en-US/docs/Web/Performance/Avoiding_a_flash_of_unstyled_content).

The boilerplate already includes a mechanism that allows you to place the code to be inlined in a specific folder and it will be built as an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) file. 

<details>
	<summary>
		<b>esbuild.config.mjs</b>
		(Click to expand)
	</summary>

```text
/*
 * Include all TypeScript files within the ./src/inline/ directory and dsd-polyfill.ts
 * using tinyGlob plugin.
 * These files are intended to be inlined directly into the HTML document using <script>
 * tags because they are considered performance-sensitive.
 */
const tsInlineEntrypoints =
        [
                './src/ssr-utils/dsd-polyfill.ts',
                './src/inline/*.ts',
        ];

const inlineFilesPromises = tsInlineEntrypoints.map(
        async (entry) => tinyGlob(entry)
);

const inlineEntryPoints = (
        await Promise.all(inlineFilesPromises)
)
        .flat();

const inlineBuild = esbuild.build(
                {
                        ...config,
                        format: 'iife',
                        splitting: false,
                        entryPoints: inlineEntryPoints,
                }
        )
        .catch(() => process.exit(1));
```
</details>

To integrate this as an inline script, Eleventy templates must leverage the `inlineJs` helper shortcode. Refer to the `site/_includes/default.html` example for implementation:

<details>
	<summary>
		<b>site/_includes/default.html</b>
		(Click to expand)
	</summary>

```text
{% inlinejs "inline/change-background-color.js" %}
```
</details>

This example inline code demonstrates how to set a color dynamically using TypeScript using the css var `--eleventy-bg-color` before the initial paint takes place, avoiding a flash of white screen. The value for this CSS variable is later used in the `site/css/global.css` file:

<details>
	<summary>
		<b>site/css/global.css</b>
		(Click to expand)
	</summary>

```text
body
{
        background-color: var(--eleventy-bg-color);
}
```
</details>

If JavaScript is disabled in the browser, the background color is set via `site/css/no-js.css`. You can test this behavior by disabling JavaScript in DevTools discovering that the background turns to light purple.

[**⇡**](#documentation)

#### DSD polyfill
The boilerplate includes a `dsd-polyfill` as an inline script that allows you to write your Web Components with Declarative Shadow DOM syntax and still have them work correctly in browsers that haven't fully implemented the feature natively yet.

On browsers that don't yet support native declarative shadow DOM, a paint can occur after some or all pre-rendered HTML has been parsed, but before the declarative shadow DOM polyfill has taken effect. This paint is undesirable because it won't include any component shadow DOM. To prevent layout shifts that can result from this render, we use a `"dsd-pending"` attribute in the `<body>` tag to ensure we only paint after we know shadow DOM is active. 

<details>
	<summary>
		<b>site/_includes/default.html</b>
		(Click to expand)
	</summary>

```text
<style>
        body[dsd-pending]
        {
                display: none;
        }
</style>
```
</details>

After polyfill is loaded the `dsd-pending` attribute is removed:

<details>
	<summary>
		<b>src/ssr-utils/dsd-polyfill.ts</b>
		(Click to expand)
	</summary>

```text
import {hydrateShadowRoots} from '@webcomponents/template-shadowroot/template-shadowroot.js';

if(!HTMLTemplateElement.prototype.hasOwnProperty('shadowRoot')){
        hydrateShadowRoots(document.body);
}
document.body.removeAttribute('dsd-pending');
```
</details>

[**⇡**](#documentation)

### Signals

Signals are used to manage and share state between different components. This boilerplate uses the `@preact/signals-core` library that integrates well with Lit.

The `src/signals/signal-element.ts` file provides a mixin that extends Lit's `ReactiveElement` and adds functionality to automatically request an update (re-render) of the component when a signal used within the component's render function changes. This is achieved by using the `effect` function from `@preact/signals-core` within the `performUpdate` lifecycle method of the Lit element. The `effect` function tracks the signals accessed within the render and triggers a re-render (`requestUpdate`) when any of those signals change.

To leverage this mechanism, simply instantiate your components by extending from the designated mixin. Refer to the provided example components for implementation guidance:

<details>
	<summary>
		<b>src/components/inst-selector.ts</b>
		(Click to expand)
	</summary>

```text
@customElement('inst-sel')
export class
InstSelector extends SignalElement(LitElement)
{}
```
</details>

Subsequently, instantiate a signal with your desired value, mirroring the example syntax in `src/signals/instruments.ts`:

<details>
	<summary>
		<b>src/signals/instruments.ts</b>
		(Click to expand)
	</summary>

```text
enum
MusicInst
{
        GUITAR  = '🎸',
        PIANO   = '🎹',
        DRUMS   = '🥁',
        VIOLIN  = '🎻',
        SAX     = '🎷',
        TRUMPET = '🎺'
}

type InstName   = keyof typeof MusicInst;
const instSignal= signal<InstName | undefined>(undefined);
```
</details>

Finally, components that need to react to changes in the signal, like the `<inst-viewer>` component, extend the `SignalElement` mixin as well, and then access the `instSignal.value` within their `render()` function. Because the component extends `SignalElement`, any changes to the signal value will automatically trigger a re-render of the component, ensuring the component state is always up-to-date.

[**⇡**](#documentation)

### Fonts
This boilerplate features integrated layout mechanisms to optimize font-loading. This includes preconnecting to the designated font provider (currently Google Fonts) and parameterizing URL query parameters to enable granular asset downloading, thereby fetching only essential font resources.

<details>
	<summary>
		<b>site/_includes/default.html</b>
		(Click to expand)
	</summary>

```text
<!-- Preconnection avoids delays in fonts rendering -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&family=Roboto:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" media="print" onload="this.media='all'; this.onload=null;">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&icon_names=home&display=block" rel="stylesheet" media="print" onload="this.media='all'; this.onload=null;">
```
</details>

There also other optimization:
* `media="print"`        
        * This attribute specifies the media type or types for which the linked resource is intended.
        * Initially, by setting `media="print"`, the browser will only apply this stylesheet when the page is being printed. This means it won't block the rendering of the page for screen display while the font is loading. This is a common optimization technique called "load CSS asynchronously" or "defer non-critical CSS".
* `onload="this.media='all'; this.onload=null;"`
        * This is an event handler that executes JavaScript code after the stylesheet has finished loading. A critical dependency means that if JavaScript fails to load or is disabled, your fonts won't render. To maintain visual consistency for all users, you must include these same CSS import rules in your `site/css/no-js.css` stylesheet.
                ```text site/css/no-js.css
                @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono&family=Roboto:ital,wght@0,400..700;1,400..700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&icon_names=home&display=swap');
                ```
        * `this.media='all'`: Once the stylesheet is loaded (and initially only applied for print media), this JavaScript line changes the `media` attribute from `"print"` to `"all"`. This makes the stylesheet apply to all media types (screens, print, etc.), thus making the font available for general display on the web page.
        * `this.onload=null;`: This removes the onload event handler after it has executed. This is good practice to prevent the code from running again if the stylesheet were somehow re-loaded, and it also frees up memory.

Icons are a little bit more tricky.
To avoid large network transfer costs, subset the font to only
include the icons your application is using via the
`&icon_names` query parameter, using an alphabetically sorted
comma-separated list of icon names (ligatures.) 

Let's see some examples:
<table>
        <thead>
                <tr>
                        <th>URL</th>
                        <th>Considerations</th>
                </tr>
        </thead>
        <tbody>
                <tr>
                        <td><pre>https://fonts.googleapis.com/css2?
family=Material+Symbols+Outlined</pre></td>
                        <td>Loads all 3,000+ icons. Not specifying axes loads the default static configuration (weight 400, optical size 24, round 50, grade 0, fill 0) which may or may not be your application desired settings.<br>Font payload: <strong>255 KB.</strong></td>
                </tr>
                <tr>
                        <td><pre>https://fonts.googleapis.com/css2?
family=Material+Symbols+Outlined
&icon_names=home,palette,settings
&display=block</pre></td>
                        <td>Loads only 3 icons. Then, instance the variable font axes to only include the ones your application will use. Most applications only need a few variations of the axes.<br>Font payload: <strong>2 KB</strong></td>
                </tr>
                <tr>
                        <td><pre>https://fonts.googleapis.com/css2?
family=Material+Symbols+Outlined
:opsz,wght,FILL,GRAD
@20..48,100..700,0..1,-50..200</pre></td>
                        <td>Including all variable font axes is usually unnecessary and increases the payload.<br>        
                        Font payload: <strong>3.2 MB</strong></td>
                </tr>
                <tr>
                        <td><pre>https://fonts.googleapis.com/css2?
family=Material+Symbols+Outlined
:FILL
@0..1
&icon_names=home,palette,settings
&display=block</pre></td>
                        <td>A specific combination of axes is used. Just as an example, the full 'FILL' axis provides CSS transitions between states, and 'ROND' 100 is the desired design.<br>Font payload: <strong>2 KB</strong></td>
                </tr>
        </tbody>
</table>

Ensure the CSS request includes `&display=block` to prevent a [flash of unstyled text content](https://en.wikipedia.org/wiki/Flash_of_unstyled_content) (FOUC) showing the ligatures until the font loads.

[**⇡**](#documentation)

### Images

To include images into the website, place them within the `site/images` directory. For optimal performance, it's highly recommended to optimize these assets. Utilize a tool such as [Squoosh](https://squoosh.app/) to achieve maximum compression, meticulously fine-tuning the configuration to yield the smallest possible file sizes without compromising visual integrity.

[**⇡**](#documentation)

## Acknowledgements

I'd like to extend my sincere gratitude to [**@e111077**](https://github.com/e111077) and [**@asyncLiz**](https://github.com/asyncLiz) for their invaluable contribution in providing the Material Web Components catalog. Their work has been instrumental, serving as the core foundation for this boilerplate.
