const async = require('async')
	, fs = require('fs')
	, exec = require('child_process').exec
	, pug = require('pug')

gt = 
	{
	//site name
	  name:"far-far-a-way"
	, lat:"39.075103"
	, long:"120.988396"
	//height of transmitter
	, transmitter_height:"30"
	, groundcover_height:"10"
	//color to use for viewshed bitmap
	, bitmap_color: "#FF0000"
	}


//writes .qth config file for consumption by Splat! HD
function writeFile(writeFileCallback) {
	fs.writeFile("./site_data.qth"
		, `${gt.name}
		${gt.lat}
		${gt.long}
		${gt.transmitter_height}`
, "utf8"
, function(err) {
		if (err) {
			writeFileCallback(err)
		} else {
			writeFileCallback(null)
		}
	})
}

//executes Splat! HD
function execSplat(execSplatCallback) {
	var splatCommand = `./splat-hd -N -t ./site_data.qth -d ./ -c ${gt.transmitter_height} -gc ${gt.groundcover_height} -ngs -o transmit_coverage -kml`
	console.log(splatCommand)
	exec(splatCommand, function (err, stdout, stderr) {
		if (err) {
			console.log(stderr)
			execSplatCallback(err)
		} else {
			console.log(stdout)
			console.log(stderr)
			execSplatCallback(null)
		}
	})
}

//converts .ppm bitmap to .png
function convertBitmap(convertBitmapCallback) {
	var convertCommand = `./convert -transparent "#FFFFFF" -fill "${gt.bitmap_color}" -opaque "#00FF00" ./transmit_coverage.ppm ./transmit_coverage.png`
	console.log(convertCommand)
	exec(convertCommand, function (err, stdout, stderr) {
		if (err) {
			console.log(stderr)
			convertBitmapCallback(err)
		} else {
			console.log(stdout)
			console.log(stderr)
			convertBitmapCallback(null)
		}
	})
}

//creates a clean .kml file for consumption by Google Earth
//templatized with Pug
var kml = 'test'
function cleanKML(cleanKMLCallback) {
	fs.readFile('./kml_template.pug', 'utf8', function (err, data) {
	if (err) {
		cleanKMLCallback(err)
	} else {
		var fn = pug.compile(data)
		var kml = fn({name:gt.name, lat: gt.lat, long: gt.long, height: gt.transmitter_height})
		
		//export cleaned .kml to disk
		fs.writeFile("./transmit_coverage.kml", kml , "utf8", function(err) {
			if (err) {
				console.log(err)
				cleanKMLCallback(err)
			} else {
				console.log(kml)
				console.log('kml')
				cleanKMLCallback(null)
			}
		})
		// ^ end .kml export to disk ^
		}
	})
}



//executes all pieces in series, stopping if any return err
async.waterfall([

	writeFile,
	execSplat,
	convertBitmap,
	cleanKML,

], function (err) {
	if (err) {
		console.log(err)
		//handle all errors here
	}
})