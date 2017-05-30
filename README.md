# splat-wrapper
This is a wrapper around [Splat! HD](http://www.qsl.net/kd2bd/splat.html).  It adds helpful functionality:
* Take care of generating clean KML and PNG for use in Google Earth.
* Specify output color of viewshed bitmap.

## Installation & Execution
`git clone https://github.com/ertw/splat-wrapper.git`
`cd splat-wrapper`
`node main.js`

## Configuration
Currently the following setting must be configured by editing main.js:

name:"site-name"
lat:"00.000000"
long:"00.000000"
//transmitter height in feet
transmitter_height:"30"
groundcover_height:"10"
//color to use for viewshed bitmap
bitmap_color: "#FF0000"

## Example output
![viewshed example](https://lh3.googleusercontent.com/Jl_ylfnZ8sTjfOjc2m0LITNeAcZzqNoU14EPC2qisl_LsWRt03qa0WkRjMUM6a_0ul9erMYQyMdlj71JHgMfrNHwmd-4HTeMhjRO=w1362-h622-rw)
