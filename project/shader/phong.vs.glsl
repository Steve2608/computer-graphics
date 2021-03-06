attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_texCoord;

uniform mat4 u_modelView;
uniform mat3 u_normalMatrix;
uniform mat4 u_projection;

uniform vec3 u_lightPos;
uniform vec3 u_light2Pos;
uniform vec3 u_spotLightPos;

//output of this shader
varying vec3 v_normalVec;
varying vec3 v_eyeVec;
varying vec3 v_lightVec;
varying vec3 v_lightVec2;
varying vec3 v_spotLightVec;

varying vec2 v_texCoord;

void main() {
    vec4 eyePosition = u_modelView * vec4(a_position, 1.0);

    v_normalVec = u_normalMatrix * a_normal;

    v_eyeVec = -eyePosition.xyz;
    v_lightVec = u_lightPos - eyePosition.xyz;
    v_lightVec2 = u_light2Pos - eyePosition.xyz;
    v_spotLightVec = u_spotLightPos - eyePosition.xyz;

    v_texCoord = a_texCoord;

    gl_Position = u_projection * eyePosition;
}
