precision mediump float;

uniform sampler2D texture;

varying vec2 texCoords;
varying float age;

void main() {
   // if(age < 0.0) discard;
	vec4 texColor = texture2D(texture, texCoords);
	texColor.a *= max(0.0, min(1.0, 2.0 - 10.0 * age));

	gl_FragColor = texColor;
}
