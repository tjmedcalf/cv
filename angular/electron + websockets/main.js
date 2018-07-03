const settingsJson = require('./settings.json');
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

//require('electron-debug')({showDevTools: false, enabled: true});
//electronDebug{enabled: true};

let consoleWindow
let wallWindow

var isDev = (process.env.IS_DEV) ? process.env.IS_DEV : false;


require('electron-debug')({showDevTools: true, enabled: true});  


function createWindows() {
  setUpWindow(consoleWindow, `http://localhost:` + settingsJson.internalServerPort + settingsJson.console.url, settingsJson.console);
  setUpWindow(wallWindow, `http://localhost:` + settingsJson.internalServerPort + settingsJson.wall.url, settingsJson.wall);
}

function determineDisplayProperties(properties) {
  var ScreenService = electron.screen,
      displays = ScreenService.getAllDisplays(),
      externalDisplay;

  //get external display properties
  var externalDisplay = displays.find(function(display){
    return (display.bounds.x !== 0 || display.bounds.y !== 0)
  });

  //if external display and app need to be display on external screen
  if(externalDisplay && properties.displayOnExternalScreen){
    //center app vertically and horizontally if size is smaller than screen
    var deltaX = (properties.build.width < externalDisplay.bounds.width) ? (externalDisplay.bounds.width - properties.build.width)/2 : 0
    var deltaY = (properties.build.height < externalDisplay.bounds.height) ? (externalDisplay.bounds.height - properties.build.height)/2 : 0

    return{
      x: externalDisplay.bounds.x + deltaX,
      y: externalDisplay.bounds.y + deltaY
    }
  }
  //else set bounds to 0, 0 (main screen)
  else{
    return{
      x: 0,
      y: 0
    }
  }
}

function setUpWindow(windowObj, url, properties) {
  var baseSetting = (isDev) ? properties.dev: properties.build;

  var bounds = determineDisplayProperties( properties );

  windowObj = new BrowserWindow({
    width: baseSetting.width,
    height: baseSetting.height,
    frame: baseSetting.frame,
    enableLargerThanScreen: true,
    x: bounds.x,
    y: bounds.y,
    webPreferences: {
      zoomFactor: baseSetting.zoomFactor
    }
  })

  windowObj.setSize(baseSetting.width, baseSetting.height);

  windowObj.loadURL(url);
  windowObj.setMenuBarVisibility(false);
  windowObj.setFullScreen(baseSetting.fullscreen);

  windowObj.on('closed', function () {
    windowObj = null
  })
}

function getFileName(url) {
  return url.substring(url.lastIndexOf("/") + 1);
}


function copyFiles() {

  var http = require('http');
  var os = require('os');
  var fs = require('fs');

  var dirSeperaptor = '\\';

  if (os.platform() != 'win32') {
    dirSeperaptor = '/';
  }


  var getJSON = require('get-json')


  //Change the editpoint to the correct endpoint
  //"apiEndpoint": "http://master.akmu01w1.welldev/api/",
  //do two calls get medals and people.

  //console.log(settingsJson.apiEndpoint + 'Media/DownloadMedalphotos/');

  getJSON(settingsJson.apiEndpoint + 'Media/DownloadMedalphotos/', function (error, result) {

    for (i = 0; i < 2; i++) {
    //for (i = 0; i < result.length; i++) {
      fileUrl = result[i];

      fileName = getFileName(fileUrl);

       //console.log(fileName);

      filePath = app.getAppPath() + dirSeperaptor + settingsJson.imagePath + dirSeperaptor + fileName;

      //console.log('filePath: ', filePath);


      fs.stat(filePath, function (err, stat) {


          if (err != null) {


              file = fs.createWriteStream(err.path);

              request = http.get(fileUrl, function (response) {

                response.pipe(file, {end: false});
              });
          }
      });
    }

   // console.log(result);
  })



 /* getJSON(settingsJson.apiEndpoint + 'Media/DownloadPeoplephotos/', function (error, result) {

    for (i = 0; i < result.length; i++) {
      fileUrl = result[i];

      fileName = getFileName(fileUrl);

       //console.log(fileName);

      filePath = app.getAppPath() + dirSeperaptor + settingsJson.imagePath + dirSeperaptor + fileName;

     console.log(filePath);


      fs.stat(filePath, function (err, stat) {

        if (err != null) {

          file = fs.createWriteStream(err.path);

          request = http.get(fileUrl, function (response) {
            response.pipe(file);
          });


        }
      });
    }

   // console.log(result);
  })*/



}

//app.on('ready', copyFiles)
app.on('ready', createWindows)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }

})

// start server and sockets
require('./start-webserver.js')(settingsJson);