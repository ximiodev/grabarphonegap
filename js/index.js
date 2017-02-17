/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
       //~ document.getElementById("btnStart").addEventListener('click', startRecording, false);
        devicePlatform = device.platform;
		mostrarMensaje("so: "+devicePlatform.toUpperCase());
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccess, onError);
		if(devicePlatform.toUpperCase()=="IOS") {
			audioRecord = 'record.wav';
			window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, gotFS, fail);
			basePath_pg = getPhoneGapPath();
		} else {
			audioRecord = cordova.file.externalRootDirectory+'record.arm';
                
			basePath_pg = '/android_asset/www/';
		}
    }
};
function getPhoneGapPath() {
   var path = window.location.pathname;
   path = path.substr( path, path.length - 10 );
   return path;
};

function onSuccess(fileSystem) {
	console.log(fileSystem.name);
	//~ basePath_pg2 = fileSystem.name;
}
function onError(error) {
	console.log(error.code);
}
var superinterval;
var recorder = new Object;
recorder.stop = function() {
  window.plugins.audioRecorderAPI.stop(function(msg) {
    // success 
    alert('ok: ' + msg);
  }, function(msg) {
    // failed 
    alert('ko: ' + msg);
  });
}
recorder.record = function(seg) {
  window.plugins.audioRecorderAPI.record(function(msg) {
    // complete 
    //~ alert('ok: ' + msg);
    //~ recorder.playback();
    clearInterval(superinterval);
	uploadAudio(msg);
  }, function(msg) {
    // failed 
    alert('ko: ' + msg);
  }, seg); // record 30 seconds
  
  
  
  superinterval = setInterval(updateVisualizer, 100);
}
recorder.playback = function() {
  window.plugins.audioRecorderAPI.playback(function(msg) {
    // complete 
    alert('ok: ' + msg);
  }, function(msg) {
    // failed 
    alert('ko: ' + msg);
  });
}

var fileURL;
var audioRecord;
var counter;
var devicePlatform;
var timerDur;
var timerRe;
var basePath_pg;
var basePath_pg2;

function gotFS(fileSystem) {
	fileSystem.root.getFile(audioRecord, {
		create: true,
		exclusive: false
	}, gotFileEntry, fail);
}

function gotFileEntry(fileEntry) {
	fileURL = fileEntry.toURL();
}

function mostrarMensaje(msj)
{
	var cont = document.getElementById("responde");
	cont.innerHTML = msj;
}

function startRecording(duracion)
{
	var src = audioRecord;
	//~ myMedia = new Media(src, onSuccess, onError);
	//~ myMedia.startRecord();
	
	recorder.record(duracion);

	mostrarMensaje("Grabando...");
 }
function onSuccess() {
	console.log("Created Audio for Recording");
}
function onError(error) {
	alert('code: '    + error.code    + '\n' +
		  'message: ' + error.message + '\n');
	console.log(error);
}
function fail(error) {
	alert('code: '    + error.code    + '\n' +
		  'message: ' + error.message + '\n');
}
function stopRecording()
{
	myMedia.stopRecord();
	mostrarMensaje("Grabacion finalizada");
	//~ myMedia.play();
	uploadAudio();
	
}

function compartirW() {
	window.plugins.socialsharing.shareViaWhatsApp('Message via WhatsApp', null /* img */, urlToshare /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)})
}

function failFile(err) {
}
var urlToshare;
var uploadAudio = function (sonido) {
	mostrarMensaje("Uploading");
    var win = function (r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
        mostrarMensaje("Respuesta del server: "+r.response);
					
		$('#btn-step7-compartir').attr('href','whatsapp://send?text='+r.response);
		urlToshare = r.response;
		
		 audio = new Media(r.response,
				// success callback
				 function () { mostrarMensaje("playAudio():Audio Success");},
				// error callback
				 function (err) { mostrarMensaje(basePath_pg+mp3); }
		);

		audio.play();
		
		hideLoader();
		gotoSec('sec7');
		$('#btn-step6-1-grabar').removeClass('active');
		$('#btn-step6-2-grabar').removeClass('active');
		$('#btn-step7-compartir').click(function(e) {
			e.preventDefault();
			window.plugins.socialsharing.shareViaWhatsApp('Message via WhatsApp', null /* img */, urlToshare /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
		});
    }

    var fail = function (error) {
        mostrarMensaje("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = audioRecord;
    options.params = { 'devicePlatform': devicePlatform.toUpperCase()};
    options.headers = { Connection: "close" };

    var ft = new FileTransfer();
    var realPath;
    if(devicePlatform.toUpperCase()=="IOS") {
		realPath = sonido;
	} else {
		realPath = audioRecord;  
	}
    ft.upload(realPath, encodeURI("http://server2.newcycle.com.ar/process-ios.php"), win, fail, options);
	showLoader();
    //~ ft.upload(realPath, encodeURI("http://ximiodev.com/grabar/upload.php"), win, fail, options);
}

function getMediaURL(s) {
    if(device.platform.toLowerCase() === "android") return "/android_asset/www/" + s;
    return cordova.file.applicationDirectory + 'www/'+s;
}

function borrarArchivo(fileLoc) {
	console.log("remove file");
	var relativeFilePath = cordova.file.externalRootDirectory+fileLoc;
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
		fileSystem.root.getFile(relativeFilePath, {create:false}, function(fileEntry){
			fileEntry.remove(function(file){
				console.log("File removed!");
			},function(){
				console.log("error deleting the file " + error.code);
				});
			},function(){
				console.log("file does not exist");
			});
		},function(evt){
			console.log(evt.target.error.code);
	});
}
