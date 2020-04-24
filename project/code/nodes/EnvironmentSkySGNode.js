class EnvironmentSkySGNode extends SGNode {

	constructor(envtexture, textureunit, doReflect, children) {
		super(children);
		this.envtexture = envtexture;
		this.textureunit = textureunit;
		this.doReflect = doReflect;
	}

	render(context) {
		//set additional shader parameters
		let invView3x3 = mat3.fromMat4(mat3.create(), context.invViewMatrix); //reduce to 3x3 matrix since we only process direction vectors (ignore translation)
		gl.uniformMatrix3fv(gl.getUniformLocation(context.shader, 'u_invView'), false, invView3x3);
		gl.uniform1i(gl.getUniformLocation(context.shader, 'u_texCube'), this.textureunit);
		gl.uniform1i(gl.getUniformLocation(context.shader, 'u_useReflection'), this.doReflect);

		//activate and bind texture
		gl.activeTexture(gl.TEXTURE0 + this.textureunit);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.envtexture);

		//render children
		super.render(context);

		//clean up
		gl.activeTexture(gl.TEXTURE0 + this.textureunit);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
	}
}