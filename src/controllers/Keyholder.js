export default class Keyholder {
	constructor() {
		this.pressedKeys = [];
	}
	keyDown(e) {
		const evtObj = e || window.event;
		this.pressedKeys[evtObj.keyCode] = 1;
	}
	keyUp(e) {
		const evtObj = e || window.event;
		delete (this.pressedKeys[evtObj.keyCode]);
	}
	holdEvents(func) {
		for (let keycode in this.pressedKeys) {
			func(keycode);
		}
	}
}
