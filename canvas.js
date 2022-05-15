const canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');

// const constraints = {
//     video: {
//       width: {
//         min: 1280,
//         ideal: 1920,
//         max: 2560,
//       },
//       height: {
//         min: 720,
//         ideal: 1080,
//         max: 1440
//       },
//     }
//   };

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = "#1c1c1c";
ctx.fillRect(0, 0, canvas.width, canvas.height);