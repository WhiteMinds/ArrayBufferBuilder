function ArrayBufferBuilder(buffer, readMode, faster) {
	if(buffer) this.buffer = buffer;
	if(readMode) this.readMode = readMode;
	if(faster) this.faster = faster;
}
ArrayBufferBuilder.prototype.buffer = new ArrayBuffer(0);
ArrayBufferBuilder.prototype.pointer = 0;
ArrayBufferBuilder.prototype.readMode = 1;// 0=read & delete, 1=read & pointer move    1:1.16(efficacy, 1 is faster)
ArrayBufferBuilder.prototype.faster = true;
ArrayBufferBuilder.prototype.clear = function() {
	this.buffer = new ArrayBuffer(0);
	this.pointer = 0;
}
/* writeFunction Start */
ArrayBufferBuilder.prototype.writeBuffer = function(buffer) {
	var tmp = new Uint8Array( this.buffer.byteLength + buffer.byteLength );
	tmp.set( new Uint8Array( this.buffer ), 0 );
	tmp.set( new Uint8Array( buffer ), this.buffer.byteLength );
	this.buffer = tmp.buffer;
}
ArrayBufferBuilder.prototype.writeUint8Clamped = function(value){
	var bytes = new Uint8ClampedArray(1);
	bytes[0] = value;
	this.writeBuffer(bytes.buffer);
}
ArrayBufferBuilder.prototype.writeInt8 = ArrayBufferBuilder.prototype.writeUint8 = function(value){
	var bytes = new Int8Array(1);
	bytes[0] = value;
	this.writeBuffer(bytes.buffer);
}
ArrayBufferBuilder.prototype.writeInt16 = ArrayBufferBuilder.prototype.writeUint16 = function(value){
	var bytes = new Int16Array(1);
	bytes[0] = value;
	this.writeBuffer(bytes.buffer);
}
ArrayBufferBuilder.prototype.writeInt32 = ArrayBufferBuilder.prototype.writeUint32 = function(value){
	var bytes = new Int32Array(1);
	bytes[0] = value;
	this.writeBuffer(bytes.buffer);
}
ArrayBufferBuilder.prototype.writeFloat32 = function(value){// have bug, res num is not right, test num: 11.22, res: 11.220000267028809
	var bytes = new Float32Array(1);
	bytes[0] = value;
	this.writeBuffer(bytes.buffer);
}
ArrayBufferBuilder.prototype.writeFloat64 = function(value){
	var bytes = new Float64Array(1);
	bytes[0] = value;
	this.writeBuffer(bytes.buffer);
}
ArrayBufferBuilder.prototype.writeString = function(value){
	var bytes = stringToBytes(value);
	this.writeUint32(bytes.length);// value max length: 4294967295
	this.writeBuffer(bytes.buffer);
}
function stringToBytes(value){// utf8 encode
	var utf8 = [];
    for (var i=0; i < value.length; i++) {
        var charcode = value.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 
                      0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by subtracting 0x10000 and splitting the 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                      | (value.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >>18), 
                      0x80 | ((charcode>>12) & 0x3f), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
    }
    var res = new Uint8Array(new ArrayBuffer(utf8.length));
	for(i in utf8)
		res[i] = utf8[i];
	return res;
}
/* writeFunction Over */
/* readFunction Start */
ArrayBufferBuilder.prototype.readBuffer = function(length){//ie10
	if(this.faster) return this.readBuffer2(length);
	if(this.readMode == 0){
		var uint8 = new Uint8Array(this.buffer);
		var buffer = uint8.subarray(0, length);
		var setBuffer = uint8.subarray(length);
		var temp = new Uint8Array(setBuffer.length);
		temp.set(setBuffer, 0);
		this.buffer = temp.buffer;
		var res = new Uint8Array(buffer.length);
		res.set(buffer, 0);
		return res.buffer;
	}else{
		var buffer = new Uint8Array(this.buffer).subarray(this.pointer, length + this.pointer);
		this.pointer += length;
		var res = new Uint8Array(buffer.length);
		res.set(buffer, 0);
		return res.buffer;
	}
}
ArrayBufferBuilder.prototype.readBuffer2 = function(length){//ie11 (faster)
	if(this.readMode == 0){
		var buffer = this.buffer.slice(0, length);
		this.buffer = this.buffer.slice(length);
		return buffer;
	}else{
		var buffer = this.buffer.slice(this.pointer, length + this.pointer);
		this.pointer += length;
		return buffer;
	}
}