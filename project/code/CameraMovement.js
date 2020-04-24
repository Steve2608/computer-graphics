class CameraMovement {

	constructor() {
		this.nodes = [];
		this.restart(0);
		this.index = 0;
	}

	restart(currentTime) {
		this.startTime = currentTime;
	}

	addNode(x, y, z, ex, ey, ez, timeSeconds, message) {
		// store it in the queue
		this.nodes.push({
			cam: vec3.fromValues(x, y, z),
			target: vec3.fromValues(ex, ey, ez),
			time: timeSeconds * 1000,
			text: message
		});
	}

	getPosAndTarget(context) {
		const animationTime = context.time - this.startTime;

		// Current node is done, go to next node
		if (this.nodes[this.index].time < animationTime) this.index++;
		displayText(this.nodes[this.index].text);

		// handle case that the animation time is over
		// assuming that nodes are ordered correctly
		if (this.index >= this.nodes.length - 1) {
			return {cam: camera.initalPos, target: camera.initalRot};
		}

		let nodeA = this.nodes[this.index - 1];
		let nodeB = this.nodes[this.index];
		let interpolationPoint = (animationTime - nodeA.time) / (nodeB.time - nodeA.time);

		let pos = vec3.lerp(vec3.create(), nodeA.cam, nodeB.cam, interpolationPoint);
		let target = vec3.lerp(vec3.create(), nodeA.target, nodeB.target, interpolationPoint);
		return {cam: pos, target: target};
	}
}