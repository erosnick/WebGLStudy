// DrawRectangle.js
function main() {
    // Retrieve the <canvas> element
    var canvas = document.getElementById("example");

    if (!canvas) {
        console.log("Failed to retrieve the <canvas> element");
        return false;
    }

    // Get the rendering context for 2D CG
    var context = canvas.getContext("2d");

    // Draw a blue rectangle
    context.fillStyle = 'rgba(0, 0, 255, 1.0';  // Set a blue color
    context.fillRect(120, 10, 150, 150);        // Fill a rectangle with the color
}