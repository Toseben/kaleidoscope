module.exports = THREE.MirrorUVShader = {

  uniforms: {

    "tDiffuse":    { value: null },
    "tSize":       { value: new THREE.Vector2( 256, 256 ) },
    "aspect":      { value: 1.0 },
    "sections":    { value: 8.0 },
    "time":        { value: 0.0 },
    "mouseSwitch": { value: 1.0 },
    "animSwitch":  { value: 1.0 },
    "animX":       { value: 0.0 },
    "animY":       { value: 0.0 },
    "offset":      { value: new THREE.Vector2( 0.0, 0.0 ) }
  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join( "\n" ),

  fragmentShader: [

    "uniform sampler2D tDiffuse;",
    "uniform float sections;",
    "uniform float aspect;",
    "uniform float time;",
    "uniform float mouseSwitch;",
    "uniform float animSwitch;",
    "uniform float animX;",
    "uniform float animY;",
    "uniform vec2 offset;",

    "varying vec2 vUv;",

    "const float PI = 3.1415;",
    "const float TAU = 2.0 * PI;",

    "void main() {",

      "vec2 pos = (vUv - 0.5) * 2.0;",
      // "pos.y /= aspect;",
      "float rad = length(pos);",
      "float angle = atan(pos.y, pos.x);",

      "float ma = mod(angle, TAU / sections);",
      "ma = abs(ma - PI / sections);",

      "float x = cos(ma) * rad;",
      "float y = sin(ma) * rad;",
      "float modX = abs(mod(x - (time * animX * animSwitch * 2.0) + offset.x * mouseSwitch, 1.0) * 2.0 - 1.0);",
      "float modY = abs(mod(y - (time * animY * animSwitch * 2.0) + offset.y * mouseSwitch, 1.0) * 2.0 - 1.0);",

      "vec4 color = texture2D( tDiffuse, vec2(modX, modY) );",
      // "color = texture2D( tDiffuse, vUv );",
      "gl_FragColor = color;",
      // "gl_FragColor = vec4(vec3(modX, modY, 0.0), 1.0);",

    "}"

  ].join( "\n" )

};
