import ToStream from "./byte";

const buf = ToStream.alloc(20);

describe("test case byte object", () => {
    test("test writeInt8 and readInt8", () => {
        buf.writeInt8(99);
        expect(buf.offset).toBe(1);
        expect(buf.readInt8()).toBe(99);
    });

    test("test writeInt16 and readInt16", () => {
        buf.writeInt16(955);
        expect(buf.offset).toBe(3);
        expect(buf.readInt16()).toBe(955);
    });

    test("test writeInt32 and readInt32", () => {
        buf.writeInt32(955212122);
        expect(buf.offset).toBe(7);
        expect(buf.readInt32()).toBe(955212122);
    });

    test("test writeFloat and readFloat", () => {
        buf.writeFloat(952212.5);
        expect(buf.offset).toBe(11);
        expect(buf.readFloat()).toBe(952212.5);
    });

    test("test writeDouble and readDouble", () => {
        buf.writeDouble(99521322.5);
        expect(buf.offset).toBe(19);
        expect(buf.readDouble()).toBe(99521322.5);
    });

    test("test writeLong and readLong", () => {
        buf.writeLong("43434348834343434");
        expect(buf.offset).toBe(27);
        expect(buf.readLong()).toBe("43434348834343434");
    });

    test("test write string", () => {
        buf.writeString("dsdssdsdsdsdsd");
        const len = Buffer.byteLength("dsdssdsdsdsdsd");
        expect(buf.readString(len)).toBe("dsdssdsdsdsdsd");
    });

    test("auto grow size", () => {
        expect(buf.limit).toBe(71);
    });

    test("check data", () => {
        const len = Buffer.byteLength("dsdssdsdsdsdsd");
        expect(buf.readString(len)).toBe("dsdssdsdsdsdsd");
    });
});

