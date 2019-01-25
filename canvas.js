const ps = require('python-shell')

var currentCode = ''

var playerX = 50;
var playerY = 50;
var startX = 50;
var startY = 50;

var goalX = 0;
var goalY = 0;

var topCollision = false;
var bottomCollision = false;
var leftCollision = false;
var rightCollision = false;

var playerWidth = 50
var playerHeight = 50

var goalTheta = 0.1;

var lastRender = 0;

var level = 0;

var codeRunning = false;

let options = {
  mode: 'text',
  pythonOptions: ['-u'] // get print results in real-time
};

var maze = [];

function updateCode(text) {
  currentCode = text;
  playerX = 50;
  playerY = 50;
  console.log('Updating Code')
  var code = String("myX = " + playerX + "; myY = " + playerY + "; goalX = " + goalX + "; goalY = " + goalY + "\n" + currentCode + "\nprint(min(update()[0],20), min(update()[1],20))");
  ps.PythonShell.runString(code, options, function (err, results) {
    if(err) {
      alert(err);
    }
  });
}

function update(time) {
  if(!playerX) {
    playerX = 50;
    playerY = 50;
  }
  var code = String("myX = " + playerX + "; myY = " + playerY + "; goalX = " + goalX + "; goalY = " + goalY + "\n" + currentCode + "\nprint(min(update()[0],20), min(update()[1],20))")
  ps.PythonShell.runString(code, options, function (err, results) {
    if(err) {
      console.log(err);
    }
    // orbitGoal(time);

    results = results + ''
    var res = results.split(" ")
    // console.log(results)
    var vx = res[0]
    var vy = res[1]

    var validMove = true;

    var newX = playerX + (time/100) * vx;
    var newY = playerY + (time/100) * vy;

    for(var i = 0; i < maze.length; i++) {
      if(collidePlayer(newX, newY, maze[i]["x1"], maze[i]["y1"], (maze[i]["x2"] - maze[i]["x1"]), (maze[i]["y2"] - maze[i]["y1"]))) {
        console.log('collision');
        validMove = false
      }
    }
    if(validMove) {
      playerX = newX;
      playerY = newY;
    }
    console.log(collidePlayer(goalX, goalY, 50, 50))
    if(collidePlayer(playerX, playerY, goalX, goalY, 50, 50)) {
      level += 1;
      console.log('Next Level')
      document.getElementById("overlay").style.display="block";
      codeRunning = false;
      init()
    }

  });
}

function draw() {
  var canvas = document.getElementById("mycanvas");
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, 1000, 1000);
  ctx.fillStyle = "#000000";
  ctx.fillRect(playerX, playerY, 50, 50);
  ctx.fillStyle = "#FFFF00";
  ctx.fillRect(goalX, goalY, 50, 50);

  ctx.fillStyle = "#000000";
  for(var i = 0; i <  maze.length; i++) {
    ctx.fillRect(maze[i]["x1"], maze[i]["y1"], (maze[i]["x2"] - maze[i]["x1"]) + 3, (maze[i]["y2"] - maze[i]["y1"]) + 3);
  }
}

function orbitGoal(time) {
  goalTheta += (time/5000);
  var r = 300;
  goalX=r*Math.cos(goalTheta) + 400;
  goalY=r*Math.sin(goalTheta) + 400;
  // console.log(goalTheta);
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function collidePlayer(px, py, x,y,w,h) {
  return (px + playerWidth > x && px < x + w && py + playerHeight > y && py < y + h)
}

function init() {
  console.log(level)
  readTextFile("levels.json", function(text){
      var data = JSON.parse(text);
      console.log(data);
      console.log(data[level]);

      startX = data[level]['startX'];
      startY = data[level]['startY'];
      playerX = startX;
      playerY = startY;

      goalX = data[level]['goalX'];
      goalY = data[level]['goalY']

      maze = []
      for(var i = 0; i < data[level]["maze"].length; i++) {
        maze.push(data[level]["maze"][i]);
      }
  });
}

function loop(timestamp) {
  var time = timestamp - lastRender
  if(codeRunning) {
    update(time);
  }
  draw();
  lastRender = timestamp;
  window.requestAnimationFrame(loop);
}
window.onload = function() {
  init();
  currentCode = document.getElementById("code").innerHTML;
  window.requestAnimationFrame(loop);
}
