# ArrayBufferBuilder
javascript arraybuffer builder (format)
provide help for your build and read arraybuffe

#HOW TO USE
<script src="ArrayBufferBuilder.js"></script>
<script>
var builder = new ArrayBufferBuilder();
builder.writeString("test");
builder.writeInt32(123);
builder.writeString("1234!");
console.log(new Uint8Array(builder.buffer));
//echo: [4, 0, 0, 0, 116, 101, 115, 116, 123, 0, 0, 0, 5, 0, 0, 0, 49, 50, 51, 52, 33]

var buffer = builder.buffer;
var reader = new ArrayBufferBuilder(buffer);
reader.readString();//result: test
reader.readInt32();// result: 123
reader.readString();//result: 1234!
</script>