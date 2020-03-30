class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    //Separate variables for print coordinates & mouse tracking
    this.printX = x * DRAWFACTOR;
    this.printY = y * DRAWFACTOR;
    this.isVisited = false;
    this.isStart = false;
    this.isEnd = false;
    this.isWall = false;
    this.distance = INFINITY; //In Dijkstra's algorithm, every node initializes with a distance of infinity
    this.previous = undefined; //Every node points to the "previous" node in the traversal
    this.isPath = false;
  }
}

class Grid {
  constructor() {
    this.startAlgo = false;
    this.array = [];
    for (let i = 0; i < NUMCOLS; i++) { //Initializing 2d array of nodes
      this.array[i] = [];
      for (let j = 0; j < NUMROWS; j++) {
        this.array[i][j] = new Node(i, j);
      }
    }
    this.endFound = false;
    this.pathDrawn = false;
    this.impossible = false;
    //Setting default start and end nodes
    this.startNode = this.array[8][12];
    this.startNode.isStart = true;
    this.endNode = this.array[30][18];
    this.endNode.isEnd = true;

    this.startTime = undefined;
    this.time = undefined;
    this.timeFound = false;

    this.startNodePickedUp = false;
    this.endNodePickedUp = false;

    this.nowNode = undefined; //Used to find path after the algorithm is finished

    this.unvisited = []; //Array of unvisited nodes
    for (let i = 0; i < NUMCOLS; i++) {
      for (let j = 0; j < NUMROWS; j++) {
        append(this.unvisited, this.array[i][j]);
      }
    }

    this.startNode.distance = 0;

    this.currentNode = this.startNode; //Start at the start node
    this.neighbours = []; //Array of neighbouring nodes
  }

  drawGrid() {
    fill(249, 200, 200);
    rectMode(CENTER);
    rect(width/2, 20, 900, 100);
    fill(62, 2, 2);
    text("Pathfinding Algorithm Visualization", width/2, 50);
    push();
    //Translating to center everything
    translate(TRANSLATEFACTOR, TRANSLATEFACTOR);
    noStroke();
    for (let i = 0; i < NUMCOLS; i++) {
      for (let j = 0; j < NUMROWS; j++) { //Change node color based on its function
        if (this.array[i][j].isStart) {
          fill(221, 95, 108, DRAWOPACITY);
        } else if (this.array[i][j].isEnd) {
          fill(245, 131, 70, DRAWOPACITY);
        } else if(this.array[i][j].isWall){
          fill(68, 139, 167, DRAWOPACITY);
        }else if (this.array[i][j].isVisited) {
          fill(178, 224, 230, DRAWOPACITY/2);
        } else {
          fill(240, DRAWOPACITY);
        }

        if (this.array[i][j].isPath) {
          fill(252, 215, 137);
        }
        rectMode(CENTER);
        rect(this.array[i][j].printX, this.array[i][j].printY, DRAWFACTOR, DRAWFACTOR);
      }
    }
    pop();
  }
  doDijkstra() {
    for(let it = 0; it < 3; it++){ //Run 3x per frame to get smooth animations
      if (this.unvisited.length > 0) { //Run the algorithm while not all nodes have been visited
        if(this.currentNode.isEnd){ //If we find the end node, stop
          this.endFound = true;
          this.nowNode = this.endNode.previous;
          break;
        }else if(this.currentNode.isWall){ //If we bump into a wall, go around it
          this.currentNode = this.unvisited.shift();
          continue;
        }else if(this.currentNode.distance == INFINITY){
          //If our current node has a distance of infinity, we must be trapped, so the path is impossible
          this.impossible = true;
          continue;
        }
        this.currentNode.isVisited = true;

        //Make sure to account for edge nodes
        if (this.currentNode.x + 1 < 40) {
          append(this.neighbours, this.array[this.currentNode.x + 1][this.currentNode.y]);
        }
        if (this.currentNode.y + 1 < 30) {
          append(this.neighbours, this.array[this.currentNode.x][this.currentNode.y + 1]);
        }
        if (this.currentNode.x - 1 >= 0) {
          append(this.neighbours, this.array[this.currentNode.x - 1][this.currentNode.y]);
        }
        if (this.currentNode.y - 1 >= 0) {
          append(this.neighbours, this.array[this.currentNode.x][this.currentNode.y - 1]);
        }
        for (let i = 0; i < this.neighbours.length; i++) { //Traverse neighbors and figure out which node has lowest distance
          let temp = this.currentNode.distance + 1;
          if (temp < this.neighbours[i].distance) {
            this.neighbours[i].distance = temp;
            this.neighbours[i].previous = this.currentNode;
          }
        }
        this.neighbours = [];
        this.sortUnvisited(); //Important: sort array of unvisited nodes
        this.currentNode = this.unvisited.shift();
      }
    }
  }
  sortUnvisited() {
    this.unvisited.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }
  findPath(){
    if(this.nowNode != this.startNode){ //Traverse path until we reach start node
      this.nowNode.isPath = true;
      this.nowNode = this.nowNode.previous;
    }else{
      this.pathDrawn = true;
    }
  }
  setStart(node){ //Functions to set the start and end nodes
    this.startNode = node;
    node.isStart = true;
    node.distance = 0;
    this.currentNode = node;
  }setEnd(node){
    this.endNode = node;
    node.isEnd = true;
  }
}
