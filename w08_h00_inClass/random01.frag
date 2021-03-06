#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// 1D random
float random (float x) {
    return fract(sin(x)*10e5);
}

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st *= 10.;
    vec2 st_i = floor(st);
    float time = floor(u_time);
    float pct = random(st_i.x + time);
	gl_FragColor = vec4(vec3(pct),1.0);
}