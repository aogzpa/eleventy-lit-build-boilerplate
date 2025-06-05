type WithStylesheet = typeof globalThis & {
    [stylesheetName: string]: CSSStyleSheet | undefined;
  };
  
(() => {
    const sheet = new CSSStyleSheet();
    (globalThis as WithStylesheet)['eleventy'] = sheet;
    document.adoptedStyleSheets.push(sheet);
    sheet.replaceSync(':root{ --eleventy-bg-color: #10151dff; }');
})();
