let imageTemp = new Image();
document.addEventListener("keydown", (event) => {
    if (event.keyCode == 32) {
        console.log("Space");
        imageTemp.src = "https://picsum.photos/400/600";
        image.src = imageTemp.src;
    }
});

function myFunction() {

  switch (event.key) {
    case "ArrowDown":
    	console.log("ArrowDown");
      break;
    case "ArrowUp":
      console.log("ArrowUp");
      break;
    case "ArrowLeft":
      console.log("ArrowLeft");
      break;
    case "ArrowRight":
      console.log("ArrowRight");
      break;
    default:
      console.log(event.key, event.keyCode);
      return; 
  }

  event.preventDefault();
}