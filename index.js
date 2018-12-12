const { app, BrowserWindow } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

const Store = require('electron-store');
const store = new Store();

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 1000, height: 1200, frame: false, titleBarStyle: 'hidden'})
  // win.setMenu(null)
  // and load the index.html of the app.
  if(store.get("started") == 'yes') {
    win.loadFile('index.html');
  } else {
    win.loadFile('intro.html');
  }

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
    app.quit()
  // }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
function runPython(text, out, nextID, check) {
  const ps = require('python-shell')

  let options = {
    mode: 'text',
    pythonPath: '/usr/bin/python2.7',
    pythonOptions: ['-u'] // get print results in real-time
  };

  var exec = require('child_process').exec;
var child = exec('python -u test.py',
  function(error, stdout, stderr) {
    console.log('stdout: ', stdout);
    console.log('stderr: ', stderr);
    if (error !== null) {
      console.log('exec error: ', error);
    }
});

  ps.PythonShell.runString(text, options, function (err, results) {
    if (err) {
      document.getElementById(out).style.color = 'red';
      document.getElementById(out).innerHTML = (' <br> ' + err);
      throw err;
    }
    console.log('finished');
    console.log(results);

    document.getElementById(out).innerHTML = '';
    var i;
    if(!results) {
      return;
    }
    document.getElementById(out).style.color = 'black';
    for(i = 0; i < results.length; i++) {

      document.getElementById(out).innerHTML += (results[i] + ' <br>');
    }
    var passed = check(text, document.getElementById(out).innerHTML);
    console.log('passed: ' + passed)
    if(passed) {
      document.getElementById(nextID).hidden= false;
    } else {
      document.getElementById(out).innerHTML += (' <br> ' + 'Hmm, that doesn\'t seem to be what we\'re asking for');
    }
  });
}

function setLevel(level) {
  store.set('level', level);
  store.set('started', true);
}
