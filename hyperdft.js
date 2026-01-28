var $ = require('./utils.js')
var tf = $.tf

//var nextBatch = require('./load.js')()

let variblay = $.variable({init: 'randomUniform', shape: [1,100], min:0, max: Math.pow(2,31)-1})
console.log(variblay.layer.dataSync())
//let vibe = variblay.layer.matMul(variblay.layer.transpose())
//console.log(vibe.dataSync())

function powdown(val, count = 9){
  let d = val % 2
  let p = Math.floor(Math.log(val) / Math.log(2))
  let n = Math.pow(2, p+1)
  let res = val
  console.log(val, val.toString(2))
  if(d==1){
    // odd, shift up remove one and halve
    // will stay in same power range but lower
    for(var i = 0; i < count; i++){
      let x = (res + Math.pow(2, p) - 1) / 2
      res = x // 2
      //res = Math.floor(res)
      n = Math.floor(Math.log(res) / Math.log(2)) //.pow(2, p-i)
      console.log(res,  res.toString(2),isPrime(res))
    }
  }else{
    // even, shift up, split in half, shift down
    for(var i = 0; i < count; i++){
      let x = (res + Math.pow(2, p)) / 2 - Math.pow(2, p-1)
      res = x 
      //res = res - Math.pow(2, Math.floor((Math.log(res)/Math.log(2)))-1)
      //res = Math.floor(res)
      //n = Math.pow(2, p-i)
      n = Math.floor(Math.log(res) / Math.log(2)) //.pow(2, p-i)
      console.log(res,  res.toString(2), isPrime(res))
    }
  }
  return res
}

function powup(val, pow){
  let d = val % 2
  pow = pow || 31
  let pw =  Math.pow(2, pow)
  let p = Math.floor(Math.log(val) / Math.log(2))
  let n = Math.pow(2, p+1)
  let res = val
  console.log(val, val.toString(2))
  if(val<pw){
    // under: shift up, multiply, shift down 
      let x = ((res + pw) * 2) - Math.pow(2, pow +1)
      res = x
      //res = res - Math.pow(2, n+1)
      //res = Math.floor(res)
      //n = Math.floor(Math.log(res) / Math.log(2)) //.pow(2, p-i)
      console.log(res,  res.toString(2),isPrime(res))
  }else{
    // over: multiply, add one, shift down
      let x = res * 2
      x = x + 1
      x = x - Math.pow(2, pow)
      res = x
      //res = res - Math.pow(2, Math.floor((Math.log(res)/Math.log(2)))-1)
      //res = Math.floor(res)
      //n = Math.pow(2, p-i)
      //n = Math.floor(Math.log(res) / Math.log(2)) //.pow(2, p-i)
      console.log(res,  res.toString(2), isPrime(res))
  }
  return res
}

return

var batch_size =1 //256 * 4
var epochas = 1.00000
var binSize = 4e3 // 128th of 48K 
var manifold = 1
var dimension = 1//2
var input_shape = [batch_size, manifold, binSize, dimension]
var z = binSize / 2 
var sampleRate = 4e3//16e9//Math.pow(2,34) // 2 billions
var range = [1e9, 2e9]
var offset =0//3e4
var ff = 144+89//16e9/400//*21/13///2e9/2-1//Math.pow(2, 30) - 1e15// limit 
var f = ff//21/13//ff//2
var ph = .123456789012345//0123456787654321//0.123456789//2//1/4
var amp = 1e9//1e5// 4e3//Number.MAX_SAFE_INTEGER - 1

//var filter = $.variable({init: 'harmonic', base: f, size: 2, shape:[1, 2], trainable:false}).layer
var filter = $.tf.tensor([ff, 610], [1,2])
//var gen = (e, i)=> Math.sin(Math.PI * 2 * ff * ((i + offset + sampleRate / ff * ph )/ sampleRate)) * amp 
var gen = (e, i)=> Math.sin(Math.PI * 2 * ff * ((i + offset )+(((sampleRate/ff)*(ph))))/sampleRate) * amp 
var gencos = (e, i)=> Math.cos(Math.PI * 2 * ff * (i / sampleRate)) * amp 
var jen = (e, i)=> Math.sin(Math.PI * 2 * e * ((i + offset + sampleRate / e * ph )/ sampleRate)) * amp 

var genc = (e, i)=> Math.cos((Math.PI * (2+(ph))) * e * ((i + offset )/ sampleRate)) * amp 
var gens = (e, i)=> Math.sin((Math.PI * (2+(ph))) * e * ((i + offset )/ sampleRate)) * amp 
//var gent = (e, i)=> gen(e, i) //+ gencos(e, i)
var gent = (e, i)=> Math.sin(Math.PI * 2 * e * ((i + offset )+(((sampleRate / e)*(ph))))/sampleRate) * amp 

var genz = f => tf.tensor(f.map(e => new Float32Array(binSize).fill(e).map(gent)), [f.length, binSize]).sum(0).reshape([1,binSize])
let gz = genz([ff, 610])//ff*Math.pow(2, 1/12), ff*3/2])
var ords = tf.linspace(1, 10, 10 ).reshape([1, 10])
let powq = $.scalar(10).pow(ords)
powq.print()

function serie(sr){
  let table = []
  let dict = {}

}

function generate(fqs, ph, offset, amp, sampleRate, binSize){

  return  Math.sin((Math.PI * (2+(ph))) * e * ((i + offset )/ sampleRate)) * amp 
  
}

var mag = (a)=> Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2))
var phase = (a)=> Math.atan2(a[0], a[1])//Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2))

var faze = p => 1-(p+Math.PI)/(Math.PI*2)

var signal = gz//ords.dataSync().map(gent)
var asignal = Array.from(gz.dataSync())//.map(gent)

function jsdft(x, k, sr){

  let y = x.map((e,i)=>[e*Math.cos(-(Math.PI * 2 * i * k / sr)), e*Math.sin(-(Math.PI * 2 * k * i /sr))])
  return y
}

let pc = asignal.map((e,i) => {
  let sr = sampleRate
  let rico = [Math.cos(-(Math.PI * 2 * (i / sr))), Math.sin(-(Math.PI * 2 *  (i /sr)))]
  let sico = [Math.cos(-(Math.PI * 2 * f * (i / sr))), Math.sin(-(Math.PI * 2 * f *  (i /sr)))]
  let fico = sico.map( x => e * x)
  let m = mag(fico)
  let p = phase(fico)
  let mr = mag(rico)
  let rp = phase(rico)
  let ms = mag(sico)
  let ph = phase(sico)
  console.log(m, m/ms, ms, mr, faze(rp), faze(ph), faze(p))
  return p
}).reduce((a,e)=> a+e, 0)
console.log('alt phase calc: '+ faze(pc)/z)
dd = $.jsdft(asignal, f, sampleRate)
let cd = dd
//console.log(cd)



dd = dd.reduce((a, e)=> [a[0]+e[0], a[1]+e[1]], [0,0])
console.log(dd, mag(dd)/z, 1-(phase(dd)+Math.PI)/(Math.PI*2), Math.sin(phase(dd)/Math.PI*2))

var rotate = (v, a) => [v[0]*Math.cos(a)-v[1]*Math.sin(a), v[0]*Math.sin(a)+v[1]*Math.cos(a)]
let rr = (mag(dd)/z)
let dr = mag(dd)/z - amp
let r1 = dd[1] * (1-dr/rr)//* (1 - rr/mag(dd)/z)
let rt = rotate(dd, Math.PI*2-(1-dr/rr))
let r0 = dd[0] //* (1 -  dr/ rr)// (1 - rr/mag(dd)/z)


console.log(rr, dd, mag([r0, r1])/z, 1-(phase([rt[0], dd[1]])+Math.PI)/(Math.PI*2), mag(dd)/z)
console.log(mag(rotate(dd, 1))/z)
console.log(dd[0]%sampleRate/2)
signal = gz//tf.tensor(signal, [1, binSize], 'float32')
console.log("signal energy", signal.square().mean().dataSync())

//var filter = tf.linspace(0, z-1, z).reshape([1, z])
//console.log(filter.dataSync())
//var time = bin => tf.tensor(Array(z).fill(0).map((e,i)=> i / sampleRate), [1, z])//, z, z).div($.scalar(sampleRate))

//var t = time(0).reshape([z, 1])
//t.print()
var t = $.tautime(binSize, sampleRate)//t.mul($.scalar(Math.PI * 1)) //tf.tensor([Math.PI * 2], [1,1]))
//t = t.add($.scalar(.25))// phase change
var d = $.dft(t, filter, sampleRate)

sin = d.sin(gz)//.add($.scalar(5)))//signal)
cos = d.cos(gz)//.add($.scalar(5)))//signal)
console.log(cos, sin)
cos.print()
sin.print()

dft = $.mag(cos, sin).mul($.scalar(2)).div($.scalar(binSize))
dmag = dft.dataSync()
dph = $.phase(cos, sin).dataSync()

console.log(dmag[0], dph[0], 1-(dph[0]+Math.PI)/(Math.PI*2) )
console.log(dmag[1], dph[1], 1-(dph[1]+Math.PI)/(Math.PI*2) )
//console.log(dmag[1], dph[1], 1-Math.abs(dph[1] / Math.PI%1) )
