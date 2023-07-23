export const ScrollRestoration = () => {
	sessionStorage.setItem(
		`__next_scroll_${window.history.state.idx}`,
		JSON.stringify({
		  x: window.pageXOffset,
		  y: window.pageYOffset,
		})
	);
}