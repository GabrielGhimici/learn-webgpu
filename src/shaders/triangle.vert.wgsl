struct Output {
  @builtin(position) position: vec4<f32>,
  @location(0) vColor: vec4<f32>,
}

@vertex
fn main(@builtin(vertex_index) VertexIndex: u32) -> Output {
  var pos = array<vec2<f32>, 3>(
    vec2<f32>(0.0, 0.5),
    vec2<f32>(-0.5, -0.5),
    vec2<f32>(0.5, -0.5)
  );

  var col = array<vec3<f32>, 3>(
    vec3<f32>(0.8, 0.5, 0.3),
    vec3<f32>(0.5, 0.8, 0.3),
    vec3<f32>(0.3, 0.5, 0.8),
  );

  var out: Output;
  out.position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);
  out.vColor = vec4<f32>(col[VertexIndex], 1.0);
  return out;
}