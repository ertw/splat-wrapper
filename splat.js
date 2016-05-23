gs = 
	{name:"boca-hill"
	, lat:"39.378263"
	, long:"120.115933"
	, transmitter_height:"500"
	, groundcover_height:"50"
	}

splat_exec(gs)

function splat_exec (gt) {
	const fs = require('fs')
		, spawn = require('child_process').spawn
		, async = require('async')

	// array of functions, called in series
	async.series ([

	function(callback) {
		// writes transmitter data qth file to disk
		fs.writeFile("./site_data.qth", gt.name + "\n" + gt.lat + "\n" + gt.long + "\n" + gt.transmitter_height, "utf8", function(err) {
			callback()
		})
	},



	function(callback) {
					  
		/*                *** arguments ***
		-N do not produce unnecessary site or obstruction reports
		-t txsite(s).qth (max of 4 with -c, max of 30 with -L)
		-c plot LOS coverage of TX(s) with an RX antenna at X feet/meters AGL
		-gc ground clutter height (feet/meters)
		-ngs display greyscale topography as white in .ppm files
		-o filename of topographic map to generate (.ppm)
		-kml generate Google Earth (.kml) compatible output
		*/
		const splat_hd = spawn('./splat-hd', ["-N", "-t", "site_data.qth", "-c", gt.transmitter_height, "-gc", gt.groundcover_height, "-ngs", "-o", "transmit_coverage", "-kml"])
		.on('error', function( err ){ throw err })
		splat_hd.stdout.on('data', (data) => {
		  console.log(`stdout: ${data}`)
		})
		splat_hd.stderr.on('data', (data) => {
		  console.log(`stderr: ${data}`)
		})
		splat_hd.on('close', (code) => {
		  console.log(`splat-hd exited with code ${code}`)
		  callback()
		})
	},



	function(callback) {
		// converts ppm bitmap to png, makes transperant
		const convert = spawn('./convert', ["-transparent", "#FFFFFF", "transmit_coverage.ppm", "transmit_coverage.png"])
		.on('error', function( err ){ throw err })
		convert.stderr.on('data', (data) => {
		console.log(`stderr: ${data}`)
		})

		convert.on('close', (code) => {
		console.log(`convert exited with code ${code}`)
		callback()
		})
	},



	], function(err) {
		if(err) {
				return console.log(err)
			}
		console.log("success!")
	})
}
