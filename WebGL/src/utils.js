function getWebGLContext(canvas) {
    // Get the rendering context for WebGL
    let gl = canvas.getContext("webgl2");

    if (!gl) {
        console.log("Failed to get the rendering context for WebGL.");
        return null;
    }

    return gl;
}

/**
 * Create the linked program object
 * @param gl GL context
 * @param vertexShader a vertex shader program (string)
 * @param fragmentShader a fragment shader program (string)
 * @return created program object, or null if the creation has failed
 */
function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    // Create shader object
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
        return null;
    }

    // Create a program object
    let program = gl.createProgram();

    if (!program) {
        return null;
    }

    // Attach the shader objects
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // Link the program object
    gl.linkProgram(program);

    // Check the result of linking
    let linked = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (!linked) {
        let error = gl.getProgramInfoLog(program);
        console.log('Failed to link program: ' + error);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return null;
    }

    return program;
}

/**
 * Create a shader object
 * @param gl GL context
 * @param type the type of the shader object to be created
 * @param shaderSource shader program (string)
 * @return created shader object, or null if the creation has failed.
 */
function loadShader(gl, type, shaderSource) {
    // Create shader object
    let shader = gl.createShader(type);

    if (shader == null) {
        console.log('Unable to create shader.');
        return null;
    }

    // Set the shader program
    gl.shaderSource(shader, shaderSource);

    // Compile the shader
    gl.compileShader(shader);

    // Check the result of compilation
    let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    if (!compiled) {
        let error = gl.getShaderInfoLog(shader);
        console.log('Failed to compile shader: ' + error);

        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

/**
 * Create a program object and make current
 * @param gl GL context
 * @param vertexShaderSource a vertex shader program (string)
 * @param fragmentShaderSource a fragment shader program (string)
 * @return true, if the program object was created and successfully made current 
 */
function initShaders(gl, vertexShaderSource, fragmentShaderSource) {
    let program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    
    if (!program) {
        console.log('Failed to create program.');
        return false;
    }

    gl.useProgram(program);
    gl.program = program;

    return true;
}

/**
 * Get attribute location
 * @param gl GL context
 * @param attribute attribute name (string)
 * @return true, if the location is valid(>= 0) 
 */
function getAttribLocation(gl, attribute) {
    // 获取attribute变量的存储位置
    let location = gl.getAttribLocation(gl.program, attribute);

    if (location < 0) {
        console.log('Failed to get the storage location of ' + attribute);
        return -1;
    }

    return location;
}

function glVertexAttribute1f(gl, attribute, value) {
    let location = getAttribLocation(gl, attribute);
    
    gl.vertexAttrib1f(location, value);
}

/**
 * Get uniform location
 * @param gl GL context
 * @param uniform uniform name (string)
 * @return true, if the location is valid(>= 0) 
 */
 function getUniformLocation(gl, uniform) {
    // 获取uniform变量的存储位置
    let location = gl.getUniformLocation(gl.program, uniform);

    if (location < 0) {
        console.log('Failed to get the storage location of ' + uniform);
        return -1;
    }

    return location;
}

function glUniform1f(gl, uniform, value) {
    let location = getUniformLocation(gl, uniform);

    gl.uniform1f(location, value); 
}

function glUniformMatrix4fv(gl, uniform, value) {
    let location = getUniformLocation(gl, uniform);

    gl.uniformMatrix4fv(location, false, value); 
}

function setVertexAttribPointer(gl, attribute, size, type, stride, offset) {
    let location = getAttribLocation(gl, attribute);

    // 将缓冲区对象分配给attribute变量
    gl.vertexAttribPointer(location, size, type, false, stride, offset);

    // 连接attribute变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(location);
}

export {getWebGLContext, createProgram, loadShader, initShaders, getAttribLocation, 
        glVertexAttribute1f, getUniformLocation, glUniform1f, glUniformMatrix4fv, setVertexAttribPointer}