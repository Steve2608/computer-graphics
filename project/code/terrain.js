terrain = {};

terrain.createTerrain = function (resources) {
	// although heightmap is 50x50, we used a 30x30 coordinate representation
	const scale = .6;

	// setting up positions and texture coordinates
	let vertices = [];
	let texCoords = [];
	for (let z = 0; z < terrainHeight; z++) {
		for (let x = 0; x < terrainWidth; x++) {
			vertices.push(x * scale);
			vertices.push(heightData[x][z]);
			vertices.push(z * scale);

			// 5x5 textures
			texCoords.push(z / terrainHeight * 10);
			texCoords.push(x / terrainWidth * 10);
		}
	}

	// setting up indices
	let indices = [];
	for (let z = 0; z < terrainHeight - 1; z++) {
		for (let x = 0; x < terrainWidth - 1; x++) {
			// pushing two triangles per iteration (rectangle)
			const lowerLeft = x + z * terrainWidth;
			const lowerRight = (x + 1) + z * terrainWidth;
			const topLeft = x + (z + 1) * terrainWidth;
			const topRight = (x + 1) + (z + 1) * terrainWidth;

			indices.push(topLeft);
			indices.push(lowerRight);
			indices.push(lowerLeft);

			indices.push(topLeft);
			indices.push(topRight);
			indices.push(lowerRight);
		}
	}

	let normals = [];
	for (let index = 0; index < terrainHeight * terrainWidth; index++) {
		/* let i1 = index * 3;
		let i2 = (index + 1) * 3;
		let i3 = (index + 2) + 3;

		let pos1 = vec3.fromValues(vertices[i1], vertices[i1 + 1], vertices[i1 + 2]);
		let pos2 = vec3.fromValues(vertices[i2], vertices[i2 + 1], vertices[i2 + 2]);
		let pos3 = vec3.fromValues(vertices[i3], vertices[i3 + 1], vertices[i3 + 2]);

		let side1 = vec3.sub(vec3.create(), pos1, pos2);
		let side2 = vec3.sub(vec3.create(), pos1, pos3);

		let normal = vec3.cross(vec3.create(), side1, side2);

		normals.push(normal[0]);
		normals.push(normal[1]);
		normals.push(normal[2]);

		Pushing the calculated normals results in shading artefacts*/

		normals.push(0);
		normals.push(1);
		normals.push(0);
	}

	return new TextureSGNode(resources.forest_floor, new RenderSGNode(util.modelRenderer({
		position: vertices,
		normal: normals,
		texture: texCoords,
		index: indices
	})));
};