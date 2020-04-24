class AnimationSGNode extends SGNode {
	constructor(animation, children) {
		super(children);
		this.animation = animation;
	}

	render(context) {
		//backup previous one
		const previous = context.sceneMatrix;

		const animMatrix = this.animation(context.time);
		context.sceneMatrix = previous === null ? animMatrix : mat4.multiply(mat4.create(), previous, animMatrix);

		super.render(context);

		context.sceneMatrix = previous;
	}
}
