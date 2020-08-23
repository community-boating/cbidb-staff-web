export default function newPopWin(url: string, w: number, h: number) {
	var infowin = window.open("", "", "toolbar=no,status=no,menubar=no,location=no,scrollbars=yes,resizable=yes,top=20,left=20,width=" + w + ",height=" + h);
	if (infowin != null) {
		infowin.location.href = url;
		// is the window.focus method supported by this verison of javascript
		// if so, then do it.
		if (window.focus) {
			infowin.focus();
		}
	}
} 