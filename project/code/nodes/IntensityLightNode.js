// Wrapper for LightSGNode
// Light fades out in the distance because of attenuation
class IntensityLightNode extends LightSGNode {
	constructor(position, attenuation, children) {
		super(position, children);

		this.attenuation = attenuation;
	}

	// override this method to set the attenuation component
	setLightUniforms(context) {
		super.setLightUniforms(context);
		gl.uniform1f(gl.getUniformLocation(context.shader, this.uniform + '.attenuation'), this.attenuation);
	}
}