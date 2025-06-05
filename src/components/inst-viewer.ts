import {html,css,LitElement,nothing}	from 'lit';
import {customElement,property}		from 'lit/decorators.js';
import {MusicInst,instSignal}		from '../signals/instruments.js';
import {SignalElement}			from '../signals/signal-element.js';

declare global
{
	interface HTMLElementTagNameMap
	{
		'inst-view': InstViewer;
	}
}

@customElement('inst-view')
class
InstViewer extends SignalElement(LitElement)
{
	static styles=css`
		.center
		{
			text-align:	center
		}
		
		.big-text
		{
			font-size:	100px;
		}
	`;

	render
	()
	{
		return html`
			<span
				class='center big-text'>
				${instSignal.value
					? MusicInst[instSignal.value]
					: nothing
				}
			</span>
		`;
	}
}

export {InstViewer}