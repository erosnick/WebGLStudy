#version 300 es

in vec4 position;
in vec2 textureCoord;
out vec2 outTextureCoord;
uniform mat4 rotationMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
void main() {
   gl_Position = projectionMatrix * viewMatrix * rotationMatrix * position;
   outTextureCoord = textureCoord;
}