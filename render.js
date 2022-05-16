var image = new Image();

image.onload = function() {
    console.log("image loaded");
}

image.crossOrigin = 'anonymous';
image.src = "https://picsum.photos/400/600";


/* const video = document.getElementById('video');

const constraints = {
    audio: true,
    video: {
        width: 1280, height: 720
    }
};

// Access webcam
async function init() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    } catch (e) {
        console.log("Error: " + e);
    }
}

var canDisplay = false;
// Success
function handleSuccess(stream) {
    window.stream = stream;
    video.srcObject = stream;
    canDisplay = true;
    draw();
}

// Load init
init();

//Draw the video on the canvas each frame if the video is loaded
function draw() {
  if (canDisplay && window.stream) {
    let exponant = 1.6;
    let resolution = {
      width: 850 * exponant,
      height: 480 * exponant,
    };
    let pos = {
      x: (canvas.width / 2) - (resolution.width / 2),
      y: (canvas.height / 2) - (resolution.height / 2)
    }
    ctx.drawImage(video, pos.x, pos.y, resolution.width, resolution.height);
    requestAnimationFrame(draw);
  }
} */

// if (stream != null) {
//   ctx.drawImage(video, 0, 0, 640, 480);
// }

// Draw image
// snap.addEventListener("click", function() {
//   ctx.drawImage(video, 0, 0, 640, 480);
// });

var video, imageData, detector;
let exponant = 0.5;
        let resolution = {
          width: 640 * exponant,
          height: 480 * exponant,
        };
        let pos = {
          x: (canvas.width / 2) - (resolution.width / 2),
          y: (canvas.height / 2) - (resolution.height / 2)
        }
var globalPicture = {
        UpLeft: [],
        UpRight: [],
        DownLeft: [],
        DownRight: []
    };
const constraints = {
  video: {
    facingMode: {
      exact: "environment"
    }
  }
};
  
    function onLoad(){
      video = document.getElementById("video");
    
      canvas.width = parseInt(canvas.style.width);
      canvas.height = parseInt(canvas.style.height);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.fillStyle = "#1c1c1c";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }
      
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
          var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
          
          if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
          }

          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        }
      }
      
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
          if ("srcObject" in video) {
            video.srcObject = stream;
          } else {
            video.src = window.URL.createObjectURL(stream);
          }
        })
        .catch(function(err) {
          console.log(err.name + ": " + err.message);
        }
      );
        
      detector = new AR.Detector({
        dictionaryName: 'ARUCO'
      });

      requestAnimationFrame(tick);
    }
    
    function tick(){
      requestAnimationFrame(tick);
      
      if (video.readyState === video.HAVE_ENOUGH_DATA){
        snapshot();

        var markers = detector.detect(imageData);
        drawCorners(markers);
        drawId(markers);
        drawImage(markers);
      }
    }

    function snapshot(){
        ctx.drawImage(video, pos.x, pos.y, resolution.width, resolution.height);
        imageData = ctx.getImageData(pos.x, pos.y, resolution.width, resolution.height);
    }
          
    function drawCorners(markers){
      var corners, corner, i, j;
    
      ctx.lineWidth = 3;

      for (i = 0; i !== markers.length; ++ i){
        corners = markers[i].corners;
        
        ctx.strokeStyle = "red";
        ctx.beginPath();
        
        for (j = 0; j !== corners.length; ++ j){
          corner = corners[j];
        //   corner.x = corner.x + pos.x;
        //   corner.y = corner.y + pos.y;
          ctx.moveTo(corner.x + pos.x, corner.y + pos.y);
          corner = corners[(j + 1) % corners.length];
          ctx.lineTo(corner.x + pos.x, corner.y + pos.y);
        }

        ctx.stroke();
        ctx.closePath();
        
        // ctx.strokeStyle = "green";
        // ctx.strokeRect(corners[0].x - 2, corners[0].y - 2, 4, 4);
      }
    }
      
      function drawId(markers){
        var corners, corner, x, y, i, j;
        
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 1;
        
        for (i = 0; i !== markers.length; ++ i){
          corners = markers[i].corners;
          
          x = Infinity;
          y = Infinity;
          
          for (j = 0; j !== corners.length; ++ j){
            corner = corners[j];
            
            x = Math.min(x, corner.x + pos.x);
            y = Math.min(y, corner.y + pos.y);
          }
      
          ctx.strokeText(markers[i].id, x, y)
        }
      }

    window.onload = onLoad;

function drawImage(markers){
    var corners, corner, x, y, i, j;
    for (i = 0; i !== markers.length; ++ i){
        corners = markers[i].corners;
        
        switch (markers[i].id) {
            case 17:
                globalPicture.UpLeft = corners[0];
                break;
            
            case 117:
                globalPicture.UpRight = corners[1];
                break;

            case 101:
                globalPicture.DownLeft = corners[2];
                break;

            case 105:
                globalPicture.DownRight = corners[3];
                break;
        
            default:
                break;
        }

        // for (j = 0; j !== corners.length; ++ j){
        //     corner = corners[j]; 
        //   }
    }

    var ctx = canvas.getContext("2d");
    var p = new Perspective(ctx, image);
    p.draw([
        [globalPicture.UpLeft.x + pos.x, globalPicture.UpLeft.y + pos.y],
        [globalPicture.UpRight.x + pos.x, globalPicture.UpRight.y + pos.y],
        [globalPicture.DownLeft.x + pos.x, globalPicture.DownLeft.y + pos.y],
        [globalPicture.DownRight.x + pos.x, globalPicture.DownRight.y + pos.y]
        ]);
    console.log(globalPicture);

    // p.draw([
    //     [0, 0],
    //     [100, 10],
    //     [globalPicture.DownLeft.x, globalPicture.DownLeft.y],
    //     [10, 100]
    //     ]);
}