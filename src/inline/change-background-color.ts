type Sheets = typeof globalThis &
	{
		[stylesheetName: string]: CSSStyleSheet | undefined;
	};
  
(()=>{
	const sheet				= new CSSStyleSheet();
	(globalThis as Sheets)['eleventy']	= sheet;

	document.adoptedStyleSheets =
		[
			...document.adoptedStyleSheets,
			sheet
		];

	sheet.replaceSync(`
		:root
		{
			--eleventy-bg-color:	#10151d;
		}
	`);
})();
