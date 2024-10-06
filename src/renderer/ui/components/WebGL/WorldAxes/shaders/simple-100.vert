#version 100

attribute vec3 v_position;

uniform mat4 u_projection;
uniform mat4 u_modelView;

void main () {
	gl_Position = u_projection * u_modelView * vec4(v_position, 1);
}
