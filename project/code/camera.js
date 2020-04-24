camera = {};

camera.initalPos = [0, 10, 0];
camera.initalRot = {pitch: -40, yaw: -135};

camera.position = camera.initalPos;
camera.rotation = camera.initalRot;
camera.keys = {};
camera.locked = true;
camera.view = mat4.create();

camera.registerInteraction = function () {
	let canvas = gl.canvas;
	const mouse = {
		pos: {x: 0, y: 0},
		leftButtonDown: false
	};

	function toPos(event) {
		const rect = canvas.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	}

	canvas.addEventListener('mousedown', function (event) {
		mouse.pos = toPos(event);
		mouse.leftButtonDown = event.button === 0;
	});

	canvas.addEventListener('mouseup', function (event) {
		mouse.pos = toPos(event);
		mouse.leftButtonDown = false;
	});

	canvas.addEventListener('mousemove', function (event) {
		const pos = toPos(event);
		const delta = {x: mouse.pos.x - pos.x, y: mouse.pos.y - pos.y};
		if (mouse.leftButtonDown) {
			camera.mouseDrag(delta);
		}
		mouse.pos = pos;
	});

	window.onkeydown = function (event) {
		// store state uf the key
		camera.keys[event.code] = true;

		// place tree on pressing
		if (event.code === 'KeyX' && placingTree === -1) {
			placingTree = 1;
		}

		// make camera free on pressing c
		if (event.code === 'KeyC') {
			camera.position = camera.initalPos;
			camera.rotation = camera.initalRot;
			camera.locked = false;
		}
	};

	window.onkeyup = function (event) {
		// store state uf the key
		camera.keys[event.code] = false;

		// for "placing tree" feature
		if (event.code === 'KeyX') {
			placingTree = -1;
		}
	};
};

camera.mouseDrag = function (delta) {
	if (camera.locked) return;
	const sensitivity = 0.1;
	camera.rotation.pitch -= delta.y * sensitivity;
	camera.rotation.yaw -= delta.x * sensitivity;

	camera.rotation.pitch = util.clamp(camera.rotation.pitch, -85, 85);
};

camera.update = function () {
	if (camera.locked) return;

	const moveVector = camera.directionalInput();
	camera.placeTree();

	const camSpeed = 0.1;
	vec3.scale(moveVector, moveVector, camSpeed);

	// calculate rotation of movement vector
	// movement is only possible on the xz-Plane (going up by looking up is on purpose not possible)
	vec3.transformMat4(moveVector, moveVector, glm.rotateY(camera.rotation.yaw));
	vec3.add(camera.position, camera.position, moveVector);

	// "inverted" multiplication order as we now do not want to calculate a look-at vector, but rather the "inverted world"
	// TODO better explanation (using matrix multiplication order)
	const viewMatrix = mat4.create();
	mat4.rotateX(viewMatrix, viewMatrix, glm.deg2rad(-camera.rotation.pitch));
	mat4.rotateY(viewMatrix, viewMatrix, glm.deg2rad(-camera.rotation.yaw));
	mat4.translate(viewMatrix, viewMatrix, vec3.negate(vec3.create(), camera.position));

	camera.view = viewMatrix;
};

camera.directionalInput = function () {
	let dirvec = vec3.create();

	if (camera.keys['KeyW']) { // forward
		dirvec[2] -= 1;
	}
	if (camera.keys['KeyS']) { // backward
		dirvec[2] += 1;
	}
	if (camera.keys['KeyA']) { // left
		dirvec[0] -= 1;
	}
	if (camera.keys['KeyD']) { // right
		dirvec[0] += 1;
	}
	if (camera.keys['KeyE']) { // up
		dirvec[1] += 1;
	}
	if (camera.keys['KeyQ']) { // down
		dirvec[1] -= 1;
	}

	vec3.normalize(dirvec, dirvec);
	return dirvec;
};

let placingTree = -1;

camera.placeTree = function () {
	// only if tree flag is set
	if (placingTree === 1) {
		scene.addTree(camera.position[0], camera.position[2]);
		placingTree = 0;
	}
};