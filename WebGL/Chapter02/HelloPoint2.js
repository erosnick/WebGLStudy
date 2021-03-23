// HelloPoint2.js

var VertexShaderSource = 
'attribute vec4 position;\n' +
'attribute float pointSize;\n' +
'void main() {\n' +
'   gl_Position = position;\n' + 
'   gl_PointSize = pointSize;\n' +
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

    // 获取attribute变量的存储位置
    var location = getAttribLocation(gl, 'position');

    // 将顶点位置传输给attribute变量
    gl.vertexAttrib3f(location, 0.5, 0.0, 0.0);

    var position = new Float32Array([0.0, 0.0, 0.0, 1.0]);

    gl.vertexAttrib4fv(location, position);

    location = getAttribLocation(gl, "pointSize");

    gl.vertexAttrib1f(location, 10.0);

    gl.clearColor(0.4, 0.6, 0.9, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 1);
}