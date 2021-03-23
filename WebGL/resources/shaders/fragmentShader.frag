#version 300 es

precision mediump float;
uniform sampler2D albedoSampler;
uniform sampler2D maskSampler;
in vec2 outTextureCoord;

out vec4 fragColor;

void main() {
   vec4 albedo = texture(albedoSampler, outTextureCoord);
   vec4 mask = texture(maskSampler, outTextureCoord);
   fragColor = albedo * mask;
}