class StateSGNode extends SGNode {
	constructor(enter, leave, children) {
		super(children);
		// defining leave and enter functions to serve as multipurpose switching node
		this.enter = enter;
		this.leave = leave;
	}

	render(context) {
		//call enter function
		this.enter();

		super.render(context);

		//call leave function
		this.leave();
	}
}

class NoCullingSGNode extends StateSGNode {
	constructor(children) {
		super(
			// enter
			function () {
				gl.disable(gl.CULL_FACE);
			},
			// leave
			function () {
				gl.enable(gl.CULL_FACE);
			},
			children);
	}
}

class BlendingSGNode extends StateSGNode {
	constructor(children) {
		super(
			// enter
			function () {
				gl.enable(gl.BLEND);
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
			},
			// leave
			function () {
				gl.disable(gl.BLEND);
			}, children);
	}
}
