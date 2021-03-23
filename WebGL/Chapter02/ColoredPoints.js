// ColoredPoints.js

var VertexShaderSource = 
'attribute vec4 position;\n' +
'attribute float pointSize;\n' +
'void main() {\n' +
'   gl_Position = position;\n' + 
'   gl_PointSize = pointSize;\n' +
'}\n';

var FragmentShaderSource =
'precision mediump float;\n' +
'uniform vec4 fragColor;\n' +
'void main() {\n' +
'   gl_FragColor = fragColor;\n' +
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
    var positionLocation = getAttribLocation(gl, 'position');

    // 将顶点位置传输给attribute变量
    gl.vertexAttrib3f(positionLocation, 0.5, 0.0, 0.0);

    var position = new Float32Array([0.0, 0.0, 0.0, 1.0]);

    gl.vertexAttrib4fv(positionLocation, position);

    var pointSizeLocation = getAttribLocation(gl, "pointSize");

    gl.vertexAttrib1f(pointSizeLocation, 10.0);

    var fragColorLocation = getUniformLocation(gl, "fragColor");

    // 注册鼠标点击事件响应函数
    canvas.onmousedown = function(event) {
        click(event, gl, canvas, positionLocation, fragColorLocation);
    };

    gl.clearColor(0.4, 0.6, 0.9, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 1);
}

var points = [];    // 鼠标点击位置数组
var colors = [];    // 存储点颜色的数组

function click(event, gl, canvas, positionLocation, fragColorLocation) {
    var x = event.clientX;      // 鼠标点击处的x坐标
    var y = event.clientY;      // 鼠标点击处的y坐标
    var rect = event.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
    // 将坐标存储到points数组中
    points.push([x, y]);

    x = (x + 1.0) / 2.0;
    y = (y + 1.0) / 2.0;

    colors.push([x, y, 0.0, 1.0]);

    gl.clear(gl.COLOR_BUFFER_BIT);

    var length = points.length;

    for (var i = 0; i < length; i++) {
        // 将点的位置传递到变量position中
        var xy = points[i];
        gl.vertexAttrib3f(positionLocation, xy[0], xy[1], 0.0);

        var color = colors[i];
        gl.uniform4f(fragColorLocation, color[0], color[1], color[2], color[3]);

        gl.drawArrays(gl.POINTS, 0, 1);
    }
}