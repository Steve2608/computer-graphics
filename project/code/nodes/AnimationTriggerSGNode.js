class AnimationTriggerSGNode extends SGNode {
	constructor(radius, children) {
		super(children);
		this.startTime = 0;
		this.triggered = false;

		//square radius to be able to compare it later faster and avoid slow square root
		this.radiusSquared = radius * radius;
	}

	render(context) {
		//get distance from object to camera and compare it to stored radius
		let objpos = vec3.transformMat4(vec3.create(), vec3.fromValues(0, 0, 0), context.sceneMatrix);

		// only calculate squared distance if needed
		if (!this.triggered && vec3.squaredDistance(context.campos, objpos) < this.radiusSquared) {
			// start animation once
			this.triggered = true;
			this.startTime = context.time;
		}

		//store current time
		const prevTime = context.time;

		//depending on if the point is triggered, set the time to 0 or relative to the start time
		context.time = this.triggered ? context.time - this.startTime : 0;

		//render children with new "relative" time
		super.render(context);

		//restore old time
		context.time = prevTime;
	}
}