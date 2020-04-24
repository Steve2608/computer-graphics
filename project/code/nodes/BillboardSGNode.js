class BillboardSGNode extends TransformationSGNode {

	constructor(child) {
		super(null, child);
	}

	render(context) {
		const modelViewMatrix = mat4.multiply(mat4.create(), context.viewMatrix, context.sceneMatrix);
		this.matrix = mat4.invert(mat4.create(), modelViewMatrix);

		// remove translation
		this.matrix[12] = 0.;
		this.matrix[13] = 0.;
		this.matrix[14] = 0.;

		super.render(context);
	}
}