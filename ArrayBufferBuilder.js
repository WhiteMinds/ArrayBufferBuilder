function ArrayBufferBuilder(buffer) { if(buffer) this.buffer = buffer; }
ArrayBufferBuilder.prototype.buffer = new ArrayBuffer(0);
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
ArrayBufferBuilder.prototype.writeFloat32 = function(value){//bug, res num is not right, test num: 11.22, res: 11.220000267028809
	var bytes = new Float32Array(1);
	bytes[0] = value;
	this.writeBuffer(bytes.buffer);
}
ArrayBufferBuilder.prototype.writeFloat64 = function(value){
	var bytes = new Float64Array(1);
	bytes[0] = value;
	this.writeBuffer(bytes.buffer);
}