import {signal}	from './signal-element.js';

enum
MusicInst
{
	GUITAR	= '🎸',
	PIANO	= '🎹',
	DRUMS	= '🥁',
	VIOLIN	= '🎻',
	SAX	= '🎷',
	TRUMPET	= '🎺'
}

type InstName	= keyof typeof MusicInst;
const instSignal= signal<InstName | undefined>(undefined);

export {MusicInst,InstName,instSignal}
