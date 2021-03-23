// HelloCanvas.js
// import * as utils from './utils.js'
import {getWebGLContext} from './utils'

main();

function main() {
    // Retrieve the <canvas> element
    var canvas = document.getElementById("webgl");

    if (!canvas) {
        console.log("Failed to retrieve the <canvas> element");
        return false;
    }

    var gl = getWebGLContext(canvas);

    gl.clearColor(0.4, 0.6, 0.9, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);
}