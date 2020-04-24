class TextureSGNode extends SGNode {
	constructor(image, children) {
		super(children);
		this.image = image;
		// deliberately cause errors on malfunction
		this.texture = -1;
	}

	init(gl) {
		this.texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.texture);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter || gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter || gl.LINEAR);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS || gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT || gl.REPEAT);

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);

		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	render(context) {
		if (this.texture < 0) {
			this.init(context.gl);
		}

		//enable texturing in the shader
		gl.uniform1i(gl.getUniformLocation(context.shader, 'u_enableObjectTexture'), 1);

		//get a texture unit (or 0 if none is given yet) and increment by one for further texture nodes
		let texunit = context.texunit || 0;
		context.texunit = texunit + 1;

		//set texture unit evaluated from context
		gl.uniform1i(gl.getUniformLocation(context.shader, 'u_tex'), texunit);

		//activate/select texture unit and bind texture
		gl.activeTexture(gl.TEXTURE0 + texunit);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);

		//render children
		super.render(context);

		//clean up
		gl.activeTexture(gl.TEXTURE0 + texunit); //set active texture unit since it might have changed in children render functions

		//bind a clearly recognizable texture meaning "no texture bound" and the texture unit should not be used
		gl.bindTexture(gl.TEXTURE_2D, no_texture);

		//disable texturing in shader again
		gl.uniform1i(gl.getUniformLocation(context.shader, 'u_enableObjectTexture'), 0);
		context.texunit--; //subtract one again from the used texture unit

		// reset texture
		gl.uniform1i(gl.getUniformLocation(context.shader, 'u_tex'), context.texunit);
	}
}