function createSphere(xPos = 0, yPos = 0, zPos = 0, x = 1, y = 1, z = 1, latitudeBands = 12, longitudeBands = 12) {
	// based on view-source:http://learningwebgl.com/lessons/lesson11/index.html
	let vertices = [];
	let normals = [];
	let texCoordinates = [];
	for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
		let theta = latNumber * Math.PI / latitudeBands;
		let sinTheta = Math.sin(theta);
		let cosTheta = Math.cos(theta);
		for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
			const phi = longNumber * 2 * Math.PI / longitudeBands;
			const sinPhi = Math.sin(phi);
			const cosPhi = Math.cos(phi);
			const x = cosPhi * sinTheta;
			const y = cosTheta;
			const z = sinPhi * sinTheta;
			const u = 1 - (longNumber / longitudeBands);
			const v = 1 - (latNumber / latitudeBands);
			normals.push(x);
			normals.push(y);
			normals.push(z);
			texCoordinates.push(u);
			texCoordinates.push(v);
			vertices.push(x);
			vertices.push(y);
			vertices.push(z);
		}
	}
	let indexData = [];
	for (let latNumber = 0; latNumber < latitudeBands; latNumber++) {
		for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
			const first = (latNumber * (longitudeBands + 1)) + longNumber;
			const second = first + longitudeBands + 1;
			indexData.push(first);

			// SWAPPED 2 and 3
			indexData.push(first + 1);
			indexData.push(second);

			indexData.push(second);

			// SWAPPED 5 and 6
			indexData.push(first + 1);
			indexData.push(second + 1);
		}
	}

	const data = {
		position: vertices,
		normal: normals,
		texture: texCoordinates,
		index: indexData
	};

	return new TransformationSGNode(glm.translate(xPos, yPos, zPos),
		new TransformationSGNode(
			glm.scale(x, y, z),
			new RenderSGNode(util.modelRenderer(data))
		)
	);
}

function createQuad(xPos = 0, yPos = 0, zPos = 0, x = 1, y = 1, z = 1) {
	const vertices = [
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

	const indices = [
		0, 1, 2, 0, 2, 3,
		4, 6, 5, 4, 7, 6,
		8, 10, 9, 8, 11, 10,
		12, 13, 14, 12, 14, 15,
		16, 18, 17, 16, 19, 18,
		20, 21, 22, 20, 22, 23
	];

	const normals = [
		0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
		0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
		-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
		1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
		0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
		0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
	];

	const data = {
		position: vertices,
		normal: normals,
		index: indices
	};

	return new TransformationSGNode(glm.translate(xPos, yPos, zPos),
		new TransformationSGNode(
			glm.scale(x, y, z),
			new RenderSGNode(util.modelRenderer(data))
		)
	);
}