let gl = null;
// scene graph node
let root = null;
// resources
let res;

let shaders = {};
let fire;

let no_texture;
let cameraAnimation;

let allLightsReference = [];

loadResources({
	// different shaders used in the movie
	vs_phong: 'shader/phong.vs.glsl',
	fs_phong: 'shader/phong.fs.glsl',

	skybox_vs: 'shader/skybox.vs.glsl',
	skybox_fs: 'shader/skybox.fs.glsl',

	particle_vs: 'shader/particle.vs.glsl',
	particle_fs: 'shader/particle.fs.glsl',

	// all six sides of the skybox, each one could be exchanged
	// in our case, we used six times the same image
	up: 'textures/skybox.png',
	down: 'textures/skybox.png',
	left: 'textures/skybox.png',
	right: 'textures/skybox.png',
	back: 'textures/skybox.png',
	front: 'textures/skybox.png',

	// fire texture used for particle system, trasmparent
	fire: 'textures/fire.png',

	// other random images for the movie
	forest_floor: 'textures/forest_floor.jpg',
	steve: 'textures/steve.jpg',
	moon: 'textures/moon.png',
	chest: 'textures/chest.jpg',

	// tree object models
	tree_stem: '../models/tree/tree_stem.obj',
	tree_top: '../models/tree/tree_top.obj',

	// texture for "no texture is currently loaded"
	no_texture: 'textures/no_texture.png'
}).then(function (resources) {
	init(resources);
	requestAnimationFrame(render);
});

function init(resources) {
	res = resources;
	const width = 1300, height = 800;

	gl = createContext(width, height);
	no_texture = util.createGlTexture(resources.no_texture);

	setupCameraAnimation();

	loadShaders(gl, resources);
	root = createSceneGraph(gl, resources);

	camera.registerInteraction();
}

function loadShaders(gl, resources) {
	shaders.phong = createProgram(gl, resources.vs_phong, resources.fs_phong);
	shaders.skybox = createProgram(gl, resources.skybox_vs, resources.skybox_fs);
	shaders.particle = createProgram(gl, resources.particle_vs, resources.particle_fs);
}

// wrapper to create material Nodes
// defined in main to have reference on all light nodes array
function material(children, ambient, diffuse, specular, shininess, emission) {
	let material = new MaterialSGNode(children);

	if (ambient) material.ambient = ambient;
	if (diffuse) material.diffuse = diffuse;
	if (specular) material.specular = specular;
	if (shininess) material.shininess = shininess;
	if (emission) material.emission = emission;

	material.lights = allLightsReference;
	return material;
}

function createSceneGraph(gl, resources) {
	let terrainMat = material(terrain.createTerrain(resources));
	fire = new ParticleSystem(util.createGlTexture(resources.fire), 10, 1, 100);

	let baseScene = new ShaderSGNode(shaders.phong, [terrainMat, scene.build(resources)]);

	// load a texture for each side of the skybox
	const cubeImages = {
		right: resources.right,
		left: resources.left,
		up: resources.up,
		down: resources.down,
		back: resources.back,
		front: resources.front
	};

	// load all lights into an shared array, so each material can access the properties of each light
	for (let light in lights) {
		if (lights.hasOwnProperty(light)) {
			allLightsReference.push(lights[light]);
		}
	}

	return new SkyboxSGNode(cubeImages, baseScene);
}

function render(time) {
	checkForWindowResize(gl);

	fire.update();
	camera.update();

	gl.clearColor(0.9, 0.9, 0.9, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	const context = createSGContext(gl);
	context.time = time * animationSpeed;

	if (camera.locked) {
		let c = cameraAnimation.getPosAndTarget(context);
		// TODO also apply pitch and yaw
		camera.position = c.cam;
		context.viewMatrix = mat4.lookAt(mat4.create(), c.cam, c.target, vec3.fromValues(0, 1, 0));
	} else {
		context.viewMatrix = camera.view;
	}
	context.campos = camera.position;

	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);

	root.render(context);

	// next Frame
	requestAnimationFrame(render);
}
