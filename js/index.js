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
        devicePlatform = device.platform;
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
       document.getElementById("btnStart").addEventListener('click', startRecording, false);
       document.getElementById("btnStop").addEventListener('click', stopRecording, false);
		window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, gotFS, fail);
        console.log('Received Event: ' + id);
		if(devicePlatform=="iOS") {
			audioRecord = 'record.wav';
		} else {
			audioRecord = 'record.mp3';
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

function startRecording()
{
	var src = audioRecord;
	myMedia = new Media(src, onSuccess, onError);
	myMedia.startRecord();
	alert("Started recording");
 }
function onSuccess() {
	console.log("Created Audio for Recording");
	uploadAudio();
}
function onError(error) {
	alert('code: '    + error.code    + '\n' +
		  'message: ' + error.message + '\n');
}
function fail(error) {
	alert('code: '    + error.code    + '\n' +
		  'message: ' + error.message + '\n');
}
function stopRecording()
{
	myMedia.stopRecord();
	alert("Stopped recording");
	myMedia.play();
	uploadAudio();
}

function failFile(err) {
}

var uploadAudio = function () {
    var win = function (r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
        var elemento = document.getElementById("responde");
        elemento.innerHTML = r.response;
    }

    var fail = function (error) {
        alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = "recordupload.wav";
    options.mimeType = "audio/wav";

    var ft = new FileTransfer();
    var realPath
    if(devicePlatform=="iOS") {
		realPath = fileURL;
	} else {
		realPath = cordova.file.externalRootDirectory+audioRecord;  
	}
	alert(realPath);
    ft.upload(realPath, encodeURI("http://ximiodev.com/grabar/upload.php"), win, fail, options);
}
