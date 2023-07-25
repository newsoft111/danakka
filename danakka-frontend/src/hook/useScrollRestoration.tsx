export class useScrollRestoration  {

	getPosition() {
    	// 페이지 이동 후 저장되어 있던 위치로 스크롤 복원
		const _scroll = sessionStorage.getItem(`__next_scroll_${window.history.state.idx}`);
		if (_scroll) {
			// 스크롤 복원 후 저장된 위치 제거
			const { x, y } = JSON.parse(_scroll);
			const currentX = window.scrollX;
			const currentY = window.scrollY;
			
			if (currentY < y) {
				window.scrollTo(0, document.body.scrollHeight);				
			} else {
				window.scrollTo(x, y);
			}

			if (currentX === x && currentY === y) sessionStorage.removeItem(`__next_scroll_${window.history.state.idx}`);

			
		};
    }
    setPosition() {
    	sessionStorage.setItem(
			`__next_scroll_${window.history.state.idx}`,
			JSON.stringify({
			  x: window.pageXOffset,
			  y: window.pageYOffset,
			})
		);
    }

	
}