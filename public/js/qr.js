(function (global) {
  "use strict";

  var EXP = new Array(256);
  var LOG = new Array(256);
  (function () {
    var x = 1;
    for (var i = 0; i < 256; i++) {
      EXP[i] = x;
      LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11D;
    }
  })();

  function gfMul(a, b) {
    if (a === 0 || b === 0) return 0;
    return EXP[(LOG[a] + LOG[b]) % 255];
  }

  function rsGeneratorPoly(degree) {
    var poly = [1];
    for (var i = 0; i < degree; i++) {
      var newPoly = new Array(poly.length + 1).fill(0);
      for (var j = 0; j < poly.length; j++) {
        newPoly[j] ^= poly[j];
        newPoly[j + 1] ^= gfMul(poly[j], EXP[i]);
      }
      poly = newPoly;
    }
    return poly;
  }

  function rsRemainder(data, genPoly) {
    var result = new Array(genPoly.length - 1).fill(0);
    for (var i = 0; i < data.length; i++) {
      var factor = data[i] ^ result[0];
      result.shift();
      result.push(0);
      if (factor !== 0) {
        for (var j = 0; j < genPoly.length; j++) {
          result[j] ^= gfMul(genPoly[j], factor);
        }
      }
    }
    return result;
  }

  var SPECS = [
    null,
    [26, 10, 1, 16, 0, 0],
    [44, 16, 1, 28, 0, 0],
    [70, 26, 1, 44, 0, 0],
    [100, 18, 2, 32, 0, 0],
    [134, 24, 2, 43, 0, 0],
    [172, 16, 4, 27, 0, 0],
    [196, 18, 4, 31, 0, 0],
    [242, 22, 2, 38, 2, 39],
    [292, 22, 3, 36, 2, 37],
    [346, 26, 4, 43, 1, 44],
  ];

  function chooseSpec(byteLen) {
    for (var v = 1; v <= 10; v++) {
      var info = SPECS[v];
      var dataBytes = (info[2] * info[3]) + (info[4] * info[5]);
      var ccBits = v < 10 ? 8 : 16;
      var overhead = Math.ceil((4 + ccBits) / 8);
      if (byteLen + overhead <= dataBytes) return v;
    }
    return -1;
  }

  function BitBuffer() {
    this.bits = [];
  }
  BitBuffer.prototype.put = function (num, len) {
    for (var i = len - 1; i >= 0; i--) {
      this.bits.push((num >> i) & 1);
    }
  };
  BitBuffer.prototype.getBits = function () { return this.bits; };

  function encodeData(text, spec) {
    var info = SPECS[spec];
    var dataBytes = (info[2] * info[3]) + (info[4] * info[5]);
    var totalBytes = info[0];
    var ecBytes = info[1];

    var bb = new BitBuffer();
    bb.put(0x4, 4);
    var ccBits = spec < 10 ? 8 : 16;
    bb.put(text.length, ccBits);
    for (var i = 0; i < text.length; i++) {
      bb.put(text.charCodeAt(i) & 0xFF, 8);
    }
    var totalDataBits = dataBytes * 8;
    while (bb.getBits().length < totalDataBits && bb.getBits().length < totalDataBits) {
      if (totalDataBits - bb.getBits().length >= 4) bb.put(0, 4);
      else { bb.put(0, totalDataBits - bb.getBits().length); break; }
    }
    var bytes = [];
    for (var i = 0; i < bb.getBits().length; i += 8) {
      var b = 0;
      for (var j = 0; j < 8 && i + j < bb.getBits().length; j++) {
        b = (b << 1) | bb.getBits()[i + j];
      }
      bytes.push(b);
    }
    var padBytes = [0xEC, 0x11];
    var pi = 0;
    while (bytes.length < dataBytes) {
      bytes.push(padBytes[pi % 2]);
      pi++;
    }

    var blocks = [];
    var g1 = info[2], d1 = info[3], g2 = info[4], d2 = info[5];
    var offset = 0;
    for (var i = 0; i < g1; i++) {
      var blk = bytes.slice(offset, offset + d1);
      offset += d1;
      var gen = rsGeneratorPoly(ecBytes);
      var rem = rsRemainder(blk, gen);
      blocks.push({ data: blk, ec: rem });
    }
    for (var i = 0; i < g2; i++) {
      var blk = bytes.slice(offset, offset + d2);
      offset += d2;
      var gen = rsGeneratorPoly(ecBytes);
      var rem = rsRemainder(blk, gen);
      blocks.push({ data: blk, ec: rem });
    }

    var result = [];
    var maxDataLen = Math.max(d1, d2);
    for (var i = 0; i < maxDataLen; i++) {
      for (var b = 0; b < blocks.length; b++) {
        if (i < blocks[b].data.length) result.push(blocks[b].data[i]);
      }
    }
    for (var i = 0; i < ecBytes; i++) {
      for (var b = 0; b < blocks.length; b++) {
        result.push(blocks[b].ec[i]);
      }
    }
    return result;
  }

  function buildMatrix(spec, dataCodewords) {
    var size = spec * 4 + 17;
    var matrix = [];
    var reserved = [];
    for (var i = 0; i < size; i++) {
      matrix.push(new Array(size).fill(null));
      reserved.push(new Array(size).fill(false));
    }

    function set(r, c, v) { matrix[r][c] = v; }

    function placeFinder(r, c) {
      for (var dr = -1; dr <= 7; dr++) {
        for (var dc = -1; dc <= 7; dc++) {
          var rr = r + dr, cc = c + dc;
          if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
          reserved[rr][cc] = true;
          var val;
          if (dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6) {
            if (dr === 0 || dr === 6 || dc === 0 || dc === 6) val = true;
            else if (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4) val = true;
            else val = false;
          } else {
            val = false;
          }
          matrix[rr][cc] = val;
        }
      }
    }
    placeFinder(0, 0);
    placeFinder(0, size - 7);
    placeFinder(size - 7, 0);

    if (spec >= 2) {
      var alignPos = getAlignPositions(spec);
      for (var i = 0; i < alignPos.length; i++) {
        for (var j = 0; j < alignPos.length; j++) {
          var r = alignPos[i], c = alignPos[j];
          if (reserved[r][c]) continue;
          placeAlignment(r, c);
        }
      }
    }
    function placeAlignment(r, c) {
      for (var dr = -2; dr <= 2; dr++) {
        for (var dc = -2; dc <= 2; dc++) {
          var rr = r + dr, cc = c + dc;
          reserved[rr][cc] = true;
          if (Math.abs(dr) === 2 || Math.abs(dc) === 2) matrix[rr][cc] = true;
          else if (dr === 0 && dc === 0) matrix[rr][cc] = false;
          else matrix[rr][cc] = true;
        }
      }
      matrix[r][c] = false;
    }

    for (var i = 8; i < size - 8; i++) {
      if (!reserved[6][i]) { matrix[6][i] = (i % 2 === 0); reserved[6][i] = true; }
      if (!reserved[i][6]) { matrix[i][6] = (i % 2 === 0); reserved[i][6] = true; }
    }

    for (var i = 0; i <= 8; i++) {
      if (i !== 6) { reserved[8][i] = true; reserved[i][8] = true; }
      if (i < 8) {
        reserved[8][size - 1 - i] = true;
        reserved[size - 1 - i][8] = true;
      }
    }
    reserved[size - 8][8] = true;
    matrix[size - 8][8] = true;

    var bitIndex = 0;
    var direction = -1;
    var col = size - 1;
    while (col > 0) {
      if (col === 6) col--;
      for (var i = 0; i < size; i++) {
        var row = direction === -1 ? size - 1 - i : i;
        for (var c = 0; c < 2; c++) {
          var cc = col - c;
          if (!reserved[row][cc]) {
            var byteIdx = Math.floor(bitIndex / 8);
            var bitInByte = 7 - (bitIndex % 8);
            var bit = false;
            if (byteIdx < dataCodewords.length) {
              bit = ((dataCodewords[byteIdx] >> bitInByte) & 1) === 1;
            }
            matrix[row][cc] = bit;
            bitIndex++;
          }
        }
      }
      col -= 2;
      direction = -direction;
    }

    for (var r = 0; r < size; r++) {
      for (var c = 0; c < size; c++) {
        if (!reserved[r][c]) {
          if ((r + c) % 2 === 0) matrix[r][c] = !matrix[r][c];
        }
      }
    }

    var fmt = getFormatInfo(0);
    for (var i = 0; i <= 5; i++) matrix[8][i] = ((fmt >> i) & 1) === 1;
    matrix[8][7] = ((fmt >> 6) & 1) === 1;
    matrix[8][8] = ((fmt >> 7) & 1) === 1;
    matrix[7][8] = ((fmt >> 8) & 1) === 1;
    for (var i = 9; i <= 14; i++) matrix[14 - i][8] = ((fmt >> i) & 1) === 1;
    for (var i = 0; i < 8; i++) matrix[size - 1 - i][8] = ((fmt >> i) & 1) === 1;
    for (var i = 8; i < 15; i++) matrix[8][size - 15 + i] = ((fmt >> i) & 1) === 1;

    return matrix;
  }

  var FORMAT_INFO_M = [
    0x5412, 0x5125, 0x5E7C, 0x5B4B,
    0x45F9, 0x40CE, 0x4D97, 0x48A0
  ];
  function getFormatInfo(maskPattern) {
    return FORMAT_INFO_M[maskPattern];
  }

  function getAlignPositions(spec) {
    if (spec < 2) return [];
    var numAlign = Math.floor(spec / 7) + 2;
    var pos = new Array(numAlign);
    pos[0] = 6;
    pos[numAlign - 1] = spec * 4 + 10;
    if (numAlign > 2) {
      var step = Math.ceil((spec * 4 + 12 - pos[numAlign - 1]) / (numAlign - 2) / 2) * 2;
      for (var i = numAlign - 2; i > 0; i--) {
        pos[i] = pos[numAlign - 1] - (numAlign - 1 - i) * step;
      }
    }
    return pos;
  }

  function generate(text) {
    var spec = chooseSpec(text.length);
    if (spec < 0) return null;
    var data = encodeData(text, spec);
    var matrix = buildMatrix(spec, data);
    return { matrix: matrix, size: matrix.length, spec: spec };
  }

  function renderSVG(text, options) {
    options = options || {};
    var cellSize = options.cellSize || 6;
    var margin = options.margin || 4;
    var result = generate(text);
    if (!result) return null;
    var size = result.size;
    var dim = (size + margin * 2) * cellSize;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + dim + ' ' + dim + '" width="' + dim + '" height="' + dim + '">';
    svg += '<rect width="' + dim + '" height="' + dim + '" fill="#FFFFFF"/>';
    for (var r = 0; r < size; r++) {
      for (var c = 0; c < size; c++) {
        if (result.matrix[r][c]) {
          var x = (c + margin) * cellSize;
          var y = (r + margin) * cellSize;
          svg += '<rect x="' + x + '" y="' + y + '" width="' + cellSize + '" height="' + cellSize + '" fill="#000000"/>';
        }
      }
    }
    svg += '</svg>';
    return svg;
  }

  function renderDataURL(text, options) {
    var svg = renderSVG(text, options);
    if (!svg) return null;
    return 'data:image/svg+xml;base64,' + btoa(svg);
  }

  global.NORTHMIX = global.NORTHMIX || {};
  global.NORTHMIX.qr = {
    generate: generate,
    renderSVG: renderSVG,
    renderDataURL: renderDataURL
  };
})(window);
