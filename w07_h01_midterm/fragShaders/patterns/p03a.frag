// Author _ Hang Do Thi Duc ( 22-8miles.com )

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 truchet(vec2 st){
    vec2 st_i = floor(st);
    if (mod(st_i.y,2.) == 1.) {
        st.x = 1.-st.x ;
    }
    if (mod(st_i.x,2.) == 1.) {
        st.y = 1.-st.y + abs(sin(u_time*.5));
    }
    if (mod(st_i.x,2.) == 0.) {
        st.y += sin(u_time*.5 + 0.5);
    }
    return st;
}

// Reference to
// http://thndl.com/square-shaped-shaders.html
float pattern(vec2 st){
    float d = 0.0;
    // st *= 5.;
    st = truchet(st*4.);
    vec2 st_f = fract(st);
    st_f = st_f * 2.-1.;
    st_f.y += 0.25;
    float a = atan(st_f.x,st_f.y)+PI;
    float r = TWO_PI/3.;
    // Shaping function that modulate the distance
    d = cos(floor(.5+a/r)*r-a)*length(st_f);
    float t = 0.25 + 0.05 * abs(sin(u_time));
    return 1.-(1.-smoothstep(t,t,d) + smoothstep(.4,.4,d));
}


void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;

  gl_FragColor = vec4(vec3(pattern(st)),1.0);
}
