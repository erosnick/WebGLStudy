// MultiAttributeSize_Interleaved.js

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

    var pointSizeLocation = getAttribLocation(gl, "pointSize");

    gl.vertexAttrib1f(pointSizeLocation, 10.0);

    var fragColorLocation = getUniformLocation(gl, "fragColor");

    gl.uniform4f(fragColorLocation, 1.0, 0.0, 0.0, 1.0);

    gl.clearColor(0.4, 0.6, 0.9, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制三个点
    gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([0.0,  0.5, 10.0,
                                    -0.5, -0.5, 20.0,
                                     0.5, -0.5, 30.0]);

    var n = 3;  // 点的个数

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
    
    // 类型化数组中每个元素的尺寸
    var size = vertices.BYTES_PER_ELEMENT;

    // 将缓冲区对象分配给position变量
    // 第二个参数表示顶点的分量个数，2表示顶点x，y坐标
    // 第五个参数表示相邻两个顶点之间的字节数，现在顶点多了一个pointSize分量
    // 因此这个参数的大小应该是size * 3
    // 第六个参数表示顶点中分量的偏移，坐标x, y的偏移为0
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, size * 3, 0);

    // 连接position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(positionLocation);

    var pointSizeLocation = getAttribLocation(gl, 'pointSize');

    // 第二个参数表示顶点的分量个数，1表示pointSize分量
    // 第六个参数表示顶点中分量的偏移，pointSize前面有x，y坐标，因此偏移为size * 2
    gl.vertexAttribPointer(pointSizeLocation, 1, gl.FLOAT, false, size * 3, size * 2);

    // 连接position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(pointSizeLocation);

    return n;
}