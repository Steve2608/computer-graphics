people = {};

people.wizard = function () {
	let body = createQuad(0, 0, 0, 0.35, 0.7, 0.35);
	let head = createSphere(0, 0.85, 0, 0.3, 0.3, 0.3, 12, 12);
	let leftArm = createQuad(0.4, 0.0, 0, 0.1, 0.5, 0.1);

	let rightArm = createQuad(-0.4, 0.0, -0.3, 0.1, 0.1, 0.5);
	let staff = createSphere(-0.3, 0.6, -0.7, 0.05, 1.6, 0.05);
	let staffLight = new TransformationSGNode(glm.translate(-0.3, 1.5, -1),
		material(
			new AnimationSGNode(
				function (time) {
					const duration = 1350;

					let end1 = vec3.fromValues(4, 0, -12);
					let end2;
					// move light to trolls
					if (time / duration < 1) {
						let bez = vec3.bezier(
							vec3.create(),
							vec3.fromValues(0, 0, 0),
							vec3.fromValues(4, 0, -4),
							vec3.fromValues(-4, 0, -8),
							end1,
							Math.min(time / duration, 1)
						);
						return glm.translate(bez[0], bez[1], bez[2]);
					} else {
						let b, c;
						let bez = vec3.bezier(
							vec3.create(),
							end1,
							b = vec3.add(vec3.create(), end1, vec3.fromValues(0, 0, -8)),
							c = vec3.add(vec3.create(), b, vec3.fromValues(-8, 0, 0)),
							end2 = vec3.add(vec3.create(), c, vec3.fromValues(0, 0, 8)),
							Math.min((time - duration) / duration, 1)
						);
						// move light around trolls
						if (time / (duration * 2) < 1) {
							return glm.translate(bez[0], bez[1], bez[2]);
						} else {
							// move light back to wizard
							if (time / (duration * 3) < 1) {
								let b, c;
								let bez = vec3.bezier(
									vec3.create(),
									end2,
									vec3.fromValues(-4, 0, -8),
									vec3.fromValues(4, 0, -4),
									vec3.fromValues(0, 0, 0),
									Math.min((time - duration * 2) / duration, 1)
								);
								// let light fade out
								const scale = 1 - ((time - 2 * duration) / duration);
								return mat4.multiply(mat4.create(), glm.translate(bez[0], bez[1], bez[2]), glm.scale(scale, scale, scale));
							} else {
								// let light disappear
								return glm.translate(101, 101, 101);
							}
						}
					}
				},
				[
					createSphere(0, 0, 0, 0.24, 0.24, 0.24),
					scene.flyingLight()
				]
			),
			[0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1], 0, [1, 1, 1, 1]
		)
	);
	let cast = new AnimationSGNode(
		people.cast,
		[
			rightArm,
			new AnimationSGNode(
				people.circleStaff,
				staff
			)
		]
	);

	let leftFoot = createQuad(0.2, -1, 0, 0.1, 0.7, 0.1);
	let rightFoot = createQuad(-0.2, -1, 0, 0.1, 0.7, 0.1);

	return new SGNode(
		[
			body,
			head,
			leftArm,
			cast,
			leftFoot,
			rightFoot,
			staffLight // at the end, since it's a material
		]);
};

people.troll = function () {
	let body = createQuad(0, 0, 0, 0.5, 0.7, 0.5);
	let head = createSphere(0, 0.85, 0, 0.3, 0.3, 0.3, 12, 12);
	let leftArm = createQuad(0.55, 0.0, 0, 0.1, 0.5, 0.1);
	let rightArm = createQuad(-0.55, 0.0, 0, 0.1, 0.5, 0.1);
	let leftFoot = createQuad(0.2, -1, 0, 0.1, 0.7, 0.1);
	let rightFoot = createQuad(-0.2, -1, 0, 0.1, 0.7, 0.1);

	return new SGNode(
		[
			body,
			head,
			leftArm,
			rightArm,
			leftFoot,
			rightFoot
		]);
};

people.runningTroll = function () {
	let body = createQuad(0, 0, 0, 0.5, 0.7, 0.5);
	// that happens after coding for multiple hours straight
	let head = new TextureSGNode(res.steve, createSphere(0, 0.85, 0, 0.3, 0.6, 0.3, 12, 12));
	let leftArm = createQuad(0.55, 0.0, 0, 0.1, 0.5, 0.1);
	let rightArm = createQuad(-0.55, 0.0, 0, 0.1, 0.5, 0.1);
	let leftFoot = createQuad(0.2, -1, 0, 0.1, 0.7, 0.1);
	let rightFoot = createQuad(-0.2, -1, 0, 0.1, 0.7, 0.1);

	return new SGNode(
		[
			body,
			head,
			leftArm,
			rightArm,
			new AnimationSGNode(people.trollLeftFoot, leftFoot),
			new AnimationSGNode(people.trollRightFoot, rightFoot),
		]);
};

people.treasureHunter = function () {
	let body = createQuad(0, 0, 0, 0.2, 0.4, 0.2);
	let head = createSphere(0, 0.5, 0, 0.2, 0.2, 0.2, 12, 12);
	let leftArm = createQuad(0.23, 0.1, 0.3, 0.06, 0.06, 0.35);
	// align movement of arm with movement of chest opening
	leftArm = new AnimationSGNode(chest.angle, leftArm);

	// added joyful animation once chest is opened
	let rightArm = createQuad(-0.23, 0.1, 0.3, 0.06, 0.06, 0.35);
	rightArm = new AnimationSGNode(people.joyfulAnimation, rightArm);

	let leftUpperLeg = createQuad(0.2, -0.5, 0, 0.08, 0.2, 0.08);
	let rightUpperLeg = createQuad(-0.2, -0.5, 0, 0.08, 0.2, 0.08);
	let leftLowerLeg = createQuad(0.2, -0.7, -0.25, 0.08, 0.08, 0.3);
	let rightLowerLeg = createQuad(-0.2, -0.7, -0.25, 0.08, 0.08, 0.3);

	return new SGNode(
		[
			body,
			head,
			leftArm,
			rightArm,
			leftUpperLeg,
			rightUpperLeg,
			leftLowerLeg,
			rightLowerLeg
		]);
};

// animation functions returning a specific transformation amtrix depending on the time
// treasure hunter raising the right arm
people.joyfulAnimation = function (time) {
	let phi = 0;
	const delay = 1000;
	if (time > chest.duration) {
		if (time < chest.duration + delay) {
			phi = Math.sin((time - chest.duration) / delay) * 80;
		} else phi = 80;
	}
	return glm.rotateX(-phi);
};

// wizard waving staff back and forth
people.cast = function (time) {
	let phi = (Math.sin(time / 500) + 1) * 8;
	return glm.rotateX(-phi);
};

// wizard waving staff slightly sidewards
people.circleStaff = function (time) {
	let phi = (Math.sin(time / 500) + 1) * 4;
	return glm.rotateZ(-phi);
};

// troll running around the campfire
people.trollingTroll = function (time) {
	return glm.rotateY(time / 10);
};

// troll running around the campfire
people.trollLeftFoot = function (time) {
	let phi = Math.sin(time / 100) * 40;
	return glm.rotateX(phi);
};

// troll running around the campfire
people.trollRightFoot = function (time) {
	let phi = Math.sin(time / 100) * 40;
	return glm.rotateX(-phi);
};