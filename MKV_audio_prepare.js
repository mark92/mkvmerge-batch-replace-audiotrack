const thread = require("child_process");
const fs = require("fs");

const config = {
	mode: "merge", //=filter:merge
	audioTrack: 1 //if mode == filter =1... <= "mkvmerge -i FILE"
};

var video = collectVideoFiles();
var audio = collectAudioFiles();


video.forEach(function(v, i){
	convert(video[i], audio[i]);
});

function convert(videoInput, audioInput) {
	var command = "";
	if(config.mode == "merge") {
		command = 'mkvmerge -o "output/' + videoInput + '" -A "input/' + videoInput + '" "input/' + audioInput + '"';
	}

	if(config.mode == "filter") {
		command = 'mkvmerge -o "output/' + videoInput + '" -a ' + config.audioTrack + ' "input/' + videoInput + '"';
	}

	const process = thread.exec(command, function (error, stdout, stderr) {
	  if (error) {
	    console.log(error.stack);
	    console.log('Error code: '+error.code);
	    console.log('Signal received: '+error.signal);
		console.log('Child Process STDERR: '+stderr);
	  }
	});

	process.on('exit', function (code) {
	  console.log('Finished "' + videoInput + '" [ '+(code==0?"OK":code) + ' ]');
	});
}


function collectVideoFiles() {
	return fs.readdirSync(__dirname + "/input").filter(function(file){return file.match(/\.mkv/)});
}

function collectAudioFiles() {
	return fs.readdirSync(__dirname + "/input").filter(function(file){return file.match(/\.mka/)});
}