// TextureQuad.js

var VertexShaderSource = 
'attribute vec4 position;\n' +
'attribute vec2 textureCoord;\n' +
'varying vec2 outTextureCoord;\n' +
'void main() {\n' +
'   gl_Position = position;\n' + 
'   outTextureCoord = textureCoord;\n' +
'}\n';

var FragmentShaderSource =
'precision mediump float;\n' +
'uniform sampler2D sampler;\n' +
'varying vec2 outTextureCoord;\n' +
'void main() {\n' +
'   gl_FragColor = texture2D(sampler, outTextureCoord);\n' +
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

    if (!initTextures(gl, n)) {
        console.log('Failed to init texture.');
    }

    gl.clearColor(0.4, 0.6, 0.9, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([-0.5,  0.5, 0.0, 1.0,
                                     -0.5, -0.5, 0.0, 0.0,
                                      0.5,  0.5, 1.0, 1.0,
                                      0.5, -0.5, 1.0, 0.0]);

    var n = vertices.length / 4;  // 点的个数

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

    var size = vertices.BYTES_PER_ELEMENT;

    var positionLocation = getAttribLocation(gl, 'position');

    // 将缓冲区对象分配给position变量
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, size * 4, 0);

    // 连接position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(positionLocation);

    var textureCoordLocation = getAttribLocation(gl, 'textureCoord');

    // 将缓冲区对象分配给textureCoord变量
    gl.vertexAttribPointer(textureCoordLocation, 2, gl.FLOAT, false, size * 4, size * 2);

    // 连接textureCoord变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(textureCoordLocation);

    return n;
}

function initTextures(gl, n) {
    var texture = gl.createTexture();     // 创建纹理对象

    // 获取sampler的存储位置
    var samplerLocation = getUniformLocation(gl, 'sampler');

    var image = new Image();    // 创建一个Image对象

    // 注册图像加载事件的响应函数
    image.onload = function() {
        loadTexture(gl, n, texture, samplerLocation, image);
    };

    // 浏览器开始加载图像
    image.src = './resources/sky.jpg';

    return true;
}

function loadTexture(gl, n, texture, samplerLocation, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // 对纹理图像进行y轴反转

    // 开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);

    // 向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    // 配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // 将0号纹理传递给着色器
    gl.uniform1i(samplerLocation, 0);

        // 绘制三个点
    // gl.drawArrays(gl.LINES, 0, n);
    // gl.drawArrays(gl.LINE_STRIP, 0, n);
    // gl.drawArrays(gl.LINE_LOOP, 0, n);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}