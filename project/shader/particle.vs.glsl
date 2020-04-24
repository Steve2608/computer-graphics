uniform mat4 u_modelView;
uniform mat4 u_projection;

uniform float systemAge;

attribute vec2 position;
attribute float createTime;
attribute vec3 direction;

varying float age;
varying vec2 texCoords;
void main() {
    age = systemAge - createTime;

    vec4 eyePos =
        (u_modelView * vec4(direction * age * 30.0, 1.0))
        + vec4(position.x * age * 5.0, position.y * age * 5.0, 0.0, 0.0);

    gl_Position = u_projection * eyePos;
    texCoords = position + vec2(0.5, 0.5);
}
