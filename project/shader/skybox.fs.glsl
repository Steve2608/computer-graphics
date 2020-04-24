precision mediump float;

uniform samplerCube u_texCube;

varying vec3 v_pos3D;

void main() {
	gl_FragColor = textureCube(u_texCube, v_pos3D);
}
