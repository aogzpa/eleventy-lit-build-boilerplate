/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 * 
 * NOTE: the list of scopes has been modified, and should be modified according
 * to the specific project necessities.
 */

export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'scope-enum': [
        2,
        'always',
        [
          // Use "/" for multiple scopes: `fix(pages/components): subject"`
          // Omit scope for broad "all" changes.
          'pages',
          'components',
          'signals',
          'ssr-utils',
          'svg',
          'types',
          'utils',
          'images',
          'fonts',
          'css',
          'blog'
        ],
      ],
    },
  };
  