struct Output {
  @builtin(position) position: vec4<f32>,
  @location(0) vColor: vec4<f32>,
}

@vertex
fn main(@builtin(vertex_index) VertexIndex: u32) -> Output {
  var pos = array<vec2<f32>, 9>(
    vec2<f32>(-0.63,  0.80),
    vec2<f32>(-0.65,  0.20),
    vec2<f32>(-0.20,  0.60),
    vec2<f32>(-0.37, -0.07),
    vec2<f32>( 0.05,  0.18),
    vec2<f32>(-0.13, -0.40),
    vec2<f32>( 0.30, -0.13),
    vec2<f32>( 0.13, -0.64),
    vec2<f32>( 0.70, -0.30)     
  );

  var col = array<vec3<f32>, 9>(
    vec3<f32>(0.8, 0.2, 0.4),
    vec3<f32>(0.2, 0.4, 0.8),
    vec3<f32>(0.4, 0.2, 0.8),
    vec3<f32>(0.8, 0.2, 0.4),
    vec3<f32>(0.2, 0.4, 0.8),
    vec3<f32>(0.4, 0.2, 0.8),
    vec3<f32>(0.8, 0.2, 0.4),
    vec3<f32>(0.2, 0.4, 0.8),
    vec3<f32>(0.4, 0.2, 0.8),
  );

  var out: Output;
  out.position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);
  out.vColor = vec4<f32>(col[VertexIndex], 1.0);
  return out;
}