const detectEnter: <T>(f: (ev1: React.KeyboardEvent<any>) => T) => (ev: React.KeyboardEvent<any>) => T = f => {
	return ev => {
		if (ev.which == 13 || ev.keyCode == 13) {
			return f(ev);
		} else {
			return null;
		}
	}
}
export default detectEnter