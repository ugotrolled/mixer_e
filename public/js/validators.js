(function (global) {
  "use strict";

  var B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

  function sha256(data) {
    var K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    var H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    var len = data.length;
    var bitLen = len * 8;
    var paddedLen = Math.ceil((len + 9) / 64) * 64;
    var p = new Uint8Array(paddedLen);
    p.set(data);
    p[len] = 0x80;
    p[paddedLen - 4] = (bitLen >>> 24) & 0xFF;
    p[paddedLen - 3] = (bitLen >>> 16) & 0xFF;
    p[paddedLen - 2] = (bitLen >>> 8) & 0xFF;
    p[paddedLen - 1] = bitLen & 0xFF;
    var W = new Array(64);
    function rr(x, n) { return ((x >>> n) | (x << (32 - n))) >>> 0; }
    for (var i = 0; i < paddedLen; i += 64) {
      for (var t = 0; t < 16; t++) {
        W[t] = ((p[i + t * 4] << 24) | (p[i + t * 4 + 1] << 16) | (p[i + t * 4 + 2] << 8) | p[i + t * 4 + 3]) >>> 0;
      }
      for (var t = 16; t < 64; t++) {
        var s0 = rr(W[t - 15], 7) ^ rr(W[t - 15], 18) ^ (W[t - 15] >>> 3);
        var s1 = rr(W[t - 2], 17) ^ rr(W[t - 2], 19) ^ (W[t - 2] >>> 10);
        W[t] = (W[t - 16] + s0 + W[t - 7] + s1) >>> 0;
      }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (var t = 0; t < 64; t++) {
        var S1 = rr(e, 6) ^ rr(e, 11) ^ rr(e, 25);
        var ch = (e & f) ^ ((~e) & g);
        var t1 = (h + S1 + ch + K[t] + W[t]) >>> 0;
        var S0 = rr(a, 2) ^ rr(a, 13) ^ rr(a, 22);
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var t2 = (S0 + maj) >>> 0;
        h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
      H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
    }
    var out = new Uint8Array(32);
    for (var i = 0; i < 8; i++) {
      out[i * 4] = (H[i] >>> 24) & 0xFF;
      out[i * 4 + 1] = (H[i] >>> 16) & 0xFF;
      out[i * 4 + 2] = (H[i] >>> 8) & 0xFF;
      out[i * 4 + 3] = H[i] & 0xFF;
    }
    return out;
  }

  function sha256Double(data) {
    return sha256(sha256(data));
  }

  function keccak256(msg) {
    var RC = [
      0x0000000000000001n, 0x0000000000008082n, 0x800000000000808an, 0x8000000080008000n,
      0x000000000000808bn, 0x0000000080000001n, 0x8000000080008081n, 0x8000000000008009n,
      0x000000000000008an, 0x0000000000000088n, 0x0000000080008009n, 0x000000008000000an,
      0x000000008000808bn, 0x800000000000008bn, 0x8000000000008089n, 0x8000000000008003n,
      0x8000000000008002n, 0x8000000000000080n, 0x000000000000800an, 0x800000008000000an,
      0x8000000080008081n, 0x8000000000008080n, 0x0000000080000001n, 0x8000000080008008n
    ];
    var ROT = [0,1,62,28,27,36,44,6,55,20,3,10,43,25,39,41,45,15,21,8,18,2,61,56,14];
    var MASK = 0xFFFFFFFFFFFFFFFFn;
    var S = new Array(25).fill(0n);
    var rate = 136;
    var padded = new Uint8Array(rate);
    padded.set(msg.slice(0, rate));
    if (msg.length < rate) padded[msg.length] = 0x01;
    padded[rate - 1] |= 0x80;
    for (var off = 0; off < rate; off += 8) {
      var lane = 0n;
      for (var j = 7; j >= 0; j--) lane = (lane << 8n) | BigInt(padded[off + j]);
      S[off / 8] ^= lane;
    }
    for (var round = 0; round < 24; round++) {
      var C = new Array(5);
      for (var x = 0; x < 5; x++) C[x] = S[x] ^ S[x + 5] ^ S[x + 10] ^ S[x + 15] ^ S[x + 20];
      var D = new Array(5);
      for (var x = 0; x < 5; x++) D[x] = C[(x + 4) % 5] ^ (((C[(x + 1) % 5] << 1n) | (C[(x + 1) % 5] >> 63n)) & MASK);
      for (var i = 0; i < 25; i++) S[i] ^= D[i % 5];
      var B = new Array(25);
      for (var x = 0; x < 5; x++) {
        for (var y = 0; y < 5; y++) {
          var idx = x + 5 * y;
          var nIdx = y + 5 * ((2 * x + 3 * y) % 5);
          var off2 = ROT[idx];
          B[nIdx] = (off2 === 0) ? S[idx] : (((S[idx] << BigInt(off2)) | (S[idx] >> BigInt(64 - off2))) & MASK);
        }
      }
      for (var y = 0; y < 5; y++) {
        for (var x = 0; x < 5; x++) {
          S[x + 5 * y] = B[x + 5 * y] ^ ((~B[((x + 1) % 5) + 5 * y]) & B[((x + 2) % 5) + 5 * y]);
        }
      }
      S[0] ^= RC[round];
    }
    var out = new Uint8Array(32);
    for (var i = 0; i < 4; i++) {
      var lane = S[i];
      for (var j = 0; j < 8; j++) {
        out[i * 8 + j] = Number(lane & 0xFFn);
        lane >>= 8n;
      }
    }
    return out;
  }

  function keccak256Ascii(str) {
    var bytes = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
    return keccak256(bytes);
  }

  function isValidEvm(address) {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return false;
    var addr = address.slice(2);
    var lower = addr.toLowerCase();
    var hash = keccak256Ascii(lower);
    var result = "";
    for (var i = 0; i < lower.length; i++) {
      var c = lower[i];
      if (c >= "0" && c <= "9") {
        result += c;
      } else {
        var hashNibble = (hash[Math.floor(i / 2)] >> (i % 2 === 0 ? 4 : 0)) & 0xF;
        result += (hashNibble >= 8) ? c.toUpperCase() : c;
      }
    }
    return result === addr;
  }

  var BECH32_CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

  function bech32Polymod(values) {
    var GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
    var chk = 1;
    for (var i = 0; i < values.length; i++) {
      var b = chk >> 25;
      chk = ((chk & 0x1ffffff) << 5) ^ values[i];
      for (var k = 0; k < 5; k++) {
        if ((b >> k) & 1) chk ^= GEN[k];
      }
    }
    return chk;
  }

  function bech32HrpExpand(hrp) {
    var result = [];
    for (var i = 0; i < hrp.length; i++) result.push(hrp.charCodeAt(i) >> 5);
    result.push(0);
    for (var i = 0; i < hrp.length; i++) result.push(hrp.charCodeAt(i) & 31);
    return result;
  }

  function bech32Decode(bech) {
    var pos = bech.lastIndexOf("1");
    if (pos < 1 || pos + 7 > bech.length) return null;
    var hrp = bech.slice(0, pos).toLowerCase();
    var data = [];
    for (var i = pos + 1; i < bech.length; i++) {
      var idx = BECH32_CHARSET.indexOf(bech[i].toLowerCase());
      if (idx === -1) return null;
      data.push(idx);
    }
    if (bech32Polymod(bech32HrpExpand(hrp).concat(data)) !== 1) return null;
    return { hrp: hrp, data: data.slice(0, -6) };
  }

  function isValidBech32(address) {
    if (address.length !== 42 && address.length !== 62) return false;
    var d = bech32Decode(address.toLowerCase());
    if (!d) return false;
    if (d.hrp !== "bc") return false;
    return true;
  }

  function isValidBech32Ltc(address) {
    if (/^(ltc1[a-z0-9]{25,62})$/i.test(address)) {
      if (address.length !== 43 && address.length !== 63) return false;
      var d = bech32Decode(address.toLowerCase());
      if (!d) return false;
      if (d.hrp !== "ltc") return false;
      return true;
    }
    if (/^[LM][1-9A-HJ-NP-Za-km-z]{26,33}$/.test(address)) {
      var bytes = base58Decode(address);
      if (!bytes || bytes.length !== 25) return false;
      return base58CheckVerify(bytes);
    }
    return false;
  }

  function base58Decode(str) {
    var bytes = [];
    for (var i = 0; i < str.length; i++) {
      var c = B58.indexOf(str[i]);
      if (c === -1) return null;
      var carry = c;
      for (var j = 0; j < bytes.length; j++) {
        carry += bytes[j] * 58;
        bytes[j] = carry & 0xFF;
        carry = Math.floor(carry / 256);
      }
      while (carry > 0) {
        bytes.push(carry & 0xFF);
        carry = Math.floor(carry / 256);
      }
    }
    var zeros = 0;
    for (var i = 0; i < str.length && str[i] === "1"; i++) zeros++;
    var result = new Uint8Array(zeros + bytes.length);
    for (var i = 0; i < bytes.length; i++) result[zeros + i] = bytes[bytes.length - 1 - i];
    return result;
  }

  function base58CheckVerify(bytes) {
    if (bytes.length < 5) return false;
    var payload = bytes.slice(0, -4);
    var checksum = bytes.slice(-4);
    var hash = sha256Double(payload);
    for (var i = 0; i < 4; i++) {
      if (hash[i] !== checksum[i]) return false;
    }
    return true;
  }

  function isValidSol(address) {
    var bytes = base58Decode(address);
    if (!bytes) return false;
    return bytes.length === 32;
  }

  function isValidTron(address) {
    if (!/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address)) return false;
    var bytes = base58Decode(address);
    if (!bytes || bytes.length !== 25) return false;
    if (bytes[0] !== 0x41) return false;
    return base58CheckVerify(bytes);
  }

  function isValidZecTransparent(address) {
    if (!/^t[13][1-9A-HJ-NP-Za-km-z]{33}$/.test(address)) return false;
    var bytes = base58Decode(address);
    if (!bytes || bytes.length !== 26) return false;
    if (bytes[0] !== 0x1c) return false;
    if (bytes[1] !== 0xb8 && bytes[1] !== 0xbd) return false;
    return base58CheckVerify(bytes);
  }

  var VALIDATORS = {
    "evm": isValidEvm,
    "bech32": isValidBech32,
    "bech32-ltc": isValidBech32Ltc,
    "sol": isValidSol,
    "tron": isValidTron,
    "zec-transparent": isValidZecTransparent
  };

  function validateByType(address, type) {
    var fn = VALIDATORS[type];
    if (!fn) return false;
    return fn(address);
  }

  function selfTest(matrix) {
    var failures = [];
    matrix.forEach(function (entry) {
      var ok = validateByType(entry.address, entry.type);
      if (!ok) failures.push({ asset: entry.asset, network: entry.network, address: entry.address, type: entry.type });
    });
    return failures;
  }

  global.NORTHMIX = global.NORTHMIX || {};
  global.NORTHMIX.validators = {
    isValidEvm: isValidEvm,
    isValidBech32: isValidBech32,
    isValidBech32Ltc: isValidBech32Ltc,
    isValidSol: isValidSol,
    isValidTron: isValidTron,
    isValidZecTransparent: isValidZecTransparent,
    validateByType: validateByType,
    selfTest: selfTest
  };
})(window);
