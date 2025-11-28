const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#FF0000'; // Set color to red
ctx.fillRect(0, 0, 1, 1); // Draw rectangle
ctx.fillStyle = '#00FF00'; // Set color to red
ctx.fillRect(1, 0, 1, 1); // Draw rectangle
ctx.fillStyle = '#0000FF'; // Set color to red
ctx.fillRect(2, 0, 1, 1); // Draw rectangle


// Convert canvas to data URL
const imageData = canvas.toDataURL('image/png');

// Link to download image
const downloadLink = document.getElementById('downloadLink');
downloadLink.href = imageData;