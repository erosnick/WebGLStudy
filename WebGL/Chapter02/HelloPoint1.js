// HelloPoint1.js

var VertexShaderSource = 
'void main() {\n' +
'   gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n' + 
'   gl_PointSize = 10.0;\n' +
'}\n';

var FragmentShaderSource =
'void main() {\n' +
'   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
'}\n';

function main() {
    // Retrieve the <canvas> element
    var canvas = document.getElementById("webgl");

    if (!canvas) {
        console.log("Failed to retrieve the <canvas> element");
        return false;
    }

    var gl = getWebGLContext(canvas);

    if (!gl) {
        console.log('Failed to get the rendering context for WebGL.');
        return;
    }

    if (!initShaders(gl, VertexShaderSource, FragmentShaderSource)) {
        console.log('Failed to initialize shaders.');
        return;
    }

    gl.clearColor(0.4, 0.6, 0.9, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 1);
}