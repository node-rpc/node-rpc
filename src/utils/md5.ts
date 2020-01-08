/**
 * copy from https://github.com/blueimp/JavaScript-MD5
 */

/* tslint:disable */

export default class MD5 {

    safeAdd(x: number, y: number): number {
        const lsw = (x & 0xffff) + (y & 0xffff);
        const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xffff);
    }

    bitRotateLeft(num: number, cnt: number) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    md5cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
        return this.safeAdd(this.bitRotateLeft(this.safeAdd(this.safeAdd(a, q), this.safeAdd(x, t)), s), b);
    }

    md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
        return this.md5cmn((b & c) | (~b & d), a, b, x, s, t);
    }

    md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
        return this.md5cmn((b & d) | (c & ~d), a, b, x, s, t);
    }

    md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
        return this.md5cmn(b ^ c ^ d, a, b, x, s, t);
    }

    md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
        return this.md5cmn(c ^ (b | ~d), a, b, x, s, t);
    }

    binlMD5(x: Array<number>, len: number): Array<number> {
      x[len >> 5] |= 0x80 << len % 32;
      x[(((len + 64) >>> 9) << 4) + 14] = len;
      let i;
      let olda;
      let oldb;
      let oldc;
      let oldd;
      let a = 1732584193;
      let b = -271733879;
      let c = -1732584194;
      let d = 271733878;
      for (i = 0; i < x.length; i += 16) {
        olda = a;
        oldb = b;
        oldc = c;
        oldd = d;
        a = this.md5ff(a, b, c, d, x[i], 7, -680876936);
        d = this.md5ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = this.md5ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = this.md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = this.md5ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = this.md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = this.md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = this.md5ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = this.md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = this.md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = this.md5ff(c, d, a, b, x[i + 10], 17, -42063);
        b = this.md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = this.md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = this.md5ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = this.md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = this.md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = this.md5gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = this.md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = this.md5gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = this.md5gg(b, c, d, a, x[i], 20, -373897302);
        a = this.md5gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = this.md5gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = this.md5gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = this.md5gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = this.md5gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = this.md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = this.md5gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = this.md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = this.md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = this.md5gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = this.md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = this.md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = this.md5hh(a, b, c, d, x[i + 5], 4, -378558);
        d = this.md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = this.md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = this.md5hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = this.md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = this.md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = this.md5hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = this.md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = this.md5hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = this.md5hh(d, a, b, c, x[i], 11, -358537222);
        c = this.md5hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = this.md5hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = this.md5hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = this.md5hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = this.md5hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = this.md5hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = this.md5ii(a, b, c, d, x[i], 6, -198630844);
        d = this.md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = this.md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = this.md5ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = this.md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = this.md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = this.md5ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = this.md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = this.md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = this.md5ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = this.md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = this.md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = this.md5ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = this.md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = this.md5ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = this.md5ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = this.safeAdd(a, olda)
        b = this.safeAdd(b, oldb)
        c = this.safeAdd(c, oldc)
        d = this.safeAdd(d, oldd)
      }
      return [a, b, c, d];
    }

    binl2rstr(input: number[]) {
      let i;
      let output = "";
      const length32 = input.length * 32;
      for (i = 0; i < length32; i += 8) {
        output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff);
      }
      return output;
    }

    rstr2binl(input: string): number[] {
      let i;
      const output: number[] = [];
      for (i = 0; i < output.length; i += 1) {
        output[i] = 0;
      }
      const length8 = input.length * 8;
      for (i = 0; i < length8; i += 8) {
        output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
      }
      return output;
    }

    rstrMD5(s: string): string {
      return this.binl2rstr(this.binlMD5(this.rstr2binl(s), s.length * 8));
    }

    rstrHMACMD5(key: string, data: string): string {
      var i;
      var bkey = this.rstr2binl(key);
      var ipad = [];
      var opad = [];
      var hash
      ipad[15] = opad[15] = 0;
      if (bkey.length > 16) {
        bkey = this.binlMD5(bkey, key.length * 8);
      }
      for (i = 0; i < 16; i += 1) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5c5c5c5c;
      }
      hash = this.binlMD5(ipad.concat(this.rstr2binl(data)), 512 + data.length * 8);
      return this.binl2rstr(this.binlMD5(opad.concat(hash), 512 + 128));
    }

    rstr2hex(input: string): string {
      let hexTab = "0123456789abcdef";
      let output = "";
      let x;
      let i;
      for (i = 0; i < input.length; i += 1) {
        x = input.charCodeAt(i);
        output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
      }
      return output;
    }

    str2rstrUTF8(input: string): string {
      return unescape(encodeURIComponent(input));
    }

    rawMD5(s: string): string {
      return this.rstrMD5(this.str2rstrUTF8(s));
    }

    hexMD5(s: string): string {
      return this.rstr2hex(this.rawMD5(s));
    }

    rawHMACMD5(k: string, d: string): string {
      return this.rstrHMACMD5(this.str2rstrUTF8(k), this.str2rstrUTF8(d));
    }

    hexHMACMD5(k: string, d: string): string {
      return this.rstr2hex(this.rawHMACMD5(k, d));
    }

    md5(str: string, key: string, raw: boolean): string {
      if (!key) {
        if (!raw) {
          return this.hexMD5(str);
        }
        return this.rawMD5(str);
      }
      if (!raw) {
        return this.hexHMACMD5(key, str);
      }
      return this.rawHMACMD5(key, str);
    }
}
