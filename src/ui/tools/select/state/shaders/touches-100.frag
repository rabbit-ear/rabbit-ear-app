#version 100

precision mediump float;

uniform mat4 u_projection;
uniform mat4 u_modelview;
uniform vec2 u_resolution;
uniform vec4 u_touchBounds;

// visualize the 3D touch in world coordinates
// by converting back into screen coordinates.
// M = (0.5 scale) * (1,1,0 translate) * (-1 scale)
// where inputs (point, canvas) are scaled using window.devicePixelRatio
// mat4 M = mat4(-0.5,0,0,0,0,-0.5,0,0,0,0,-0.5,0,0.5,0.5,0,1);
// where inputs (point, canvas) are NOT scaled using window.devicePixelRatio
mat4 M = mat4(-1,0,0,0,0,-1,0,0,0,0,-1,0,1,1,0,1);

float LINE_WIDTH = 2.0;

float sdBox(in vec2 p, in vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

void main () {
  vec2 startPoint = (u_projection * vec4(u_touchBounds.xy, 0, 1)).xy;
  vec2 endPoint = (u_projection * vec4(u_touchBounds.zw, 0, 1)).xy;
  vec2 startPointNormalized = (M * vec4(startPoint, 0, 1)).xy;
	vec2 endPointNormalized = (M * vec4(endPoint, 0, 1)).xy;
	vec2 start = startPointNormalized * u_resolution;
	vec2 end = endPointNormalized * u_resolution;
  vec2 minpt = vec2(min(start.x, end.x), min(start.y, end.y));
  vec2 maxpt = vec2(max(start.x, end.x), max(start.y, end.y));

  float cx = (minpt.x + maxpt.x) * 0.5;
  float cy = (minpt.y + maxpt.y) * 0.5;
  float rx = (maxpt.x - minpt.x) * 0.5;
  float ry = (maxpt.y - minpt.y) * 0.5;
  vec2 center = vec2(cx, cy);
  vec2 box = vec2(rx, ry);
  float d = sdBox(gl_FragCoord.xy - center, box);
	float alpha = 1.0 - step(LINE_WIDTH, abs(d));

  gl_FragColor = vec4(vec3(1.0), alpha);
}

