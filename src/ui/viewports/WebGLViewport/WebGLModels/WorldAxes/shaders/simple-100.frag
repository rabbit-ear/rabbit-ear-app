#version 100
precision mediump float;

uniform float u_origin;

varying vec3 color;

void main () {
	gl_FragColor = vec4(color, 1.0);
}
