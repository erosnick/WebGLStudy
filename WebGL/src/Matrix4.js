/**
 * Constructor of Matrix4
 * If matrix is specified, new matrix is initialized by matrix.
 * Otherwise, new matrix is initialized by identity matrix.
 * @param matrix source matrix(optional)
 */
var Matrix4 = function(matrix) {
    if (matrix && typeof matrix === 'object' && matrix.hasOwnProperty('elements')) {
        var source = matrix.elements;
        var destination = new Float32Array(16);

        for (var i = 0; i < 16; i++) {
            destination[i] = source[i];
        }

        this.elements = destination;
    } else {
        this.elements = new Float32Array([1.0, 0.0, 0.0, 0.0, 
                                          0.0, 1.0, 0.0, 0.0, 
                                          0.0, 0.0, 1.0, 0.0, 
                                          0.0, 0.0, 0.0, 1.0]);
    }
};

/**
 * Set the identity matrix.
 * @return this
 */
Matrix4.prototype.setIdentity = function() {
    var elements = this.elements;
    elements[0] = 1.0; elements[4] = 0.0; elements[8]  = 0.0; elements[12] = 0.0;
    elements[1] = 0.0; elements[5] = 1.0; elements[9]  = 0.0; elements[13] = 0.0;
    elements[2] = 0.0; elements[6] = 0.0; elements[10] = 1.0; elements[14] = 0.0;
    elements[3] = 0.0; elements[7] = 0.0; elements[11] = 0.0; elements[15] = 1.0;
    return this;
};

/**
 * Copy matrix.
 * @param matrix source matrix
 * @return this
 */
Matrix4.prototype.set = function(matrix) {
    var source = matrix.elements;
    var destination = this.elements;

    if (source == destination) {
        return;
    }

    for (var i = 0; i < 16; i++) {
        destination[i] = source[i];
    }

    return this;
};

/**
 * Multiply the matrix from the right.
 * @param other The multiply matrix
 * @return this
 */
Matrix4.prototype.concat = function(other) {

    // Calculate elements = a * b
    var elements = this.elements;
    var a = this.elements;
    var b = other.elements;

    // If elements equals b, copy b to temporry matrix
    if (elements == b) {
        b = new Float32Array(16);
        for (var i = 0; i < 16; i++) {
            b[i] = elements[i];
        }
    }

    var ai0, ai1, ai2, ai3;

    for (var i = 0; i < 4; i++) {
        ai0 = a[i]; ai1 = a[i + 4]; ai2 = a[i + 8]; ai3 = a[i + 12];    // rows

        elements[i]      = ai0 * b[0]  + ai1 * b[1]  + ai2 * b[2]  + ai3 * b[3];
        elements[i + 4]  = ai0 * b[4]  + ai1 * b[5]  + ai2 * b[6]  + ai3 * b[7];
        elements[i + 8]  = ai0 * b[8]  + ai1 * b[9]  + ai2 * b[10] + ai3 * b[11];
        elements[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
    }

    return this;
};

Matrix4.prototype.multiply = Matrix4.prototype.concat;

/**
 * Multiply the three-dimensional vector.
 * @param vector  The multiply vector
 * @return The result of multiplication(Float32Array)
 */
Matrix4.prototype.multiplyVector3 = function(vector) {
    var e = this.elements;
    var ve = vector.elements;
    var newVector = new Vector3();
    var result = newVector.elements;

    result[0] = ve[0] * e[0] + ve[1] * e[4] + ve[2] * e[8]  + e[12];
    result[1] = ve[0] * e[1] + ve[1] * e[5] + ve[2] * e[9]  + e[13];
    result[2] = ve[0] * e[2] + ve[1] * e[6] + ve[2] * e[10] + e[14];

    return newVector;
};

/**
 * Multiply the four-dimensional vector.
 * @param vector  The multiply vector
 * @return The result of multiplication(Float32Array)
 */
 Matrix4.prototype.multiplyVector3 = function(vector) {
    var e = this.elements;
    var ve = vector.elements;
    var newVector = new Vector4();
    var result = newVector.elements;

    result[0] = ve[0] * e[0] + ve[1] * e[4] + ve[2] * e[8]  + ve[3] * e[12];
    result[1] = ve[0] * e[1] + ve[1] * e[5] + ve[2] * e[9]  + ve[3] * e[13];
    result[2] = ve[0] * e[2] + ve[1] * e[6] + ve[2] * e[10] + ve[3] * e[14];
    result[2] = ve[0] * e[3] + ve[1] * e[7] + ve[2] * e[11] + ve[3] * e[15];

    return newVector;
};

/**
 * Set the matrix for scaling.
 * @param x The scale factor along the X axis
 * @param y The scale factor along the Y axis
 * @param z The scale factor along the Z axis
 * @return this
 */
Matrix4.prototype.setScale = function(x, y, z) {
    var elements = this.elements;
    elements[0]  = x; elements[1]    = 0.0; elements[2]  = 0.0; elements[3]  = 0.0;
    elements[4]  = 0.0; elements[5]  = y; elements[6]    = 0.0; elements[7]  = 0.0;
    elements[8]  = 0.0; elements[9]  = 0.0; elements[10] = z; elements[11]   = 0.0;
    elements[12] = 0.0; elements[13] = 0.0; elements[14] = 1.0; elements[15] = 1.0;
    return this;
};

/**
 * Multiply the matrix for scaling from the right.
 * @param x The scale factor along the X axis
 * @param y The scale factor along the Y axis
 * @param z The scale factor along the Z axis
 * @return this
 */
Matrix4.prototype.scale = function(x, y, z) {
    var elements = this.elements;
    elements[0] *= x; elements[4] *= y; elements[8]  *= z;
    elements[1] *= x; elements[5] *= y; elements[9]  *= z;
    elements[2] *= x; elements[6] *= y; elements[10] *= z;
    elements[3] *= x; elements[7] *= y; elements[11] *= z;
    return this;
};

/**
 * Set the matrix for translation.
 * @param x The X value of a translation.
 * @param y The Y value of a translation.
 * @param z The Z value of a translation.
 * @return this
 */
Matrix4.prototype.setTranslate = function(x, y, z) {
    var elements = this.elements;
    elements[0] = 1.0; elements[4] = 0.0; elements[9]  = 0.0; elements[12] = x;
    elements[1] = 0.0; elements[5] = 1.0; elements[9]  = 0.0; elements[13] = y;
    elements[2] = 0.0; elements[6] = 0.0; elements[10] = 1.0; elements[14] = z;
    elements[3] = 0.0; elements[6] = 0.0; elements[10] = 0.0; elements[14] = 1.0
    return this;
};

/**
 * Multiply the matrix for translation from the right.
 * @param x The X value of a translation.
 * @param y The Y value of a translation.
 * @param z The Z value of a translation.
 * @return this
 */
Matrix4.prototype.translate = function(x, y, z) {
    var elements = this.elements;
    elements[12] += elements[0] * x + elements[4] * y + elements[8] * z;
    elements[13] += elements[1] * x + elements[5] * y + elements[9] * z;
    elements[14] += elements[2] * x + elements[6] * y + elements[10] * z;
    elements[15] += elements[3] * x + elements[7] * y + elements[11] * z;
    return this;
};

/**
 * Set the matrix for rotation.
 * The vector of rotation axis may not be normalized.
 * @param angle The angle of rotation (degrees)
 * @param x The X coordinate of vector of rotation axis.
 * @param y The Y coordinate of vector of rotation axis.
 * @param z The Z coordinate of vector of rotation axis.
 * @return this
 */
Matrix4.prototype.setRotate = function(angle, x, y, z) {
    var radian = Math.PI * angle / 180;

    var elements = this.elements;

    var sin = Math.sin(radian);
    var cos = Math.cos(radian);

    if (0 !== x && 0 === y && 0 === z) {
        // Rotation around X axis
        if (x < 0) {
            sin = -sin;
        }

        elements[0] = 1.0; elements[4] = 0.0; elements[ 8] = 0.0;  elements[12] = 0.0;
        elements[1] = 0.0; elements[5] = cos; elements[ 9] = -sin; elements[13] = 0.0;
        elements[2] = 0.0; elements[6] = sin; elements[10] = cos;  elements[14] = 0.0;
        elements[3] = 0.0; elements[7] = 0.0; elements[11] = 0.0;  elements[15] = 1.0;
    } else if (0 === x && 0 !== y && 0 === z) {
        // Rotation around Y axis
        if (y < 0) {
            sin = -sin;
        }

        elements[0] = cos;  elements[4] = 0.0; elements[ 8] = sin; elements[12] = 0.0;
        elements[1] = 0.0;  elements[5] = 1.0; elements[ 9] = 0.0; elements[13] = 0.0;
        elements[2] = -sin; elements[6] = 0.0; elements[10] = cos; elements[14] = 0.0;
        elements[3] = 0.0;  elements[7] = 0.0; elements[11] = 0.0; elements[15] = 1.0;
    } else if (0 === x && 0 === y && 0 !== z) {
        // Rotation around Z axis
        if (z < 0) {
            sin = -sin;
        }

        elements[0] = cos; elements[4] = -sin; elements[ 8] = 0.0; elements[12] = 0.0;
        elements[1] = sin; elements[5] = cos;  elements[ 9] = 0.0; elements[13] = 0.0;
        elements[2] = 0.0; elements[6] = 0.0;  elements[10] = 1.0; elements[14] = 0.0;
        elements[3] = 0.0; elements[7] = 0.0;  elements[11] = 0.0; elements[15] = 1.0;
    }

    return this;
};

/**
 * Multiply the matrix for rotation from the right.
 * The vector of rotation axis may not be normalized.
 * @param angle The angle of rotation (degrees)
 * @param x The X coordinate of vector of rotation axis.
 * @param y The Y coordinate of vector of rotation axis.
 * @param z The Z coordinate of vector of rotation axis.
 * @return this
 */
Matrix4.prototype.rotate = function(angle, x, y, z) {
    return this.concat(new Matrix4().setRotate(angle, x, y, z));
};

/**
 * Constructor of Vector3
 * If opt_src is specified, new vector is initialized by vector.
 * @param vector source vector(optional)
 */
var Vector3 = function(vector) {
    var elements = new Float32Array(3);
    if (vector && typeof vector === 'object') {
        elements[0] = vector[0]; elements[1] = vector[1]; elements[2] = vector[2];
    }

    this.elements = elements;
};

/**
  * Normalize.
  * @return this
  */
 Vector3.prototype.normalize = function() {
     var elements = this.elements;
     var a = elements[0], b = elements[1], c = elements[2];

     var length = Math.sqrt(a * a + b * b + c * c);

     if (length) {
         if (length == 1) {
             return this;
         } else {
             elements[0] = 0.0; 
             elements[1] = 0.0; 
             elements[2] = 0.0;
             return this;
         }
     }

     length = 1.0 / length;
     elements[0] = a * length;
     elements[1] = b * length;
     elements[2] = c * length;
     return this;
 };

 /**
 * Constructor of Vector4
 * If opt_src is specified, new vector is initialized by opt_src.
 * @param opt_src source vector(option)
 */
var Vector4 = function(vector) {
    var elements = new Float32Array(4);
    if (vector && typeof vector === 'object') {
        elements[0] = vector[0]; 
        elements[1] = vector[1]; 
        elements[2] = vector[2];
        elements[3] = vector[3];
    }

    this.elements = elements;
};