/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 *
 * NOTICE: Changed code style.
 */

// Declarative shadow dom polyfill
import {hydrateShadowRoots}	from '@webcomponents/template-shadowroot/template-shadowroot.js';

if(!HTMLTemplateElement.prototype.hasOwnProperty('shadowRoot')){
	hydrateShadowRoots(document.body);
}

document.body.removeAttribute('dsd-pending');
