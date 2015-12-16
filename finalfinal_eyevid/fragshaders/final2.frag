// Author _ Hang Do Thi Duc ( 22-8miles.com )
// Base Code _ http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 random(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( dot( random(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

float circle (float sc, float r, float sm, vec2 st, vec2 mouse){
    vec2 toCenter = mouse-st;
    float pct = length(toCenter) * sc;
    pct = smoothstep(r-sm, r+sm, pct);
    return pct;
}

vec4 blur (vec2 st, vec2 mouse) {
    // modified http://threejs.org/examples/js/shaders/BokehShader.js
    vec2 aspectcorrect = vec2( 1.0, 1.0 );
    float aperture = .6;
    float factor = .2;
    vec2 dofblur = vec2 ( clamp( factor * aperture, -1., 1. ) );
    vec2 dofblur5 = dofblur*0.5+0.2*vec2(noise(st+u_time*0.9), noise(st+u_time*0.3));
    vec4 colorBlur = texture2D( u_tex0, st ) - vec4(circle(2., 0.5, 0.05, st, mouse));
    colorBlur += texture2D( u_tex0, st + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur );
    colorBlur += texture2D( u_tex0, st + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur );
    colorBlur += texture2D( u_tex0, st + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur );
    colorBlur += texture2D( u_tex0, st + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur );
    colorBlur += texture2D( u_tex0, st + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur );
    colorBlur += texture2D( u_tex0, st + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur );
    colorBlur += texture2D( u_tex0, st + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur );
    colorBlur += texture2D( u_tex0, st + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur );
    colorBlur += texture2D( u_tex0, st + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur );
    colorBlur += texture2D( u_tex0, st + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur );
    colorBlur += texture2D( u_tex0, st + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur );
    colorBlur += texture2D( u_tex0, st + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur );
    colorBlur += texture2D( u_tex0, st + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur );
    colorBlur += texture2D( u_tex0, st + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur );
    colorBlur += texture2D( u_tex0, st + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur );
    colorBlur += texture2D( u_tex0, st + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur );
    colorBlur += texture2D( u_tex0, st + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur5 );
    colorBlur += texture2D( u_tex0, st + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur5 );
    colorBlur += texture2D( u_tex0, st + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur5 );
    colorBlur += texture2D( u_tex0, st + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur5 );
    colorBlur += texture2D( u_tex0, st + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur5 );
    colorBlur += texture2D( u_tex0, st + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur5 );
    colorBlur += texture2D( u_tex0, st + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur5 );
    colorBlur += texture2D( u_tex0, st + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur5 );
    return colorBlur*0.03;
}

float rays (vec2 st, vec2 mouse) {
    // based on http://glslsandbox.com/e#29336.0
    float d=min(distance(st,vec2(1.9*noise(st+u_time*0.2)))*2.0,10.0);
    float a=(atan(st.y-mouse.y,st.x-mouse.x)+3.14159)/6.28318;
    a*=50.0;
    a-=floor(a);
    a=abs(a-0.5)*2.;
    d-=a*0.3;
    return cos(d*3.14159)+1.0;
}

void main () {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 mouse = u_mouse/u_resolution;
    vec4 colorMask = vec4(1.-circle(2., 0.7, 0.1, st, mouse+0.2*noise(st+u_time*0.2))) * texture2D( u_tex0, st );
    vec2 offset = vec2(rays(st, mouse));
    vec4 colorRays = texture2D( u_tex0, st) + offset.x;
    vec4 colorBlur = blur(st, mouse);
    vec4 color = mix(colorRays * 100., colorBlur, 0.99);
    vec4 colorNew = mix(colorBlur, colorMask, 0.5);
    color = mix(color, colorNew, 0.8) * 1.2;
    // vec4 colorC = vec4(circle(4., 1.5, 0.5 + noise(st+u_time*0.9) * 0.001, st, mouse));
    // color -= 1.-colorC;
    // vec4 colorA = texture2D(u_tex0,st);
    // color = color * colorA;
    gl_FragColor = color;
}