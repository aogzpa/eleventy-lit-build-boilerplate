import {html,css,LitElement}		from 'lit';
import {customElement,property}		from 'lit/decorators.js';
import {MusicInst,InstName,instSignal}	from '../signals/instruments.js';
import {SignalElement}			from '../signals/signal-element.js';

declare global
{
	interface HTMLElementTagNameMap
	{
		'inst-sel': InstSelector;
	}
}

const names = Object.keys(MusicInst)

@customElement('inst-sel')
class
InstSelector extends SignalElement(LitElement)
{
	@property() name='guitar';

	static styles=css`
		form
		{
			padding:		20px;
			border-radius:		8px;
			background-color:	#030303;
			box-shadow:		0 2px 5px rgba(0, 0, 0, 0.1);
			width:			fit-content;
		}

		fieldset
		{
			border:			none;
			padding:		0;
			margin:			0;
		}

		legend
		{
			font-weight:		bold;
			margin-bottom:		10px;
		}

		div
		{
			display:		flex;
			gap:			10px;
		}

		input[type='radio']
		{
			-webkit-appearance:	none;
			-moz-appearance:	none;
			appearance:		none;
			width:			20px;
			height:			20px;
			border:			2px solid #ccc;
			border-radius:		50%;
			outline:		none;
			transition:		border-color
						0.2s ease-in-out;
		}

		input[type='radio']:checked
		{
			border-color:		#007bff;
			background-color:	#007bff;
			background-clip:	content-box;
			padding:		4px;
		}

		label
		{
			cursor:			pointer;
		}

		button[type='submit']
		{
			margin-top:		10px;
			padding:		10px 15px;
			background-color:	#7895ff;
			color:			white;
			border:			none;
			border-radius:		4px;
			cursor:			pointer;
			font-size:		1em;
			transition:		background-color
						0.2s ease-in-out;
		}

		button[type='submit']:hover
		{
			background-color:	#0056b3;
		}

		button[type='submit']:active
		{
			background-color:	#003f7f;
		}
	`;

	private _handleSubmit
	(event: Event)
	{
		event.preventDefault();

		const eventTarget	= event.target as HTMLFormElement;
		const formData		= new FormData(eventTarget);
		const selected		= formData.get('instrument') as InstName;

		instSignal.value	= selected;
	}

	private _input
	(name: string, i: number)
	{
		return html`
			<input
				type='radio'
				id='instrumentChoice${i}'
				name='instrument'
				value=${name}
				?checked=${this.name === name}>
			<label
				for='instrumentChoice${i}'>
				${name[0]}${name.slice(1).toLowerCase()}
			</label>
		`
	}


	private _fieldset=html`
		<fieldset>
			<legend>Select an instrument name:</legend>
			<div>
				${names.map((name,i)=>this._input(name,i))}
			</div>
		</fieldset>
	`

	private static _submitBtn=html`
		<div>
			<button
				type='submit'>
				Show instrument
			</button>
		</div>
	`

	private _form=html`
		<form
			id='instrumentForm'
			@submit=${this._handleSubmit}>
			${this._fieldset}
			${InstSelector._submitBtn}
		</form>
	`

	render
	()
	{
		return this._form;
	}
}

export {InstSelector}
