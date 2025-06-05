import {html, css, LitElement, nothing} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {instrumentSelectorSignal, MusicalInstrument} from '../signals/instrument-selector.js';
import {SignalElement} from '../signals/signal-element.js';

@customElement('instrument-viewer')
export class InstrumentViewer extends SignalElement(LitElement) {
  static styles = css`.center {
    text-align: center
  }
    
  .big-text {
    font-size: 100px;
  }`;

  render() {
    return html`<span class="center big-text">
        ${instrumentSelectorSignal.value ? MusicalInstrument[instrumentSelectorSignal.value] : nothing}
    </span>`;
  }
}