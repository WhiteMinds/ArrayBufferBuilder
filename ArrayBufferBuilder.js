function ArrayBufferBuilder() {}
ArrayBufferBuilder.prototype.buffer = new ArrayBuffer(0);
ArrayBufferBuilder.prototype.appendBuffer = function(buffer) {
	var tmp = new Uint8Array( this.buffer.byteLength + buffer.byteLength );
	tmp.set( new Uint8Array( this.buffer ), 0 );
	tmp.set( new Uint8Array( buffer ), this.byteLength );
	this.buffer = tmp.buffer;
}
