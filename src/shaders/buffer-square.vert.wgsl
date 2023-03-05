struct Output {
  @builtin(position) position: vec4<f32>,
  @location(0) vColor: vec4<f32>,
}

@vertex
fn main(@location(0) pos: vec4<f32>, @location(1) col: vec4<f32>) -> Output {

  var out: Output;
  out.position = pos;
  out.vColor = col;
  return out;
}