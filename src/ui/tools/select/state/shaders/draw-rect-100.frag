#version 100

precision mediump float;

uniform mat4 u_projection;
uniform mat4 u_modelview;
uniform vec2 u_resolution;
uniform vec4 u_touchBounds;
uniform float u_time;

float LINE_WIDTH = 1.0;
float DASH_LENGTH = 0.03;
float DASH_SPEED = 0.0001;

// visualize the 3D touch in world coordinates
// by converting back into screen coordinates.
// M = (0.5 scale) * (1,1,0 translate) * (-1 scale)
// where inputs (point, canvas) are scaled using window.devicePixelRatio
// mat4 M = mat4(-0.5,0,0,0,0,-0.5,0,0,0,0,-0.5,0,0.5,0.5,0,1);
// where inputs (point, canvas) are NOT scaled using window.devicePixelRatio
mat4 M = mat4(-1,0,0,0,0,-1,0,0,0,0,-1,0,1,1,0,1);

float sdBox(in vec2 p, in vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

vec2 transformPoint(in vec2 inPoint) {
  vec2 projectedPoint = (u_projection * vec4(inPoint, 0, 1)).xy;
  vec2 normalized = (M * vec4(projectedPoint, 0, 1)).xy;
	return normalized * u_resolution;
}

void main () {
  if (u_touchBounds.x == u_touchBounds.z && u_touchBounds.y == u_touchBounds.w) {
    discard;
  }

  vec2 start = transformPoint(u_touchBounds.xy);
  vec2 end = transformPoint(u_touchBounds.zw);
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
  // no dash:
  // gl_FragColor = vec4(vec3(1.0), alpha);

  // float dashPos = mod(perimeterCoord + time * speed, dashLength * 2.0);

  // dash:
  float ratio = (gl_FragCoord.y - center.y) / (gl_FragCoord.x - center.x);
  float tangent = atan(ratio) - u_time * DASH_SPEED;
  float dashPos = mod(tangent, DASH_LENGTH * 2.0);
  float dashMask = step(dashPos, DASH_LENGTH);
  float finalMask = alpha * dashMask;

  gl_FragColor = vec4(vec3(1.0), finalMask * 0.5);
}

