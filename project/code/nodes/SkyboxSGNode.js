class SkyboxSGNode extends SGNode {
	static createCubeMap(cubeImages) {
		//create the texture
		const envcubetexture = gl.createTexture();

		//define some texture unit we want to work on
		gl.activeTexture(gl.TEXTURE0);

		//bind the texture to the texture unit
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, envcubetexture);

		//set sampling parameters
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);

		//gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.MIRRORED_REPEAT); //will be available in WebGL 2
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

		//set correct image for each side of the cube map
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); //flipping required for our skybox, otherwise images don't fit together
		gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cubeImages.right);
		gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cubeImages.left);
		gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cubeImages.up);
		gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cubeImages.down);
		gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cubeImages.back);
		gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cubeImages.front);

		//generate mipmaps (optional)
		//not needed for a skybos, as the distance will always be exactly the same (1 unit from center)
		//gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

		//unbind the texture again
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

		return envcubetexture;
	}

	constructor(cubeImages, children) {
		super(children);

		this.cubeTex = SkyboxSGNode.createCubeMap(cubeImages);

		//TODO as we are not using a texture buffer anymore, we could compress the buffer to 8 elements only
		let vertices = [
			//back
			-1, -1, -1, // 0
			-1, +1, -1, // 1
			+1, +1, -1, // 2
			+1, -1, -1, // 3
			//front
			-1, -1, +1, // 4
			-1, +1, +1, // 5
			+1, +1, +1, // 6
			+1, -1, +1, // 7
			//left
			-1, -1, -1, // 8
			-1, +1, -1, // 9
			-1, +1, +1, // 10
			-1, -1, +1, // 11
			//right
			+1, -1, -1, // 12
			+1, +1, -1, // 13
			+1, +1, +1, // 14
			+1, -1, +1, // 15
			//top
			-1, +1, +1, // 16
			-1, +1, -1, // 17
			+1, +1, -1, // 18
			+1, +1, +1, // 19
			//bottom
			-1, -1, +1, // 20
			-1, -1, -1, // 21
			+1, -1, -1, // 22
			+1, -1, +1 // 23
		];

		this.posBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		let indices = [
			0, 2, 1, 0, 3, 2,
			4, 5, 6, 4, 6, 7,
			8, 9, 10, 8, 10, 11,
			12, 14, 13, 12, 15, 14,
			16, 17, 18, 16, 18, 19,
			20, 22, 21, 20, 23, 22
		];

		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

		// safety measures
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	}

	render(context) {
		const backup = context.shader;

		//use the custom shader for skybox mapping
		gl.useProgram(shaders.skybox);

		gl.depthMask(false);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubeTex);
		gl.uniform1i(gl.getUniformLocation(shaders.skybox, 'u_texCube'), 0);

		util.setAttributeBuffer(shaders.skybox, "a_position", this.posBuffer, 3);

		gl.uniformMatrix4fv(gl.getUniformLocation(shaders.skybox, 'u_modelView'), false, context.viewMatrix);
		gl.uniformMatrix4fv(gl.getUniformLocation(shaders.skybox, 'u_projection'), false, context.projectionMatrix);


		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

		//clean up
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

		gl.depthMask(true);

		if (backup) gl.useProgram(backup);
		super.render(context);
	}

}