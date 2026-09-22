// Inline script that runs before hydration to set the theme class,
// preventing a flash of the wrong theme. Reads localStorage, falls back
// to the OS preference.
export function ThemeScript() {
  const code = `(function(){try{var t=localStorage.getItem('cv-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
