util = {};

util.setAttributeBuffer = function (shader, attribute, buffer, size) {
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

	let attr = gl.getAttribLocation(shader, attribute);
	if (attr < 0) alert(attribute + ": " + attr);
	gl.enableVertexAttribArray(attr);
	gl.vertexAttribPointer(attr, size, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, null);
};

util.createGlTexture = function (textureData) {
	let texture = gl.createTexture();

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureData);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	//unbind and return created texture
	gl.bindTexture(gl.TEXTURE_2D, null);
	return texture;
};

util.textureParams = function (texture, minFilter, magFilter, wrapS, wrapT) {
	gl.bindTexture(gl.TEXTURE_2D, texture);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);

	gl.bindTexture(gl.TEXTURE_2D, null);
};

// spawn particles randomly in cone to create fire
util.randomInCone = function (phi, vec = vec3.fromValues(0, 1, 0)) {
	const zero = vec3.fromValues(0, 0, 0);
	vec3.rotateZ(vec, vec, zero, (Math.random() - 0.5) * phi);
	vec3.rotateY(vec, vec, zero, (Math.random() - 0.5) * Math.PI);
	return vec;
};

util.clamp = function (number, min, max) {
	return Math.max(min, Math.min(number, max));
};

// Taken from framework
// added special treatment for missing parameters -> disable
util.modelRenderer = function (model) {
	//number of vertices
	let numItems = model.index ? model.index.length : model.position.length / 3;
	let position = null;
	let texCoordBuffer = null;
	let normalBuffer = null;
	let indexBuffer = null;

	//first time init of buffers
	function init(gl) {
		position = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, position);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.position), gl.STATIC_DRAW);
		if (model.texture) {
			texCoordBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.texture), gl.STATIC_DRAW);
		}
		if (model.normal) {
			normalBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.normal), gl.STATIC_DRAW);
		}
		if (model.index) {
			indexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.index), gl.STATIC_DRAW);
		}
	}

	return function (context) {
		let gl = context.gl;
		let shader = context.shader;
		if (!shader) {
			return;
		}
		if (position === null) {
			//lazy init
			init(gl);
		}

		//set attributes
		gl.bindBuffer(gl.ARRAY_BUFFER, position);
		let positionLoc = gl.getAttribLocation(shader, 'a_position');
		gl.enableVertexAttribArray(positionLoc);
		gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
		let texCoordLoc = gl.getAttribLocation(shader, 'a_texCoord');
		if (isValidAttributeLocation(texCoordLoc)) {
			if (model.texture) {
				gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
				gl.enableVertexAttribArray(texCoordLoc);
				gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
			} else {
				gl.disableVertexAttribArray(texCoordLoc);
			}
		}
		let normalLoc = gl.getAttribLocation(shader, 'a_normal');
		if (isValidAttributeLocation(normalLoc)) {
			if (model.normal) {
				gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
				gl.enableVertexAttribArray(normalLoc);
				gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
			} else {
				gl.disableVertexAttribArray(normalLoc);
			}
		}
		//render elements
		if (model.index) {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.drawElements(gl.TRIANGLES, numItems, gl.UNSIGNED_SHORT, 0);
		}
		else {
			gl.drawArrays(gl.TRIANGLES, 0, numItems);
		}
	};
};