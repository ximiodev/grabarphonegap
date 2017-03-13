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
		//~ if(devicePlatform.toUpperCase()=="IOS") {
		if(1) {
			
			audioRecord = 'record.wav';
				
			
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccess, onError);
			window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, gotFS, fail);
			basePath_pg = getPhoneGapPath();
			basePath_pg = '';
			
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
	basePath_pg2 = fileSystem.name;
}

var superinterval;



var fileURL;
var audioRecord;
var counter;
var devicePlatform;
var timerDur;
var timerRe;
var basePath_pg;
var basePath_pg2;
var myMedia;

function gotFS(fileSystem) {
	fileSystem.root.getFile(audioRecord, {
		create: true,
		exclusive: false
	}, gotFileEntry, failo);
}

function gotFileEntry(fileEntry) {
	
	fileURL = fileEntry.toURL();
	myMedia = new Media(fileURL, onSuccess, onErrorF);
	myMedia.startRecord();
	myMedia.stopRecord();
	myMedia.release();
	mostrarMensaje(fileURL);
	//~ alert(fileURL);
}

function mostrarMensaje(msj)
{
	var cont = document.getElementById("responde");
	cont.innerHTML = msj;
}

var posic = 0;
var elaudioBK;

function actualizarTema() {
	posic++;
	mostrarMesaje("pasas: "+posic);
}

function startRecording(duracion)
{
	var src = audioRecord;
	isRecording = true;
	
	myMedia = new Media(audioRecord, onSuccess, onError);
	myMedia.startRecord();
	tiempoTranscurrido = 0;
	
	superinterval = setInterval(function() {
		window.updateVisualizer();
	},100);
	
	mostrarMensaje("Grabando... sad");
	
	
 }
 var isRecording = false;
 var tiempoTranscurrido = 0;
 
function resetGrabacion() {
	myMedia.stopRecord();
	console.log("reset");
	isRecording = false;
	mostrarMensaje("Grabacion finalizada");
	$('#sec6-1-player-equelizer').html('');
	$('#sec6-2-player-equelizer').html('');
	$('#sec6-1-title').css({"display":"block"});
	$('#subtitles').css({"display":"none"});
	$('#btn-step6-1-regrabar').addClass('hidden');
	$('#btn-step6-2-regrabar').addClass('hidden');
	$('#btn-step6-1-grabar').removeClass('hidden');
	$('#btn-step6-2-grabar').removeClass('hidden');
	$('#btn-step6-1-grabar').removeClass('active');
	$('#btn-step6-2-grabar').removeClass('active');
	
	$('.circleBallTim').css({left:'0%'});
	for(var i=0;i<16;i++){
		$('#bar-'+i).height(5);
	}
	duracion = 0;
	if(isFinlaPlay) {
		
		isFinlaPlay = false;
		$('#btn-step7-play').html('<img src="imgs/ico-play.png">');
		finalAudio.stop();
	}
	clearInterval(superinterval);
	clearInterval(timerDur);
	clearInterval(timerRe);
}
 
 
function onSuccess() {
	console.log("Created Audio for Recording");
}
function onErrorF(error) {
	alert('173: code: '    + error.code    + '\n' +
		  'message: ' + error.message + '\n');
	console.log(error);
}
function onError(error) {
	alert('149: code: '    + error.code    + '\n' +
		  'message: ' + error.message + '\n');
	console.log(error);
}
function fail(error) {
	alert('154: code: '    + error.code    + '\n' +
		  'message: ' + error.message + '\n');
}
function failo(error) {
	alert('189: code: '    + error.code    + '\n' +
		  'message: ' + error.message + '\n');
}
function stopRecording()
{
	myMedia.stopRecord();
	isRecording = false;
	mostrarMensaje("Grabacion finalizada");
    clearInterval(superinterval);
	
	uploadAudio();
}

var isFinlaPlay = false;
function reproducirResp() {
	if(!isFinlaPlay) {
		finalAudio = new Media(urlToshare,
				// success callback
				 function () { },
				// error callback
				 function (err) { alert("Canción no disponible. "+r.response ); }
		);
		$('#btn-step7-play').html('<img src="imgs/ico-pause.png">');
		finalAudio.play();
		isFinlaPlay = true;
	} else {
		isFinlaPlay = false;
		finalAudio.pause();
		$('#btn-step7-play').html('<img src="imgs/ico-play.png">');
	}
}


function failFile(err) {
}
var urlToshare;
var finalAudio;

var uploadAudio = function () {
	mostrarMensaje("Uploading");
	console.log("Uploading");
	try {
		window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, verArchivooGrabado, fail);
	} catch(e) {
		mostrarMensaje("229: "+e.message);
	}
}

function verArchivooGrabado(fileSystem) {
	try {
		fileSystem.root.getFile(audioRecord, {
			create: true,
			exclusive: false
		}, gotFileEntry2, failo);
	} catch(e) {
		mostrarMensaje("240: "+e.message);
	}
}

function gotFileEntry2(fileEntry) {
	
	fileURL = fileEntry.toURL();
    var win = function (r) {
        //~ console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
        console.log("Respuesta del server: "+r.response);
					
		//~ $('#btn-step7-compartir').attr('href','whatsapp://send?text='+r.response);
		urlToshare = r.response;
		
		
		hideLoader();
		gotoSec('sec7');
		$('#btn-step6-1-grabar').removeClass('active');
		$('#btn-step6-2-grabar').removeClass('active');
		$('#btn-step7-compartir').click(function(e) {
			e.preventDefault();
			
			
			var rnd = Math.round((Math.random()*2))+1;
			var whatsappText = '';
			
			switch(rnd){
				case 1:
					whatsappText = 'Si con esto no activas, eres un quedao!';
					break;
				case 2:
					whatsappText = '¡Es hora de romper el hielo! Actívate con mi flow.';                        
					break;
				case 3: 
					whatsappText = '¿Vamos al arranque? Activa ahora y rompe el hielo.';                        
					break;
			}
			
			
			try {
				window.plugins.socialsharing.share(whatsappText+urlToshare);
			} catch(e) {
				verfallo();
			}
		});
    }

    var fail = function (error) {
        mostrarMensaje("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }
	try {
		var options = new FileUploadOptions();
		options.fileKey = "file";
		options.mimeType = "audio/wav";
		options.fileName = audioRecord;
		options.params = { 'devicePlatform': devicePlatform.toUpperCase(), 'base': base};
		options.headers = { Connection: "close" };

		var ft = new FileTransfer();
		var realPath;
		if(devicePlatform.toUpperCase()=="IOS") {
			realPath = fileURL;
		} else {
			realPath = audioRecord;  
		}
		console.log("archivo: "+realPath);
		
		//~ ft.upload(realPath, encodeURI("http://ximiodev.com/grabar/upload.php"), win, fail, options);
		ft.upload(realPath, encodeURI("http://server2.newcycle.com.ar/process-ios.php"), win, fail, options);
		showLoader();
	} catch(err) {
		mostrarMensaje(err.message);
	}
}

function verfallo(whatsappText, urlToshare) {
	try {
		window.plugins.socialsharing.shareViaWhatsApp(whatsappText+' ', null /* img */, urlToshare /* url */, function() {console.log('share ok')}, function(errormsg){alert("Debes tener instalado WhatsApp.")});
	} catch(e) {
		$('#btn-step7-compartir').attr('href','whatsapp://send?text='+whatsappText+' https://'+urlToshare);
		$('#btn-step7-compartir').click();
	}
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
