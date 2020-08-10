//----------------- BOX SHADERS -----------------//

const boxVertex = /* glsl */ `
  varying vec2 vUv;

  uniform float twistAmount;

  mat4 rotation3d(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(
      oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
      oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
      oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
      0.0,                                0.0,                                0.0,                                1.0
    );
  }

  vec3 rotate(vec3 v, vec3 axis, float angle) {
    return (rotation3d(axis, angle) * vec4(v, 1.0)).xyz;
  }

  void main() {
    vUv = uv;
    
    vec3 pos = position;

    vec3 axis = vec3(1., 0., 0.);
    float twist = -twistAmount;
    float angle = pos.x * twist;

    vec3 transformed = rotate(pos, axis, angle);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.);
  }
`;

const boxFragment = /* glsl */ `
  varying vec2 vUv;

  uniform sampler2D uTexture;

  void main() {
    vec2 uv = fract(vUv * 1. - vec2(0.05, 0.));
    vec3 texture = texture2D(uTexture, uv).rgb;

    gl_FragColor = vec4(texture, 1.);
  }
`;

//-------------- EXPORT SHADERS -----------------//

export default {
	vertex: boxVertex,
	fragment: boxFragment,
};
