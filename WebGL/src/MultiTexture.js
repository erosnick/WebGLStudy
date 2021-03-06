// MultiTexture.js
import {getWebGLContext, createProgram, loadShader, initShaders, getAttribLocation, 
        glVertexAttribute1f, getUniformLocation, glUniform1f, setVertexAttribPointer} from './utils.js'

class WebGLRenderer {
    constructor() {
        this.canvas = null;
        this.gl = null;
        this.n = 0;
        this.VertexShaderSource = null;
        this.FragmentShaderSource = null;
        this.last = 0
        this.vao = null;
    }

    initSlider() {
        let slider = document.getElementById("rotateAngle");
        let angle = document.getElementById("angle");
        angle.innerHTML = slider.value + '°/s';
    
        slider.oninput = function() {
            angle.innerHTML = this.value + '°/s';
        }
    
        this.slider = slider;
    }

    createCanvas() {
        // Retrieve the <canvas> element
        let canvas = document.getElementById("webgl");

        if (!canvas) {
            console.log("Failed to retrieve the <canvas> element");
            return false;
        }

        let gl = getWebGLContext(canvas);

        if (!gl) {
            console.log('Failed to get the rendering context for WebGL.');
            return;
        }

        this.canvas = canvas;
        this.gl = gl;

        this.bindVertexArray = (vao) => {this.gl.bindVertexArray(vao);}
        this.createVertexArray = () => {return this.gl.createVertexArray();}
        this.createBuffer = () => {return this.gl.createBuffer();}
    }

    run() {
        // 三角形当前的角度
        let currentAngle = 90.0;

        // 记录上一次调用函数的时刻
        this.last = Date.now();

        // 开始绘制三角形
        let tick = function(renderer) {
            currentAngle = renderer.update(currentAngle);
            renderer.draw(currentAngle, null, null);
            // 用lambda包装一下回调函数，使得this能够被持续传入下次调用
            requestAnimationFrame(() => {
                tick(renderer);
            });
        }

        tick(this);
    }

    update(angle) {
        // 计算距离上次调用经过多长的时间
        let now = Date.now();
    
        let elapsed = now - this.last;   // 毫秒
        this.last = now;
    
        // 根据距离上次调用的时间，更新当前旋转角度
        let newAngle = angle + (this.slider.value * elapsed) / 1000.0;
    
        return newAngle %= 360.0;
    }

    draw(currentAngle, transformMatrix, transformMatrixLocation) {
        this.bindVertexArray(this.vao);

        this.gl.clearColor(0.4, 0.6, 0.9, 1.0);
    
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    
        let radian = Math.PI * currentAngle / 180.0;
    
        let sinβ = Math.sin(radian);
        let cosβ = Math.cos(radian);
    
        glUniform1f(this.gl, 'sinb', sinβ)
        glUniform1f(this.gl, 'cosb', cosβ)
    
        // 绘制三角形
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.n);
    }
        
    initVertexBuffers() {
        let vertices = new Float32Array([-0.5,  0.5, 0.0, 1.0,
                                            -0.5, -0.5, 0.0, 0.0,
                                            0.5,  0.5, 1.0, 1.0,
                                            0.5, -0.5, 1.0, 0.0]);
    
        this.n = vertices.length / 4;  // 点的个数

        this.vao = this.createVertexArray();

        this.bindVertexArray(this.vao);
    
        // 创建缓冲区对象
        let vertexBuffer = this.createBuffer();
        if (!vertexBuffer) {
            console.log('Failed to create the buffer object.');
            return -1;
        }
    
        // 将缓冲区对象绑定到目标
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    
        // 向缓冲区对象中写入数据
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
    
        let size = vertices.BYTES_PER_ELEMENT;
    
        setVertexAttribPointer(this.gl, 'position', 2, this.gl.FLOAT, size * 4, 0);
        setVertexAttribPointer(this.gl, 'textureCoord', 2, this.gl.FLOAT, size * 4, size * 2);

        this.bindVertexArray(null);
    }
        
    initTextures() {
        this.createImage('./resources/textures/sky.jpg', 'albedoSampler', this.gl.TEXTURE0, 0);
        this.createImage('./resources/textures/circle.gif', 'maskSampler', this.gl.TEXTURE1, 1);
    
        return true;
    }

    async loadImageProcess(src) {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.onload = () => resolve(image);    // 注册图像加载事件的响应函数
            image.onerror = reject; 
            image.src = src;                        // 浏览器开始加载图像
        })
    }
        
    createImage(path, uniform, textureUnit, index) {
        let texture = this.gl.createTexture();     // 创建纹理对象
    
        // 获取sampler的存储位置
        let samplerLocation = getUniformLocation(this.gl, uniform);

        let renderer = this;

        let createImage = async () => {
            return await renderer.loadImageProcess(path);
        }

        createImage().then((image) => {
            renderer.loadTexture(texture, samplerLocation, image, textureUnit, index);
        })
    }
        
    loadTexture(texture, samplerLocation, image, textureUnit, index) {
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);  // 对纹理图像进行y轴反转
    
        // 开启0号纹理单元
        this.gl.activeTexture(textureUnit);
    
        // 向target绑定纹理对象
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    
        // 配置纹理参数
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER,this. gl.LINEAR);
    
        // 配置纹理图像
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
    
        // 将0号纹理传递给着色器
        this.gl.uniform1i(samplerLocation, index);
    }

    prepare() {
        let loadShaders = async () => {
            this.VertexShaderSource = await (await fetch('./resources/shaders/vertexShader.vert')).text();
            this.FragmentShaderSource = await (await fetch('./resources/shaders/fragmentShader.frag')).text();

            return this;
        }
    
        loadShaders().then((renderer) => {
            // 确保着色器正确加载并成功创建之后再进行下一步
            if (renderer.VertexShaderSource && renderer.FragmentShaderSource) {
                if (!initShaders(renderer.gl, renderer.VertexShaderSource, renderer.FragmentShaderSource)) {
                    console.log('Failed to initialize shaders.');
                    return;
                }
    
                // 设置顶点位置
                renderer.initVertexBuffers(renderer.gl);
    
                if (!renderer.initTextures()) {
                    console.log('Failed to init texture.');
                }
    
                renderer.run();
            }
        });
    }
}

main();

function main() {
    let renderer = new WebGLRenderer();

    renderer.initSlider();

    renderer.createCanvas();

    renderer.prepare();
}
