const fs = require('fs')

gt = 
	{name:"George Test"
	, lat:"39.352547"
	, long:"120.195411"
	, transmitter_height:"9000"
	, groundcover_height:"50"
	}


fs.writeFile('message.txt', 'Hello Node.js', (err) => {
	if (err) {
		console.log(err)
		throw err
	}
return true
})

