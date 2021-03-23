// RotatingTriangle.js

var VertexShaderSource = 
'attribute vec4 position;\n' +
'uniform mat4 transformMatrix;\n' +
'void main() {\n' +
'   gl_Position = transformMatrix * position;\n' + 
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
    initSlider();

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

    var angle = 90.0;

    // 三角形当前的角度
    var currentAngle = 0.0;

    // 注意WebGL中矩阵是列主序的
    var transformMatrix = new Matrix4();

    var transformMatrixLocation = getUniformLocation(gl, "transformMatrix");

    // 开始绘制三角形
    var tick = function() {
        currentAngle = animate(currentAngle);   // 更新旋转角
        draw(gl, n, currentAngle, transformMatrix, transformMatrixLocation);
        requestAnimationFrame(tick);
    };

    tick();
}

function initSlider() {
    var slider = document.getElementById("rotateAngle");
    var angle = document.getElementById("angle");
    angle.innerHTML = slider.value;

    slider.oninput = function() {
        angle.innerHTML = this.value;
    }
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([0.0,  0.5, 
                                    -0.5, -0.5, 
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

function draw(gl, n, currentAngle, transformMatrix, transformMatrixLocation) {
    // 设置旋转矩阵
    transformMatrix.setRotate(currentAngle, 0.0, 0.0, 1.0);

    // 将旋转矩阵传输给顶点着色器
    gl.uniformMatrix4fv(transformMatrixLocation, false, transformMatrix.elements);

    gl.clearColor(0.4, 0.6, 0.9, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制三角形
    gl.drawArrays(gl.TRIANGLES, 0, n);
};

// 记录上一次调用函数的时刻
var last = Date.now();

function animate(angle) {
    // 计算距离上次调用经过多长的时间
    var now = Date.now();

    var elapsed = now - last;   // 毫秒
    last = now;

    var angleStep = 45.0;

    var slider = document.getElementById('rotateAngle');

    // 根据距离上次调用的时间，更新当前旋转角度
    var newAngle = angle + (slider.value * elapsed) / 1000.0;

    return newAngle %= 360.0;
};