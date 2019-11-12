const fs = require('fs')

var pgmString = '';

fs.readFile('./finger.pgm', 'binary', function(err, data) {
	var p = 'P5\n'
	var res = ''
	var max = ''
	var img = ''
	var newlineCount = 0
	var imgStart = 0

	for(let i = 0; i < data.length; i++) {
		if(newlineCount == 1) {
			res += data[i]
		} else if(newlineCount == 2) {
			max += data[i]
		} else if(newlineCount == 3) {
			imgStart = i
			break
		}

		if(data[i].charCodeAt() == 10) {
			newlineCount += 1
		}
	}

	var nArr = []
	for(let i = 0; i < 256; i++) { nArr[i] = 0 }

	var totalPixel = 0;
	for(let i = imgStart; i < data.length; i++) {
		nArr[data[i].charCodeAt()] += 1
		totalPixel += 1
	}

	// var nArr = [25, 125, 200, 100, 25, 150, 225, 150]
	// var totalPixel = 1000

	var pArr = []
	for(let i = 0; i < nArr.length; i++) {
		pArr[i] = nArr[i] / totalPixel
	}
	// console.log(pArr)

	var ipArr = []
	var ipTotal = 0
	for(let i = 0; i < nArr.length; i++) {
		ipArr[i] = i * pArr[i]
		ipTotal += ipArr[i]
	}
	ipTotal = Math.round(ipTotal)
	// console.log(ipArr)
	// console.log(ipTotal)

	var oArr = []
	for(let i = 0; i < nArr.length; i++) {
		oArr[i] = Math.pow(i - ipTotal, 2) * pArr[i]
	}
	// console.log(oArr)

	var p1kArr = []
	for(let i = 0; i < nArr.length; i++) {
		let sum = 0
		for(let j = 0; j <= i; j++) {
			sum += pArr[j]
		}
		p1kArr[i] = sum
	}
	// console.log(p1kArr)

	var p2kArr = []
	for(let i = 0; i < nArr.length; i++) {
		p2kArr[i] = 1 - p1kArr[i]
	}
	// console.log(p2kArr);

	var m1kArr = []
	for(let i = 0; i < nArr.length; i++) {
		let sum = 0
		for(let j = 0; j <= i; j++) {
			sum += ipArr[j]
		}
		m1kArr[i] = sum / p1kArr[i]
	}
	// console.log(m1kArr)

	var m2kArr = []
	for(let i = 0; i < nArr.length; i++) {
		let sum = 0;
		for(let j = (i + 1); j < nArr.length; j++) {
			sum += ipArr[j]
		}
		m2kArr[i] = sum / p2kArr[i]
	}
	// console.log(m2kArr)

	var obArr = []
	for(let i = 0; i < nArr.length; i++) {
		obArr[i] = (p1kArr[i] * Math.pow(m1kArr[i] - ipTotal, 2)) + (p2kArr[i] * Math.pow(m2kArr[i] - ipTotal, 2))
	}
	// console.log(obArr);

	var max = 0
	var maxI = 0
	for(let i = 0; i < nArr.length; i++) {
		if(obArr[i] > max) {
			max = obArr[i]
			maxI = i
		}
	}
	// console.log('max is ' + max);
	// console.log('max index is ' + maxI);

	var threshold = maxI

	for(let i = imgStart; i < data.length; i++) {
		if(data[i].charCodeAt() <= threshold) {
			img += String.fromCharCode(0)
		} else {
			img += String.fromCharCode(1)
		}

		if(data[i].charCodeAt() == 10) {
			newlineCount += 1
		}
	}

	pgmString = p + res + '1\n' + img

	fs.writeFile("./new_image.pgm", pgmString, 'ascii', function(err) {
	  if(err) {
	    return console.log(err)
	  }

	  console.log("The file was saved!")
	})
})
