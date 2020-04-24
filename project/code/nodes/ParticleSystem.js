class ParticleSystem extends SGNode {
	constructor(texture, frequency, spawnAmount, maxParticles) {
		super([]);

		this.texture = texture;
		this.maxParticles = maxParticles;
		this.frequency = frequency;
		this.spawnAmount = spawnAmount;

		this.systemAge = 0;
		this.spawnIndex = 0;
		this.ticksSinceSpawn = 0;

		this.createBuffers();
	}

	createBuffers() {
		//create position buffer
		let quad = [-0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5], bufferData = [];
		for (let i = 0; i < this.maxParticles; i++) {
			bufferData.push.apply(bufferData, quad);
		}

		this.posBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), gl.STATIC_DRAW);

		//create index buffer
		let iQuad = [0, 2, 1, 0, 3, 2], indices = [];
		for (let i = 0; i < this.maxParticles; i++) {
			indices.push(4 * i + iQuad[0]);
			indices.push(4 * i + iQuad[1]);
			indices.push(4 * i + iQuad[2]);
			indices.push(4 * i + iQuad[3]);
			indices.push(4 * i + iQuad[4]);
			indices.push(4 * i + iQuad[5]);
		}

		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

		//create ages buffer
		this.ages = [];
		for (let i = 0; i < this.maxParticles; i++) {
			this.setAge(i, -1); //make particles not displaying initially
		}

		this.ageBuffer = gl.createBuffer();

		//direction vectors
		this.directions = [];
		for (let i = 0; i < this.maxParticles; i++) {
			this.setDirection(i, [0, 0, 0]);
		}

		this.directionBuffer = gl.createBuffer();

		//clear buffer bindings
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		this.updateBuffers();
	}

	spawnParticle(direction) {
		this.setAge(this.spawnIndex, this.systemAge);
		this.setDirection(this.spawnIndex, direction);

		if (++this.spawnIndex >= this.maxParticles) {
			this.spawnIndex = 0;
		}
	}

	setAge(index, value) {
		index *= 4;
		this.ages[index++] = value;
		this.ages[index++] = value;
		this.ages[index++] = value;
		this.ages[index] = value;
	}

	setDirection(index, dirVector) {
		index *= 12;
		for (let i = 0; i < 12; i++) {
			this.directions[index + i] = dirVector[i % 3];
		}
	}

	updateBuffers() {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.ageBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.ages), gl.DYNAMIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.directionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.directions), gl.DYNAMIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}

	update() {
		let dirty = false;
		this.systemAge += 0.001;

		this.ticksSinceSpawn++;
		if (this.ticksSinceSpawn > this.frequency) {
			this.ticksSinceSpawn = 0;
			for (let i = 0; i < this.spawnAmount; i++) {
				this.spawnParticle(util.randomInCone(Math.PI / 4, vec3.fromValues(0, 0.05, 0)));
			}
			dirty = true;
		}

		if (dirty) {
			this.updateBuffers();
		}
		//displayText(this.spawnIndex);
	}

	render(context) {
		gl.useProgram(shaders.particle);

		let modelView = mat4.multiply(mat4.create(), context.viewMatrix, context.sceneMatrix);

		gl.uniformMatrix4fv(gl.getUniformLocation(shaders.particle, 'u_modelView'), false, modelView);
		gl.uniformMatrix4fv(gl.getUniformLocation(shaders.particle, 'u_projection'), false, context.projectionMatrix);
		// used to calculate life span of each individual particle
		gl.uniform1f(gl.getUniformLocation(shaders.particle, "systemAge"), this.systemAge);

		//set texture to sampler 0
		gl.uniform1i(gl.getUniformLocation(shaders.particle, "texture"), 0);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);

		//prepare alpha blending
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
		gl.blendEquation(gl.FUNC_ADD);
		gl.enable(gl.BLEND);
		gl.enable(gl.DEPTH_TEST);
		gl.depthMask(false);

		util.setAttributeBuffer(shaders.particle, "position", this.posBuffer, 2);
		util.setAttributeBuffer(shaders.particle, "createTime", this.ageBuffer, 1);
		util.setAttributeBuffer(shaders.particle, "direction", this.directionBuffer, 3);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.drawElements(gl.TRIANGLES, this.maxParticles * 6, gl.UNSIGNED_SHORT, 0);

		gl.disable(gl.BLEND);
		gl.depthMask(true);

		// restore
		if(context.shader) gl.useProgram(context.shader);
	}
}