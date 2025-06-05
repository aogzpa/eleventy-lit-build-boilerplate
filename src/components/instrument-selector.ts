import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {instrumentSelectorSignal, MusicalInstrument} from '../signals/instrument-selector.js';
import {SignalElement} from '../signals/signal-element.js';

declare global {
  interface HTMLElementTagNameMap {
    'instrument-selector': InstrumentSelector;
  }
}

@customElement('instrument-selector')
export class InstrumentSelector extends SignalElement(LitElement) {
  static styles = css`
    form {
      display: inline-flex;
      flex-direction: column;
      gap: 30vw;
      padding: 20px;
      border-radius: 8px;
      background-color: #1f1f1f;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      width: fit-content;
    }
    fieldset {
      border: none;
      padding: 0;
      margin: 0;
    }
    legend {
      font-weight: bold;
      margin-bottom: 10px;
    }
    div {
      display: flex;
      gap: 10px;
    }
    input[type="radio"] {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border: 2px solid #ccc;
      border-radius: 50%;
      outline: none;
      transition: border-color 0.2s ease-in-out;
    }
    input[type="radio"]:checked {
      border-color: #007bff;
      background-color: #007bff;
      background-clip: content-box;
      padding: 4px;
    }
    label {
      cursor: pointer;
    }
    button[type="submit"] {
      margin-top: 10px;
      padding: 10px 15px;
      background-color: #7895ff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1em;
      transition: background-color 0.2s ease-in-out;
    }
    button[type="submit"]:hover {
      background-color: #0056b3;
    }
    button[type="submit"]:active {
      background-color: #003f7f;
    }
  `;

  private _handleSubmit(event: Event) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    instrumentSelectorSignal.value = formData.get("instrument") as keyof typeof MusicalInstrument;
  }

  @property()
  name = 'guitar';

  render() {
    return html`<form id="instrumentForm" @submit=${this._handleSubmit}>
      <fieldset>
        <legend>Select an instrument name:</legend>
        <div>
          <input type="radio" id="instrumentChoice1" name="instrument" value="Guitar" ?checked=${this.name === 'guitar'}>
          <label for="instrumentChoice1">Guitar</label><br>

          <input type="radio" id="instrumentChoice2" name="instrument" value="Piano" ?checked=${this.name === 'piano'}>
          <label for="instrumentChoice2">Piano</label><br>

          <input type="radio" id="instrumentChoice3" name="instrument" value="Drums" ?checked=${this.name === 'drums'}>
          <label for="instrumentChoice3">Drums</label>

          <input type="radio" id="instrumentChoice4" name="instrument" value="Violin" ?checked=${this.name === 'violin'}>
          <label for="instrumentChoice4">Violin</label><br>

          <input type="radio" id="instrumentChoice5" name="instrument" value="Saxophone" ?checked=${this.name === 'saxophone'}>
          <label for="instrumentChoice5">Saxophone</label><br>

          <input type="radio" id="instrumentChoice6" name="instrument" value="Trumpet" ?checked=${this.name === 'trumpet'}>
          <label for="instrumentChoice6">Trumpet</label>
        </div>
        <div>
          <button type="submit">Show instrument</button>
        </div>
      </form>`;
  } 
}
