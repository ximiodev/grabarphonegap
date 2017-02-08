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
       document.getElementById("btnStart").addEventListener('click', startRecording, false);
		window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, gotFS, fail);
        devicePlatform = device.platform;
		mostrarMensaje("so: "+devicePlatform.toUpperCase());
		if(devicePlatform.toUpperCase()=="IOS") {
			audioRecord = 'record.wav';
		} else {
			audioRecord = 'record.arm';
		}
    }
};
var fileURL;
var audioRecord;
var devicePlatform;

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

function startRecording()
{
	var src = audioRecord;
	myMedia = new Media(cordova.file.externalRootDirectory+src, onSuccess, onError);
	myMedia.startRecord();
	setTimeout(function(){ stopRecording(); }, 10000);
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
	myMedia.play();
	uploadAudio();
}

function failFile(err) {
}

var uploadAudio = function () {
	mostrarMensaje("Uploading");
    var win = function (r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
        mostrarMensaje("Respuesta del server: "+r.response);
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

    var ft = new FileTransfer();
    var realPath;
    if(devicePlatform.toUpperCase()=="IOS") {
		realPath = fileURL;
	} else {
		realPath = cordova.file.externalRootDirectory+audioRecord;  
	}
    ft.upload(realPath, encodeURI("http://ximiodev.com/grabar/upload.php"), win, fail, options);
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
