// Author _ Hang Do Thi Duc ( 22-8miles.com )
THREE.Effect4 = {
    uniforms: {
        "time":     { type: "f", value: 0.0},
        "mouse":     { type: "v2", value: null},
        "tDiffuse": { type: "t", value: null },
        "scale":    { type: "f", value: 0.0 },
        "pi":       { type: "f", value: 3.14159265359},
    },

    vertexShader: [
        "varying vec2 vUv;",
        "void main() {",
            "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}"
    ].join( "\n" ),
    fragmentShader: [
        "uniform float time;",
        "uniform vec2 mouse;",
        "uniform float scale;",
        "uniform float pi;",
        "uniform sampler2D tDiffuse;",
        "varying vec2 vUv;",

        "float circle (float sc, float r, float sm, vec2 st, vec2 mouse){",
        "    vec2 toCenter = mouse-st;",
        "    float pct = length(vec2(toCenter.x * 2., toCenter.y)) * sc;",
        "    pct = smoothstep(r-sm, r+sm, pct);",
        "    return pct;",
        "}",

            "vec2 random(vec2 st){",
        "    st = vec2( dot(st,vec2(127.1,311.7)),",
        "              dot(st,vec2(269.5,183.3)) );",
        "    return -1.0 + 2.0*fract(sin(st)*43758.5453123);",
        "}",

            "float noise(vec2 st) {",
        "    vec2 i = floor(st);",
        "    vec2 f = fract(st);",

            "    vec2 u = f*f*(3.0-2.0*f);",
        "    return mix( mix( dot( random(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),",
        "                     dot( random(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),",
        "                mix( dot( random(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),",
        "                     dot( random(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);",
        "}",

            "void main () {",
            "    // modified http://threejs.org/examples/js/shaders/BokehShader.js",
        "    vec2 aspectcorrect = vec2( 1.0, 1.0 );",
        "    float aperture = .5;",
        "    float factor = .2;",
        "    vec2 dofblur = vec2 ( clamp( factor * aperture, -1., 1. ) );",
        "    vec2 dofblur5 = dofblur*0.5+0.2*vec2(noise(vUv+time*0.9), noise(vUv+time*0.3));",

            "    vec4 colorMask = vec4(1.-circle(2., 1.0, 0.5, vUv, mouse+0.2*noise(vUv+time*0.2))) * texture2D( tDiffuse, vUv );",
        "    vec4 colorBlur = texture2D( tDiffuse, vUv ) - vec4(circle(2., 0.8, 0.1, vUv, mouse));",

            "    colorBlur += texture2D( tDiffuse, vUv + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur );",
        "    colorBlur += texture2D( tDiffuse, vUv + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur );",
        "    colorBlur += texture2D( tDiffuse, vUv + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur );",
        "    colorBlur += texture2D( tDiffuse, vUv + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur );",
        "    colorBlur += texture2D( tDiffuse, vUv + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur );",
        "    colorBlur += texture2D( tDiffuse, vUv + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur );",
        "    colorBlur += texture2D( tDiffuse, vUv + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur );",
        "    colorBlur += texture2D( tDiffuse, vUv + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur );",
        "    colorBlur += texture2D( tDiffuse, vUv + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur );",
        "    colorBlur += texture2D( tDiffuse, vUv + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur );",
        "    colorBlur += texture2D( tDiffuse, vUv + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur );",
        "    colorBlur += texture2D( tDiffuse, vUv + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur );",
        "    colorBlur += texture2D( tDiffuse, vUv + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur );",
        "    colorBlur += texture2D( tDiffuse, vUv + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur );",
        "    colorBlur += texture2D( tDiffuse, vUv + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur );",
        "    colorBlur += texture2D( tDiffuse, vUv + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur );",

            "    colorBlur += texture2D( tDiffuse, vUv + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur5 );",
        "    colorBlur += texture2D( tDiffuse, vUv + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur5 );",
        "    colorBlur += texture2D( tDiffuse, vUv + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur5 );",
        "    colorBlur += texture2D( tDiffuse, vUv + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur5 );",
        "    colorBlur += texture2D( tDiffuse, vUv + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur5 );",
        "    colorBlur += texture2D( tDiffuse, vUv + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur5 );",
        "    colorBlur += texture2D( tDiffuse, vUv + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur5 );",
        "    colorBlur += texture2D( tDiffuse, vUv + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur5 );",

            "    vec4 color = colorMask + colorBlur/20.;",
        "    color *= 1.-circle(2., 2.0 * scale, 1.5, vUv, mouse+0.2*noise(vUv+time*0.2) ) * 0.7;",
        "    gl_FragColor = vec4(color.rgb, 1.0);",
        "}",

    ].join( "\n" )
};