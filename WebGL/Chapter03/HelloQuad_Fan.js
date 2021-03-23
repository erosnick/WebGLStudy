// HelloQuad_Fan.js

var VertexShaderSource = 
'attribute vec4 position;\n' +
'void main() {\n' +
'   gl_Position = position;\n' + 
'}\n';

var FragmentShaderSource =
'precision mediump float;\n' +
'uniform vec4 fragColor;\n' +
'void main() {\n' +
'   gl_FragColor = fragColor;\n' +
'}\n';

var vertex = function (){
    var self = this;
//    		self.projectCode = PROJECT_CODE;
    self.position;
    self.color;
    self.projectInfo = projectInfo;
};

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

    // 设置顶点位置
    var n = initVertexBuffers(gl);

    if (n < 0) {
        console.log('Failed to set the positions of the vertices.');
        return;
    }

    var fragColorLocation = getUniformLocation(gl, "fragColor");

    gl.uniform4f(fragColorLocation, 1.0, 0.0, 0.0, 1.0);

    gl.clearColor(0.4, 0.6, 0.9, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制三个点
    // gl.drawArrays(gl.LINES, 0, n);
    // gl.drawArrays(gl.LINE_STRIP, 0, n);
    // gl.drawArrays(gl.LINE_LOOP, 0, n);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([-0.5,  0.5, 
                                     -0.5, -0.5,
                                      0.5,  0.5, 
                                      0.5, -0.5]);

    var n = vertices.length / 2;  // 点的个数

    // 创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object.');
        return -1;
    }

    // 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // 向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var positionLocation = getAttribLocation(gl, 'position');

    // 将缓冲区对象分配给position变量
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // 连接position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(positionLocation);

    return n;
}