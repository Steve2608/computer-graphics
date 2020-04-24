const animationSpeed = 1;

function setupCameraAnimation() {
	cameraAnimation = new CameraMovement();
	let c = cameraAnimation;

	// start
	c.addNode(
		0, 5, 0,
		5, 0, 5,
		0,
		"phong shading; skybox"
	);
	// looking to left
	c.addNode(
		4, 5, 8,
		2, 3, 20,
		3,
		"phong shading; heightmap (texture mapping)"
	);
	// looking towards trolls
	c.addNode(
		8, 10, 20,
		12, 0, 20,
		6,
		"particle system; alpha blending; billboarding; animations; triggerpoint (troll)"
	);

	// moving around trolls
	c.addNode(
		8, 10, 26,
		20, 0, 18,
		9,
		"particle system; alpha blending; billboarding; animations; triggerpoint (troll)"
	);
	// moving around trolls
	c.addNode(
		15, 10, 30,
		20, 0, 20,
		12,
		"spotlight; normal (not yet moving) light; triggerpoint (wizard)"
	);

	// behind wizard
	c.addNode(
		23, 4, 23,
		10, 0, 17,
		13.5,
		"spotlight; moving light; triggerpoint (wizard)"
	);

	// fading further back
	c.addNode(
		23, 5, 20,
		10, 0, 20,
		15.5,
		"spotlight; moving light; triggerpoint (wizard)"
	);

	// fading further further back
	c.addNode(
		23, 5, 17,
		10, 0, 20,
		18.5,
		"materials: tree, both wizard lights, gold in chest (yet to come)"
	);

	// towards treasure guy
	c.addNode(
		16.5, 6, 10,
		10, 0, 5,
		21,
		"custom complex object; texture; animation; triggerpoint (chest)"
	);

	// circeling around him
	c.addNode(
		11, 3, 1,
		10, 0, 5,
		24,
		"custom complex object; texture; animation; triggerpoint (chest)"
	);

	// stopping
	c.addNode(
		11, 3, 1,
		12, 1, 5,
		28,
		"custom complex object; texture; animation; triggerpoint (chest)"
	);

	// fading out to moon
	c.addNode(
		11, 3, 1,
		15, 6, 6,
		30,
		"skybox; billboard (moon)"
	);

	// last node
	c.addNode(
		11, 3, 1,
		15, 6, 6,
		1000000, // just stop
		"animated flight over, just stop after 30s"
	);
	c.addNode(
		11, 3, 1,
		15, 6, 6,
		1000000, // just stop
		"animated flight over, just stop after 30s"
	);

	camera.locked = true; // lock camera on start of animation
}