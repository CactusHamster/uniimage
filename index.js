let colors = ' █▓▒░~!@#$%^&*()_+`1234567890-=[]\{}|;\':",./<>?~ '
//let utf8 = ["█", "▓"] //█, ▓, ▒, ░
//colors = [...utf8, ...colors.split(''), ' ']
function prop(oldNum, newmin, newmax, oldmin, oldmax) {return ((oldNum - oldmin) / (oldmax - oldmin)) * (newmax - newmin) + newmin;}

const gpu = new GPU();
gpu.addFunction(prop)
const getColorIndexes = gpu.createKernel(function(img, le) {
    const rgbData = img[this.thread.y][this.thread.x];
    let average = (rgbData[0] + rgbData[1] + rgbData[2]) / 3;
    let a = prop(average, 0, le-1, 0, 1);
    return Math.round(a)
}).setOutput({x: 200, y: 900})
.setDynamicOutput(true)



function render (img) {
    let output = document.getElementById('out')
    output.innerText = ""
    img.onload = () => {
		let canvas = document.createElement('CANVAS')
		let ctx = canvas.getContext('2d')
		let scale = +scaleI.value
		canvas.height = img.height*scale*(2/3)
		canvas.width = img.width*scale
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height) 
        let img2 = new Image()
        img2.src = canvas.toDataURL()
        img2.onload = function () {
			console.info(img.width, img2.width, canvas.width)
			getColorIndexes.setOutput({x: canvas.width, y: canvas.height})
            let c  = getColorIndexes(img2, colors.length)
            for (let y in c) {
                let k = c.length-1
                let a = ''
                //let a = y.toString()
				for (let x in c[y]) {
                    a += colors[c[k-y][x]]
                }
                output.innerText = output.innerText + a + '\n'
            }
        }
    }
}


imageInput.addEventListener('change', function(e) {
	let file = e.target.files[0]
	if (!file) return
	let rd = new FileReader()
	//uploadFileText.innerHTML = `Upload File (${this.files[0].name})`
	rd.readAsDataURL(file);
	rd.addEventListener('load', function() {
        let image = new Image()
		image.src = this.result
		image.onerror = function () {alert('Error loading image!')}
        render(image)
        //img.src = "/obamium.webp"
	})
})