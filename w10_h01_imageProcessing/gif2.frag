#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;
// 2.jpg - Inception sprite
int col = 3;
int row = 3;

uniform sampler2D u_tex1;
uniform vec2 u_tex1Resolution;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main () {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // fix aspect ratio
    st.x *= 0.5;
    st.x += 0.2;
    vec4 color = vec4(0.0);
    // Resolution of one frame
    vec2 fRes = u_tex0Resolution/vec2(float(col),float(row));
    // Normalize value of the frame resolution
    vec2 nRes = u_tex0Resolution/fRes;
    // Scale the coordenates to a single frame
    st = st/nRes;
    // Calculate the offset in cols and rows
    float timeX = u_time*12.;
    float timeY = floor(timeX/float(col));
    vec2 offset = vec2( floor(timeX)/nRes.x,
                        1.0-(floor(timeY)/nRes.y) );
    st = fract(st+offset);
    st *= 10.;

    vec2 noise = vec2(0.0);
    noise.x = texture2D(u_tex1,st).r*(0.02+0.02*sin(u_time));

    color = texture2D(u_tex0,st+noise);

    gl_FragColor = color;
}