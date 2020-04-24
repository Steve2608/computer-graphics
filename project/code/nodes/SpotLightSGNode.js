class SpotLightSGNode extends LightSGNode {
	constructor(children) {
		super(null, children);
		this.direction = vec3.normalize(vec3.create(), vec3.fromValues(1, -0.5, 0));
		this.angle = Math.PI / 8;
		this._worldDirection = [0, 0, 0];

		this.ambient = [0.0, 0.0, 0.0, 1];
		this.diffuse = rgb(0, 0, 0);
		this.specular = rgb(0, 0, 0);
		this.position = [0, 0, 0];
		this.uniform = "u_spotLight";
	}

	setLightUniforms(context) {
		// only if shader is available
		if (context.shader && isValidUniformLocation(gl.getUniformLocation(context.shader, this.uniform + 'Pos'))) {
			const gl = context.gl;
			gl.uniform3fv(gl.getUniformLocation(context.shader, this.uniform + '.direction'), this._worldDirection);
			gl.uniform1f(gl.getUniformLocation(context.shader, this.uniform + '.angle'), this.angle);
			super.setLightUniforms(context)
		}
	}

	setLightPosition(context) {
		// only if shader is available
		if (context.shader && isValidUniformLocation(gl.getUniformLocation(context.shader, this.uniform + 'Pos'))) {
			const gl = context.gl;
			const position = this._worldPosition || this.position;
			gl.uniform3f(gl.getUniformLocation(context.shader, this.uniform + 'Pos'), position[0], position[1], position[2]);
		}
	}

	computeLightPosition(context) {
		//transform with the current bodymodel view matrix
		const modelViewMatrix = mat4.multiply(mat4.create(), context.viewMatrix, context.sceneMatrix);
		const original = this.position;
		this._worldPosition = vec4.transformMat4(vec4.create(), vec4.fromValues(original[0], original[1], original[2], 1), modelViewMatrix);
		let nMat = mat3.normalFromMat4(mat3.create(), modelViewMatrix);
		vec3.transformMat3(this._worldDirection, this.direction, nMat);
	}
}