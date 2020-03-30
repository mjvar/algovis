// To add:
// >blinking nodes once finished
// >animate path
// >add walls
// >add ability to move
// >add runtime

//178, 224, 230 Light teal
//68, 139, 167 Dark teal
//245, 165, 164 Light pink
//221, 95, 108 Dark pink
//252, 215, 137 Orange
//245, 131, 70 Darker orange

//Setting global constants for use in the algo
NUMROWS = 30;
NUMCOLS = 40;
CWIDTH = 800;
CHEIGHT = 600;
//Just some visual things
DRAWFACTOR = CHEIGHT/30;
TRANSLATEFACTOR = DRAWFACTOR/2 + 75;
DRAWOPACITY = 40;
//p5.js has no INFINITY constant, so we set it to an arbitrarily high value
INFINITY = 100000;

function setup() {
  createCanvas(CWIDTH + 150, CHEIGHT + 150);
  frameRate(120);
  startApp();
  textFont("Roboto Slab");
}

function draw() {
  //Draw the grid of nodes every frame
  grid.drawGrid();
  if(grid.impossible){ //If the path is impossible, let the user know
    printFail();
  }else if(!grid.endFound && grid.startAlgo && !grid.impossible){
    //If the end had not been found AND the algorithm has started AND the path is still possible, run Dijkstra
    grid.doDijkstra();
  }else if(grid.startAlgo && !grid.pathDrawn){ //If the end has been found, find a path back until the path is complete
    grid.findPath();
  }else if(grid.pathDrawn){ //Print runtime once the path is drawn
    printFinish();
  }
}

function startApp(){
  //Create a grid of nodes
  grid = new Grid();
  background(249, 200, 200);
  fill(62, 2, 2);
  noStroke();
  textSize(36);
  textAlign(CENTER);
  textCount = 0;
}

function printFail(){
  //Prints a message in typewriter style
  if(frameCount % 3 == 0){
    failMsg = "No possible paths found!";
    sub = failMsg.substring(0, textCount);
    rectMode(CENTER);
    fill(249, 200, 200);
    rect(width/2, 724, 900, 100);
    fill(62, 2, 2);
    text(sub, width/2, 724);
    console.log(sub);
    if(textCount < 24) textCount++;
  }
}

function printFinish(){
  if(!grid.timeFound){ //Figure out the runtime first
    grid.time = round(millis() - grid.startTime);
    grid.timeFound = true;
  }
  if(frameCount % 3 == 0){
    //Prints a message in typewriter style
    finishMsg = "Shortest path found in " + grid.time + " milliseconds!";
    sub = finishMsg.substring(0, textCount);
    rectMode(CENTER);
    fill(249, 200, 200);
    rect(width/2, 724, 900, 100);
    fill(62, 2, 2);
    text(sub, width/2, 724);
    console.log(sub);
    if(textCount < 42) textCount++;
  }
}

function keyPressed(){
  if(keyCode == ENTER){ //Start the algorithm and note the start time
    grid.startAlgo = true;
    grid.startTime = millis();
  }else if(key == ' '){ //Restart the web app
    startApp();
  }
}

function mouseDragged(){ //Draw walls when mouse is dragged
  if(!grid.array[round((mouseX - TRANSLATEFACTOR)/DRAWFACTOR)][round((mouseY - TRANSLATEFACTOR)/DRAWFACTOR)].isWall && !grid.startAlgo && !grid.startNodePickedUp && !grid.endNodePickedUp)
    grid.array[round((mouseX - TRANSLATEFACTOR)/DRAWFACTOR)][round((mouseY - TRANSLATEFACTOR)/DRAWFACTOR)].isWall = true;
}

function mousePressed(){ //Enables users to move start and end points
  if (grid.array[round((mouseX - TRANSLATEFACTOR)/DRAWFACTOR)][round((mouseY - TRANSLATEFACTOR)/DRAWFACTOR)].isStart && !grid.startAlgo) {
    grid.array[round((mouseX - TRANSLATEFACTOR)/DRAWFACTOR)][round((mouseY - TRANSLATEFACTOR)/DRAWFACTOR)].isStart = false;
    grid.array[round((mouseX - TRANSLATEFACTOR)/DRAWFACTOR)][round((mouseY - TRANSLATEFACTOR)/DRAWFACTOR)].distance = INFINITY;
    grid.startNodePickedUp = true;
  } else if (grid.array[round((mouseX - TRANSLATEFACTOR)/DRAWFACTOR)][round((mouseY - TRANSLATEFACTOR)/DRAWFACTOR)].isEnd && !grid.startAlgo) {
    grid.array[round((mouseX - TRANSLATEFACTOR)/DRAWFACTOR)][round((mouseY - TRANSLATEFACTOR)/DRAWFACTOR)].isEnd = false;
    grid.endNodePickedUp = true;
  }
}

function mouseReleased(){ //Enables users to move start and end points
  if (grid.startNodePickedUp && !grid.startAlgo) {
    grid.startNodePickedUp = false;
    grid.setStart(grid.array[round((mouseX - TRANSLATEFACTOR)/DRAWFACTOR)][round((mouseY - TRANSLATEFACTOR)/DRAWFACTOR)]);
  } else if (grid.endNodePickedUp && !grid.startAlgo) {
    grid.setEnd(grid.array[round((mouseX - TRANSLATEFACTOR)/DRAWFACTOR)][round((mouseY - TRANSLATEFACTOR)/DRAWFACTOR)]);
    grid.endNodePickedUp = false;
  }
}
