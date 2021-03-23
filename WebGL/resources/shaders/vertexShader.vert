#version 300 es

in vec4 position;
in vec2 textureCoord;
uniform float sinb;
uniform float cosb;
out vec2 outTextureCoord;

// 绕z轴旋转b弧度
// x' = x cos b - y sin b
// y' = x sin b + y cos b
// z' = z
void main() {
   gl_Position = position;
   outTextureCoord = textureCoord;
   vec2 coordinate = textureCoord - 0.5;
   outTextureCoord.x = coordinate.x * cosb - coordinate.y * sinb;
   outTextureCoord.y = coordinate.x * sinb + coordinate.y * cosb;
   outTextureCoord += 0.5;
}