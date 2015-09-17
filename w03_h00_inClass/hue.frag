#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) - 
          smoothstep( pct, pct+0.02, st.y);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
	vec3 color = vec3(0.);

	// float y = st.x;
	float y = st.x;

	vec3 pct = vec3(st.x);

	// pct.r = pow(pct.r, 0.2);
	// pct.g = sin(pct.g);
	// pct.b = pow(pct.b, 2.);

	vec3 A = vec3(1., 0., 0.);
	vec3 B = vec3(0., 0., 1.);

	color = mix(A, B, y);

	// color.r += plot(st,pct.r);
	// color.g += plot(st,pct.g);
	// color.b += plot(st,pct.b);

	gl_FragColor = vec4(color,1.0);
}