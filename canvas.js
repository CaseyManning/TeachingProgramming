const ps = require('python-shell')

var currentCode = ''

var playerX = 50;
var playerY = 50;

var goalX = 500;
var goalY = 500;

var goalTheta = 0.1;

var lastRender = 0;

let options = {
  mode: 'text',
  pythonOptions: ['-u'] // get print results in real-time
};

function updateCode(text) {
  currentCode = text;
  playerX = 50;
  playerY = 50;
  console.log('Updating Code')
  var code = String("myX = " + playerX + "; myY = " + playerY + "; goalX = " + goalX + "; goalY = " + goalY + "\n" + currentCode + "\nprint(min(update()[0],10), min(update()[1],10))");
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
  var code = String("myX = " + playerX + "; myY = " + playerY + "; goalX = " + goalX + "; goalY = " + goalY + "\n" + currentCode + "\nprint(min(update()[0],10), min(update()[1],10))")
  ps.PythonShell.runString(code, options, function (err, results) {
    if(err) {
      console.log(err);
    }
    orbitGoal(time);

    results = results + ''
    var res = results.split(" ")
    // console.log(results)
    var vx = res[0]
    var vy = res[1]

    playerX += (time/100) * vx;
    playerY += (time/100) * vy;
    // console.log("velocity ");
    // console.log(vx, vy);
    // console.log("position");
    // console.log(playerX, playerY);
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
}

function orbitGoal(time) {
  goalTheta += (time/5000);
  var r = 300;
  goalX=r*Math.cos(goalTheta) + 400;
  goalY=r*Math.sin(goalTheta) + 400;
  // console.log(goalTheta);
}

function loop(timestamp) {
  var time = timestamp - lastRender

  update(time)
  draw()
  lastRender = timestamp
  window.requestAnimationFrame(loop)
}
window.onload = function() {
  currentCode = document.getElementById("code").innerHTML;
  window.requestAnimationFrame(loop)
}
