chest = {};

chest.duration = 3000;

chest.node = function (resources) {
	// wrapper for top and frame
	let together = new TextureSGNode(resources.chest);
	let top = new AnimationSGNode(chest.angle, chest.top());

	together.append(new TransformationSGNode(glm.translate(0, 1, 0), top));
	together.append(chest.frame());
	together.append(chest.gold());

	return material(new NoCullingSGNode([together]), [0.1, 0.1, 0.7, 1], [0.1, 0.1, 0.7, 1], [0.1, 0.1, 0.1, 1], 1.4);
};

// opening animation
chest.angle = function (time) {
	let phi = Math.sin(time / chest.duration) * 60;
	if (time > chest.duration) phi = Math.sin(1) * 60;
	return glm.rotateX(-phi);
};

chest.frame = function () {
	let pos = [];
	let norm = [];
	let texture = [];
	let index = [];

	function tex(x, y) {
		// flipping the image
		texture.push(x / 1023.0, (1023 - y) / 1023.0);
	}

	// front side
	// 0
	pos.push(0, 0, 1);
	norm.push(0, 0, 1);
	tex(44, 353 + 172);

	// 1
	pos.push(2, 0, 1);
	norm.push(0, 0, 1);
	tex(44 + 360, 353 + 172);

	// 2
	pos.push(2, 1, 1);
	norm.push(0, 0, 1);
	tex(44 + 360, 353);

	// 3
	pos.push(0, 1, 1);
	norm.push(0, 0, 1);
	tex(44, 353);

	index.push(0, 1, 2, 0, 2, 3);

	// back side

	// 4
	pos.push(0, 0, 0);
	norm.push(0, 0, -1);
	tex(44, 150 + 182);

	// 5
	pos.push(2, 0, 0);
	norm.push(0, 0, -1);
	tex(44 + 359, 150 + 182);

	// 6
	pos.push(2, 1, 0);
	norm.push(0, 0, -1);
	tex(44 + 359, 150);

	// 7
	pos.push(0, 1, 0);
	norm.push(0, 0, -1);
	tex(44, 150);

	index.push(4, 6, 5, 4, 7, 6);

	// left side
	// 8
	pos.push(0, 0, 0);
	norm.push(-1, 0, 0);
	tex(534, 549 + 172);

	// 9
	pos.push(0, 0, 1);
	norm.push(-1, 0, 0);
	tex(534 + 186, 549 + 172);

	// 10
	pos.push(0, 1, 1);
	norm.push(-1, 0, 0);
	tex(534 + 186, 549);

	// 11
	pos.push(0, 1, 0);
	norm.push(-1, 0, 0);
	tex(534, 549);

	index.push(8, 9, 10, 8, 10, 11);

	//right side
	// 12
	pos.push(2, 0, 0);
	norm.push(1, 0, 0);
	tex(534, 549 + 172);

	// 13
	pos.push(2, 0, 1);
	norm.push(1, 0, 0);
	tex(534 + 186, 549 + 172);

	// 14
	pos.push(2, 1, 1);
	norm.push(1, 0, 0);
	tex(534 + 186, 549);

	// 15
	pos.push(2, 1, 0);
	norm.push(1, 0, 0);
	tex(534, 549);

	index.push(12, 14, 13, 12, 15, 14);

	//bottom side

	// 16
	pos.push(0, 0, 0);
	norm.push(0, -1, 0);
	tex(44, 549 + 172);

	// 17
	pos.push(2, 0, 0);
	norm.push(0, -1, 0);
	tex(44 + 360, 549 + 172);

	// 18
	pos.push(2, 0, 1);
	norm.push(0, -1, 0);
	tex(44 + 360, 549);

	// 19
	pos.push(0, 0, 1);
	norm.push(0, -1, 0);
	tex(44, 549);

	index.push(16, 17, 18, 16, 18, 19);
	return new RenderSGNode(util.modelRenderer({position: pos, normal: norm, texture: texture, index: index}));
};

chest.top = function () {
	let pos = [];
	let norm = [];
	let texture = [];
	let index = [];

	function tex(x, y) {
		// flipping the image
		texture.push(x / 1023.0, (1023 - y) / 1023.0);
	}

	// 0;
	pos.push(0, 0.0, 0.0);
	norm.push(-1, 0, 0);
	tex(44, 127);
	// 1;
	pos.push(0, 0.10270075586613008, 0.010661104402556687);
	norm.push(-1, 0, 0);
	tex(44, 110);
	// 2;
	pos.push(0, 0.30737164934653616, 0.10563637442331214);
	norm.push(-1, 0, 0);
	tex(57, 74);
	// 3;
	pos.push(0, 0.409095848430333, 0.2125272416435498);
	norm.push(-1, 0, 0);
	tex(73, 53);
	// 4;
	pos.push(0, 0.4811547015535996, 0.3640214973870262);
	norm.push(-1, 0, 0);
	tex(99, 35);
	// 5;
	pos.push(0, 0.49846918890627573, 0.5390956226593158);
	norm.push(-1, 0, 0);
	tex(133, 25);
	// 6;
	pos.push(0, 0.4714951667914448, 0.6664100588675688);
	norm.push(-1, 0, 0);
	tex(161, 25);
	// 7;
	pos.push(0, 0.39791434706042955, 0.8027609162416312);
	norm.push(-1, 0, 0);
	tex(195, 35);
	// 8;
	pos.push(0, 0.3052539301696515, 0.8960050985984669);
	norm.push(-1, 0, 0);
	tex(221, 53);
	// 9;
	pos.push(0, 0.2138696944542476, 0.9519510524316176);
	norm.push(-1, 0, 0);
	tex(237, 74);
	// 10;
	pos.push(0, 0.06737972728210827, 0.9954391711919726);
	norm.push(-1, 0, 0);
	tex(250, 110);
	// 11;
	pos.push(0, 0.0, 1.0);
	norm.push(-1, 0, 0);
	tex(250, 127);
	// 12;
	pos.push(2, 0.0, 0.0);
	norm.push(1, 0, 0);
	tex(44, 127);
	// 13;
	pos.push(2, 0.10270075586613008, 0.010661104402556687);
	norm.push(1, 0, 0);
	tex(44, 110);
	// 14;
	pos.push(2, 0.30737164934653616, 0.10563637442331214);
	norm.push(1, 0, 0);
	tex(57, 74);
	// 15;
	pos.push(2, 0.409095848430333, 0.2125272416435498);
	norm.push(1, 0, 0);
	tex(73, 53);
	// 16;
	pos.push(2, 0.4811547015535996, 0.3640214973870262);
	norm.push(1, 0, 0);
	tex(99, 35);
	// 17;
	pos.push(2, 0.49846918890627573, 0.5390956226593158);
	norm.push(1, 0, 0);
	tex(133, 25);
	// 18;
	pos.push(2, 0.4714951667914448, 0.6664100588675688);
	norm.push(1, 0, 0);
	tex(161, 25);
	// 19;
	pos.push(2, 0.39791434706042955, 0.8027609162416312);
	norm.push(1, 0, 0);
	tex(195, 35);
	// 20;
	pos.push(2, 0.3052539301696515, 0.8960050985984669);
	norm.push(1, 0, 0);
	tex(221, 53);
	// 21;
	pos.push(2, 0.2138696944542476, 0.9519510524316176);
	norm.push(1, 0, 0);
	tex(237, 74);
	// 22;
	pos.push(2, 0.06737972728210827, 0.9954391711919726);
	norm.push(1, 0, 0);
	tex(250, 110);
	// 23;
	pos.push(2, 0.0, 1.0);
	norm.push(1, 0, 0);
	tex(250, 127);

	for (let i = 0; i <= 9; i++) {

		index.push(i, i + 1, 11);
	}
	for (let i = 12; i <= 12 + 9; i++) {

		index.push(i, i + 1, 23);
	}

	// 24;
	pos.push(0, 0.0, 0.0);
	norm.push(0, -1.0, -0.0);
	tex(536, 150.0);
	// 25;
	pos.push(2, 0.0, 0.0);
	norm.push(0, -1.0, -0.0);
	tex(895, 150.0);
	// 26;
	pos.push(0, 0.10270075586613008, 0.010661104402556687);
	norm.push(0, -0.9786777911948866, 0.20540151173226015);
	tex(536, 167.13173227437912);
	// 27;
	pos.push(2, 0.10270075586613008, 0.010661104402556687);
	norm.push(0, -0.9786777911948866, 0.20540151173226015);
	tex(895, 167.13173227437912);
	// 28;
	pos.push(0, 0.30737164934653616, 0.10563637442331214);
	norm.push(0, -0.7887272511533757, 0.6147432986930723);
	tex(536, 205.70364450108187);
	// 29;
	pos.push(2, 0.30737164934653616, 0.10563637442331214);
	norm.push(0, -0.7887272511533757, 0.6147432986930723);
	tex(895, 205.70364450108187);
	// 30;
	pos.push(0, 0.409095848430333, 0.2125272416435498);
	norm.push(0, -0.5749455167129004, 0.818191696860666);
	tex(536, 232.30898040946147);
	// 31;
	pos.push(2, 0.409095848430333, 0.2125272416435498);
	norm.push(0, -0.5749455167129004, 0.818191696860666);
	tex(895, 232.30898040946147);
	// 32;
	pos.push(0, 0.4811547015535996, 0.3640214973870262);
	norm.push(0, -0.27195700522594757, 0.9623094031071991);
	tex(536, 264.17680055725833);
	// 33;
	pos.push(2, 0.4811547015535996, 0.3640214973870262);
	norm.push(0, -0.27195700522594757, 0.9623094031071991);
	tex(895, 264.17680055725833);
	// 34;
	pos.push(0, 0.49846918890627573, 0.5390956226593158);
	norm.push(0, 0.07819124531863149, 0.9969383778125515);
	tex(536, 299.8915145975701);
	// 35;
	pos.push(2, 0.49846918890627573, 0.5390956226593158);
	norm.push(0, 0.07819124531863149, 0.9969383778125515);
	tex(895, 299.8915145975701);
	// 36;
	pos.push(0, 0.4714951667914448, 0.6664100588675688);
	norm.push(0, 0.33282011773513753, 0.9429903335828896);
	tex(536, 328.10848540242984);
	// 37;
	pos.push(2, 0.4714951667914448, 0.6664100588675688);
	norm.push(0, 0.33282011773513753, 0.9429903335828896);
	tex(895, 328.10848540242984);
	// 38;
	pos.push(0, 0.39791434706042955, 0.8027609162416312);
	norm.push(0, 0.6055218324832624, 0.7958286941208591);
	tex(536, 363.8231994427416);
	// 39;
	pos.push(2, 0.39791434706042955, 0.8027609162416312);
	norm.push(0, 0.6055218324832624, 0.7958286941208591);
	tex(895, 363.8231994427416);
	// 40;
	pos.push(0, 0.3052539301696515, 0.8960050985984669);
	norm.push(0, 0.7920101971969338, 0.610507860339303);
	tex(536, 395.69101959053853);
	// 41;
	pos.push(2, 0.3052539301696515, 0.8960050985984669);
	norm.push(0, 0.7920101971969338, 0.610507860339303);
	tex(895, 395.69101959053853);
	// 42;
	pos.push(0, 0.2138696944542476, 0.9519510524316176);
	norm.push(0, 0.9039021048632352, 0.4277393889084952);
	tex(536, 422.2963554989181);
	// 43;
	pos.push(2, 0.2138696944542476, 0.9519510524316176);
	norm.push(0, 0.9039021048632352, 0.4277393889084952);
	tex(895, 422.2963554989181);
	// 44;
	pos.push(0, 0.06737972728210827, 0.9954391711919726);
	norm.push(0, 0.9908783423839451, 0.13475945456421654);
	tex(536, 460.8682677256209);
	// 45;
	pos.push(2, 0.06737972728210827, 0.9954391711919726);
	norm.push(0, 0.9908783423839451, 0.13475945456421654);
	tex(895, 460.8682677256209);
	// 46;
	pos.push(0, 0.0, 1.0);
	norm.push(0, 1.0, -0.0);
	tex(536, 478.0);
	// 47;
	pos.push(2, 0.0, 1.0);
	norm.push(0, 1.0, -0.0);
	tex(895, 478.0);

	index.push(24, 27, 25, 24, 26, 27);
	index.push(26, 29, 27, 26, 28, 29);
	index.push(28, 31, 29, 28, 30, 31);
	index.push(30, 33, 31, 30, 32, 33);
	index.push(32, 35, 33, 32, 34, 35);
	index.push(34, 37, 35, 34, 36, 37);
	index.push(36, 39, 37, 36, 38, 39);
	index.push(38, 41, 39, 38, 40, 41);
	index.push(40, 43, 41, 40, 42, 43);
	index.push(42, 45, 43, 42, 44, 45);
	index.push(44, 47, 45, 44, 46, 47);
	return new RenderSGNode(util.modelRenderer({position: pos, normal: norm, texture: texture, index: index}));
};

// gold inside the chest
// values from C3PO used
chest.gold = function () {
	let gold = material(createQuad(1, 0.5, 0.5, 0.99, 0.20, 0.49),
		[0.247, 0.199, 0.074, 1],
		[0.651, 0.406, 0.126, 1],
		[0.628, 0.555, 0.366, 1], 0.4,
		[0.441, 0.198, 0.1, 1]);

	gold.append(createQuad(0.25, 0.5, 0.5, 0.2, 0.5, 0.3));
	gold.append(createQuad(1.6, 0.5, 0.5, 0.3, 0.3, 0.3));
	gold.append(createQuad(1.2, 0.6, 0.5, 0.6, 0.5, 0.1));
	return gold;
};