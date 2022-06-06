var image = new Image();
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
let cornerId = {
        UpLeft: 17,
        UpRight: 117,
        DownLeft: 105,
        DownRight: 101
};

//Pick an random image
image.onload = function() {
  console.log("image loaded");
}

image.crossOrigin = 'anonymous';
image.src = "https://picsum.photos/400/600";

  function onLoad(){
    video = document.getElementById("video");
  
    canvas.width = parseInt(canvas.style.width);
    canvas.height = parseInt(canvas.style.height);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = "#fff";//"#1c1c1c";
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
    
    if(navigator.userAgentData.mobile) GetMediaToSetVideo(constraints);
    else GetMediaToSetVideo({ video: true });
      
    detector = new AR.Detector({
      dictionaryName: 'ARUCO'
    });

    requestAnimationFrame(tick);
  }

  function GetMediaToSetVideo(mediaConstraints) {
    navigator.mediaDevices
        .getUserMedia(mediaConstraints)
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
  }
  
  function tick(){
    requestAnimationFrame(tick);
    
    if (video.readyState === video.HAVE_ENOUGH_DATA){
      snapshot();

      var markers = detector.detect(imageData);
      //drawCorners(markers);
      //drawId(markers);
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
    
  //Debug
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

  //Initialization here of those variable to make them public
  let missingCorners, presentCorners = [];
  let cornerMarker = [];
  function drawImage(markers){
      var corners, corner, x, y, i, j;
      missingCorners = [cornerId.UpLeft, cornerId.UpRight, cornerId.DownLeft, cornerId.DownRight]; //Remove the corners from the list when the corner has been found
      
      //Loop through the marker to find the one with the correct id
      for (i = 0; i !== markers.length; ++ i){
          corners = markers[i].corners;
          
          switch (markers[i].id) {
              case cornerId.UpLeft:
                  globalPicture.UpLeft = corners[0];
                  presentCorners.push(markers[i], cornerId.UpLeft);
                  cornerMarker[0] = markers[i];
                  missingCorners.splice(missingCorners.indexOf(cornerId.UpLeft), 1);
                  break;
              
              case cornerId.UpRight:
                  globalPicture.UpRight = corners[1];
                  presentCorners.push(markers[i], cornerId.UpRight);
                  cornerMarker[1] = markers[i];
                  missingCorners.splice(missingCorners.indexOf(cornerId.UpRight), 1);
                  break;

              case cornerId.DownRight:
                  globalPicture.DownLeft = corners[2];
                  presentCorners.push(markers[i], cornerId.DownRight);
                  cornerMarker[2] = markers[i];
                  missingCorners.splice(missingCorners.indexOf(cornerId.DownRight), 1);
                  break;

              case cornerId.DownLeft:
                  globalPicture.DownRight = corners[3];
                  presentCorners.push(markers[i], cornerId.DownLeft);
                  cornerMarker[3] = markers[i];
                  missingCorners.splice(missingCorners.indexOf(cornerId.DownLeft), 1);
                  break;
          
              default:
                  break;
          }
      }

      // Test if missing one corner to make a predinction of its position
      if (missingCorners.length === 1) {

          let missingCorner;
          switch (missingCorners[0]) {
              case cornerId.UpLeft:
                  missingCorner = 0;
                  break;
              
              case cornerId.UpRight:
                  missingCorner = 1;
                  break;

              case cornerId.DownRight:
                  missingCorner = 2;
                  break;

              case cornerId.DownLeft:
                  missingCorner = 3;
                  break;
          }

          //Search for the markers before and after the missing one
          let nextCorner = missingCorner + 1;
          let prevCorner = missingCorner - 1;

          if (nextCorner > 3) nextCorner = 0;
          if (prevCorner < 0) prevCorner = 3;

          let nextMarker = cornerMarker[nextCorner];
          let prevMarker = cornerMarker[prevCorner];

          let meetingPoint = getMeetingPoint([prevMarker.corners[prevCorner].x,
                          prevMarker.corners[prevCorner].y,
                          prevMarker.corners[missingCorner].x,
                          prevMarker.corners[missingCorner].y
                          ],
                          [nextMarker.corners[nextCorner].x,
                          nextMarker.corners[nextCorner].y,
                          nextMarker.corners[missingCorner].x,
                          nextMarker.corners[missingCorner].y]);

          
          switch (missingCorner) {
              case 0:
                  globalPicture.UpLeft.x = meetingPoint[0];
                  globalPicture.UpLeft.y = meetingPoint[1];
                  break;

              case 1:
                  globalPicture.UpRight.x = meetingPoint[0];
                  globalPicture.UpRight.y = meetingPoint[1];
                  break;

              case 2:
                  globalPicture.DownLeft.x = meetingPoint[0];
                  globalPicture.DownLeft.y = meetingPoint[1];
                  break;

              case 3:
                  globalPicture.DownRight.x = meetingPoint[0];
                  globalPicture.DownRight.y = meetingPoint[1];
                  break;
          }
      }

      // Draw the image unless there is no corners
      if (missingCorners.length !== 4) {
        var ctx = canvas.getContext("2d");
        var p = new Perspective(ctx, image);
        try {
          p.draw([
            [globalPicture.UpLeft.x + pos.x, globalPicture.UpLeft.y + pos.y],
            [globalPicture.UpRight.x + pos.x, globalPicture.UpRight.y + pos.y],
            [globalPicture.DownLeft.x + pos.x, globalPicture.DownLeft.y + pos.y],
            [globalPicture.DownRight.x + pos.x, globalPicture.DownRight.y + pos.y]
            ]);
        } finally {
          
        }
      }
  }


window.onload = onLoad;