uniform mat4 u_modelView;
uniform mat4 u_projection;

attribute vec3 a_position;

varying vec3 v_pos3D;

void main() {
    // One could calculate this once in render()
	mat4 m = u_modelView;

	// set homogenous coordinates
	m[3][0] = 0.0;
	m[3][1] = 0.0;
	m[3][2] = 0.0;
	m[3][3] = 1.0;
	v_pos3D = a_position;
	gl_Position = u_projection * (m * vec4(a_position, 1));
}
