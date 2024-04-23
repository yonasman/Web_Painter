// Get canvas element
let canvas = document.getElementById("draw");

// Get canvas context
let cxt = canvas.getContext('2d');

// Initialize canvas size
resize();

// Flag for controlling the new session position
let isNewSession = true;

// Event listeners
window.addEventListener("resize", resize);
document.addEventListener("mousemove", draw);
document.addEventListener("mousedown", setPosition);
document.addEventListener("mouseenter", setPosition);
document.addEventListener('mousedown', () => {
    isNewSession = true;
    // Reset position for a new session
    pos = {x: e.clientX , y: e.clientY};
});

// Function to resize the canvas
function resize() {
    cxt.canvas.width = window.innerWidth;
    cxt.canvas.height = window.innerHeight;
}

// Function to set the position
// function setPosition(e) {
//     if (isNewSession) {
//         pos.x = e.clientX;
//         pos.y = e.clientY;
//         isNewSession = false;
//     } else {
//         pos.x = e.clientX;
//         pos.y = e.clientY;
//     }
// }
function setPosition(e) {
    // Set the position of the drawing to the current mouse position
    pos.x = e.clientX;
    pos.y = e.clientY;

    // Update isNewSession flag if necessary
    if (isNewSession) {
        isNewSession = false;
    }
}


// Last known position
let pos = { x: 0, y: 0 };

// Array for storing the drawing data
let drawing = [];

// Drawing function
function draw(e) {
    if (e.buttons !== 1) return;  // Return if any other button pressed other than left

    let color = document.getElementById('hex').value; // Get the hex element
    let lWidth = document.getElementById('width').value; // Get the line width
    let lCap = document.getElementById('cap').value; // Get line cap

    cxt.beginPath(); // Begin drawing
    cxt.lineWidth = lWidth; // Width of the line
    cxt.lineCap = lCap; // Rounded end cap
    cxt.strokeStyle = color; // Color of line

    if (drawing.length === 0 || isNewSession) {
        cxt.moveTo(pos.x, pos.y); // From position
    } else {
        cxt.moveTo(drawing[drawing.length - 1].x2, drawing[drawing.length - 1].y2); // Continue from last point
    }

    // Set the new position
    setPosition(e);
    const x2 = e.clientX;
    const y2 = e.clientY;

    // Draw line to the new position
    cxt.lineTo(x2, y2);
    cxt.stroke();

    // Update the position
    pos.x = x2;
    pos.y = y2;

    const drawingData = {
        x1: drawing.length === 0 || isNewSession ? pos.x : drawing[drawing.length - 1].x2,
        y1: drawing.length === 0 || isNewSession ? pos.y : drawing[drawing.length - 1].y2,
        x2: x2,
        y2: y2,
        color: color,
        lineWidth: lWidth,
        lineCap: lCap
    };
    drawing.push(drawingData);

    // Store drawing data to local storage
    localStorage.setItem('drawing', JSON.stringify(drawing));
}

// Function to redraw stored drawings
function redrawStoreDrawing() {
    let storedDrawing = localStorage.getItem('drawing');
    if (storedDrawing) {
        drawing = JSON.parse(storedDrawing);
        cxt.clearRect(0, 0, canvas.width, canvas.height);
        for (const ele of drawing) {
            cxt.beginPath();
            cxt.moveTo(ele.x1, ele.y1);
            cxt.lineTo(ele.x2, ele.y2);
            cxt.strokeStyle = ele.color;
            cxt.lineWidth = ele.lineWidth;
            cxt.lineCap = ele.lineCap;
            cxt.stroke();
        }
    }
}

// Call redrawStoreDrawing function when window loads
window.onload = redrawStoreDrawing;

// Clearing the drawing
let clearButton = document.getElementById("clear");
clearButton.addEventListener('click', clearDrawing);

// Function to clear drawing
function clearDrawing() {
    drawing = []; // Clearing drawing array
    localStorage.clear(); // Clear the local storage
    // Clear the canvas
    cxt.clearRect(0, 0, canvas.width, canvas.height);
}