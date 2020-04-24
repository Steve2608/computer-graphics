let scene = {};
scene.root = null;
lights = {};

scene.build = function (resources) {
	scene.root = new SGNode();

	// move chest to correct position
	let chestNode = translate(10, 0.1, 5.8,
		new AnimationTriggerSGNode(6,
			[
				rotateY(90,
					new TransformationSGNode(
						glm.scale(0.5, 0.5, 0.5),
						chest.node(resources)
					)
				),
				// treasure hunter
				translate(1, 0.5, -0.5,
					rotateY(-90,
						new TransformationSGNode(
							glm.scale(0.8, 0.8, 0.8),
							material(
								people.treasureHunter(),
								[0.5, 0.8, 1, 1],
								[0.5, 0.8, 1, 1],
								[0.1, 0.7, 0.7, 1],
								1,
								0
							)
						)
					)
				)
			]
		)
	);
	scene.root.append(chestNode);

	scene.buildForest(scene.root);

	lights.mageLight = scene.mageLight();
	let wizard = translate(
		20, 1, 20,
		new AnimationTriggerSGNode(
			6,
			new TransformationSGNode(
				glm.scale(0.5, 0.5, 0.5),
				rotateY(90,
					material(
						people.wizard(),
						[1, 1, 1, 1],
						[1, 1, 1, 1],
						[0.7, 0.7, 0.7, 1],
						1,
						0
					)
				)
			)
		)
	);
	wizard.append(
		translate(-1.5, 3, 0,
			[
				material(
					createSphere(0, 0, 0, 0.3, 0.3, 0.3),
					[0, 0, 0, 1],
					[0, 0, 1, 1],
					[0, 0, 1, 1],
					1,
					[0, 0, 1, 1]
				),
				lights.mageLight
			]
		)
	);

	let troll1 = translate(10, 1, 18,
		new TransformationSGNode(
			glm.scale(0.65, 0.65, 0.65),
			material(
				people.troll(),
				[1, 1, 1, 1],
				[1, 1, 1, 1],
				[0.5, 0.1, 0.1, 1],
				1,
				0
			)
		)
	);

	let troll2 = translate(10, 1, 22,
		new TransformationSGNode(
			glm.scale(0.65, 0.65, 0.65),
			rotateY(180,
				material(
					people.troll(),
					[1, 1, 1, 1],
					[1, 1, 1, 1],
					[0.5, 0.1, 0.1, 1],
					1,
					0
				)
			)
		)
	);

	scene.root.append(wizard);
	scene.root.append(troll1);
	scene.root.append(troll2);

	const moonDistance = 3;
	const moon = translate(11 + moonDistance * 4, 3 + moonDistance * 4, 1 + moonDistance * 5, scene.moon());

	scene.root.append(
		new TransformationSGNode(glm.translate(10, 0, 20), [scene.fire(), scene.grill(), moon]));

	return scene.root;
};

scene.grill = function () {
	let grill = new SGNode();

	// feet
	grill.append(rotateX(10, createQuad(0.5, 0, -0.1, 0.02, 0.5, 0.02)));
	grill.append(rotateX(-10, createQuad(0.5, 0, 0.1, 0.02, 0.5, 0.02)));

	grill.append(rotateX(10, createQuad(-0.5, 0, -0.1, 0.02, 0.5, 0.02)));
	grill.append(rotateX(-10, createQuad(-0.5, 0, 0.1, 0.02, 0.5, 0.02)));

	// stick rotation
	let stick = new AnimationSGNode(function (t) {
		return glm.rotateX(t / 10)
	});
	// stick itself
	stick.append(createQuad(0, 0, 0, 0.6, 0.01, 0.01));
	// meat
	stick.append(createQuad(0, 0, 0, 0.3, 0.1, 0.1));

	grill.append(translate(0, 0.5, 0, stick));
	return grill;
};

scene.fire = function () {
	// at y = 0.5 to prevent z-Fighting
	lights.fire = new IntensityLightNode([0, 0.5, 0], 0.1);
	lights.fire.ambient = [0.3, 0.3, 0.3, 1];
	lights.fire.diffuse = rgb(186, 124, 31);
	lights.fire.specular = rgb(186, 124, 31);
	lights.fire.uniform = 'u_light2';

	let campfire = new SGNode();
	// ring of stones for campfire
	for (let i = 0; i < 12; i++) {
		campfire.append(material(
			rotateY(i * 30,
				translate(0.3, 0, 0,
					createSphere(0, 0, 0, 0.08, 0.08, 0.08)
				)
			), [0.5, 0.5, 0.5, 1], [0.5, 0.5, 0.5, 1], [0, 0, 0, 1], 1, 0
		));
	}

	// pieces of wood for campfire
	for (let i = 0; i < 4; i++) {
		campfire.append(material(
			rotateY(i * 90,
				translate(0.2, 0, 0,
					rotateZ(60,
						createQuad(0, 0, 0, 0.02, 0.4, 0.02)
					)
				)
			), [0.4, 0.25, 0.15, 1], [0.4, 0.25, 0.15, 1], [0, 0, 0, 1], 1, 0
		));
	}

	// troll running around the campfire
	let troll3 = new AnimationTriggerSGNode(10,
		new AnimationSGNode(
			people.trollingTroll,
			translate(0, 1, 3,
				rotateY(90,
					new TransformationSGNode(
						glm.scale(0.6, 0.6, 0.6),
						material(
							people.runningTroll(),
							[1, 1, 1, 1],
							[1, 1, 1, 1],
							[0.5, 0.1, 0.1, 1],
							1,
							0
						)
					)
				)
			)
		)
	);

	campfire.append(lights.fire);
	campfire.append(troll3);
	campfire.append(fire);

	return campfire;
};

scene.tree = function (x = 0, z = 0) {
	if (x < 0 || x > terrainWidth * 0.6 || z < 0 || z > terrainHeight * 0.6) return null;
	let stem = new RenderSGNode(util.modelRenderer(res.tree_stem));
	let leaves = new RenderSGNode(util.modelRenderer(res.tree_top));

	let stemMat = material(stem, rgb(124, 85, 52), rgb(124, 85, 52), rgb(124, 85, 52), 0.4);

	let leavesMat = material(leaves, rgb(21, 153, 21), rgb(21, 153, 21), rgb(21, 153, 21), 0.4);

	const height = heightData[Math.min(terrainWidth - 1, Math.round(x / 0.6))][Math.min(terrainHeight - 1, Math.round(z / 0.6))];
	const heightTransformation = glm.translate(x, height - 0.1, z);
	return new TransformationSGNode(heightTransformation, [stemMat, leavesMat]);
};

scene.addTree = function (x, z) {
	const tree = scene.tree(x, z);
	// null if not placeable on height map
	if (tree != null) scene.root.append(tree)
};

scene.buildForest = function (root) {
	// left close
	root.append(scene.tree(1, 0));
	root.append(scene.tree(3, 4));
	root.append(scene.tree(4.7, 2));
	root.append(scene.tree(9, 1));
	root.append(scene.tree(12, 0));
	root.append(scene.tree(17, 0.7));
	root.append(scene.tree(18, 2));
	root.append(scene.tree(24, 1.5));
	root.append(scene.tree(27, 0));
	root.append(scene.tree(28, 4));
	root.append(scene.tree(29, 3));
	root.append(scene.tree(4, 4));
	root.append(scene.tree(7, 3));
	root.append(scene.tree(2.7, 7));
	root.append(scene.tree(3, 2));
	root.append(scene.tree(15, 8));
	root.append(scene.tree(19, 1));
	root.append(scene.tree(21, 8));
	root.append(scene.tree(13, 2));
	root.append(scene.tree(4, 3.4));
	root.append(scene.tree(19, 3));

	// right close
	root.append(scene.tree(0, 1));
	root.append(scene.tree(3, 3));
	root.append(scene.tree(2, 6));
	root.append(scene.tree(1, 9));
	root.append(scene.tree(2, 12));
	root.append(scene.tree(2, 18));
	root.append(scene.tree(2.5, 21));
	root.append(scene.tree(0, 27));
	root.append(scene.tree(4, 22));
	root.append(scene.tree(7, 29));
	root.append(scene.tree(4, 4));
	root.append(scene.tree(3, 7));
	root.append(scene.tree(1, 5));
	root.append(scene.tree(2, 3));
	root.append(scene.tree(3, 9));
	root.append(scene.tree(1, 19));
	root.append(scene.tree(8, 12));
	root.append(scene.tree(2, 13));
	root.append(scene.tree(3.4, 4));
	root.append(scene.tree(3, 19));

	// left far
	root.append(scene.tree(26, 1));
	root.append(scene.tree(27, 3));
	root.append(scene.tree(24, 6));
	root.append(scene.tree(29, 9));
	root.append(scene.tree(29, 12));
	root.append(scene.tree(24, 16));
	root.append(scene.tree(24, 18));
	root.append(scene.tree(27, 27));
	root.append(scene.tree(28, 22));
	root.append(scene.tree(26, 29));
	root.append(scene.tree(26, 4));
	root.append(scene.tree(28, 7));
	root.append(scene.tree(27, 5));
	root.append(scene.tree(23, 3));
	root.append(scene.tree(28, 19));
	root.append(scene.tree(25, 12));
	root.append(scene.tree(25, 13));
	root.append(scene.tree(27, 4));

	// right far
	root.append(scene.tree(1, 28));
	root.append(scene.tree(3, 27));
	root.append(scene.tree(9, 29));
	root.append(scene.tree(12, 26));
	root.append(scene.tree(14, 24));
	root.append(scene.tree(18, 24));
	root.append(scene.tree(27, 28));
	root.append(scene.tree(29, 26));
	root.append(scene.tree(4, 26));
	root.append(scene.tree(7, 28));
	root.append(scene.tree(11, 27));
	root.append(scene.tree(3, 23));
	root.append(scene.tree(16, 28));
	root.append(scene.tree(12, 26));
	root.append(scene.tree(4, 27));
	root.append(scene.tree(29, 23));
	root.append(scene.tree(19, 25));

	// far corner
	root.append(scene.tree(25, 25));
	root.append(scene.tree(24, 29));
	root.append(scene.tree(28, 29));
	root.append(scene.tree(27, 24));

	// buldge
	root.append(scene.tree(15, 12));
	root.append(scene.tree(12, 12));
	root.append(scene.tree(9, 7));
	root.append(scene.tree(17, 11));
	root.append(scene.tree(11, 8));
	root.append(scene.tree(10, 10));
};

// blue spotlight hovering above the wizard
scene.mageLight = function () {
	let spotLight = new SpotLightSGNode();
	spotLight.ambient = [0.0, 0.0, 0.0, 1];
	spotLight.diffuse = rgb(48, 152, 204);
	spotLight.specular = rgb(48, 152, 204);
	spotLight.position = [0, 0, 0];
	spotLight.uniform = "u_spotLight";
	spotLight.direction = [1.5, -3, 0, 1];

	lights.spot = spotLight;

	return spotLight;
};

// wizards projectile
scene.flyingLight = function () {
	let light = new IntensityLightNode([0, 0, 0], 0.2);
	light.ambient = [0.1, 0.1, 0.2, 1];
	light.diffuse = rgb(0, 152, 204);
	light.specular = rgb(0, 152, 204);
	lights.moving = light;
	return light;
};

scene.moon = function () {
	let moon = new RenderSGNode(util.modelRenderer(makeRect(1, 1)));
	moon = material(moon, [1, 1, 1, 1], [1, 1, 1, 1], [0, 0, 0, 0], 0, [0, 0, 0, 0]);
	moon = new TextureSGNode(res.moon, moon);
	moon = new BillboardSGNode(new BlendingSGNode(moon));
	return moon;
};

// helper function to create material color arrays from rgb256-colors
function rgb(r, g, b) {
	return [r / 255, g / 255, b / 255, 1];
}

// wrapper functions
function translate(x, y, z, children) {
	return new TransformationSGNode(glm.translate(x, y, z), children);
}

function rotateX(degree, children) {
	return new TransformationSGNode(glm.rotateX(degree), children);
}

function rotateY(degree, children) {
	return new TransformationSGNode(glm.rotateY(degree), children);
}

function rotateZ(degree, children) {
	return new TransformationSGNode(glm.rotateZ(degree), children);
}