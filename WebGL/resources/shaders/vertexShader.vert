#version 300 es

in vec4 position;
in vec2 textureCoord;
out vec2 outTextureCoord;
uniform mat4 viewMatrix;
void main() {
   gl_Position = viewMatrix * position;
   outTextureCoord = textureCoord;
}