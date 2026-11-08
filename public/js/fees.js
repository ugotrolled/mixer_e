(function (global) {
  "use strict";

  const SERVICE_FEE_RATE = 0.015;
  const SERVICE_FEE_LABEL = "1.5%";

  function parseAmount(raw, maxDecimals) {
    if (raw === null || raw === undefined) {
      return { ok: false, error: "Amount required." };
    }
    const s = String(raw).trim();
    if (s === "") {
      return { ok: false, error: "Amount required." };
    }
    if (!/^\d*(\.\d*)?$/.test(s)) {
      return { ok: false, error: "Only digits and a single dot are allowed." };
    }
    if (s === "." || s === "") {
      return { ok: false, error: "Enter a valid amount." };
    }
    const parts = s.split(".");
    const whole = parts[0] === "" ? "0" : parts[0];
    let frac = parts.length > 1 ? parts[1] : "";
    const decimals = frac.length;
    if (maxDecimals !== undefined && decimals > maxDecimals) {
      return { ok: false, error: "Too many decimal places for this asset." };
    }
    const wholeNorm = whole.replace(/^0+(?=\d)/, "");
    return {
      ok: true,
      value: { whole: wholeNorm || "0", frac: frac, decimals: decimals }
    };
  }

  function mulRate(amount, rate, outDecimals) {
    const aStr = amount.whole + amount.frac;
    const aScaled = BigInt(aStr);
    const aScale = BigInt(10) ** BigInt(amount.decimals);
    const q = 1000;
    const p = Math.round(rate * q);
    const numerator = aScaled * BigInt(p);
    const denominator = aScale * BigInt(q);
    const outScale = BigInt(10) ** BigInt(outDecimals);
    const scaled = (numerator * outScale) / denominator;
    const s = scaled.toString().padStart(outDecimals + 1, "0");
    const wholePart = s.slice(0, s.length - outDecimals) || "0";
    let fracPart = s.slice(s.length - outDecimals);
    fracPart = fracPart.replace(/0+$/, "");
    return fracPart ? wholePart + "." + fracPart : wholePart;
  }

  function formatDisplay(decStr) {
    if (decStr === null || decStr === undefined || decStr === "") return "0";
    const s = String(decStr);
    const neg = s.startsWith("-");
    const body = neg ? s.slice(1) : s;
    const parts = body.split(".");
    let whole = parts[0];
    const frac = parts.length > 1 ? parts[1] : "";
    whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const out = frac ? whole + "." + frac : whole;
    return (neg ? "-" : "") + out;
  }

  function subtract(aStr, bStr) {
    const a = toBigIntScaled(aStr);
    const b = toBigIntScaled(bStr);
    const scale = a.scale >= b.scale ? a.scale : b.scale;
    const av = rescale(a, scale);
    const bv = rescale(b, scale);
    const r = av - bv;
    return fromBigIntScaled(r, scale);
  }

  function add(aStr, bStr) {
    const a = toBigIntScaled(aStr);
    const b = toBigIntScaled(bStr);
    const scale = a.scale >= b.scale ? a.scale : b.scale;
    const av = rescale(a, scale);
    const bv = rescale(b, scale);
    return fromBigIntScaled(av + bv, scale);
  }

  function toBigIntScaled(decStr) {
    const s = String(decStr).trim();
    if (s === "") return { v: 0n, scale: 0 };
    const neg = s.startsWith("-");
    const body = neg ? s.slice(1) : s;
    const parts = body.split(".");
    const whole = parts[0] === "" ? "0" : parts[0];
    const frac = parts.length > 1 ? parts[1] : "";
    return { v: BigInt((neg ? "-" : "") + (whole + frac || "0")), scale: frac.length };
  }

  function rescale(x, targetScale) {
    if (x.scale === targetScale) return x.v;
    if (x.scale < targetScale) {
      return x.v * (BigInt(10) ** BigInt(targetScale - x.scale));
    }
    return x.v / (BigInt(10) ** BigInt(x.scale - targetScale));
  }

  function fromBigIntScaled(v, scale) {
    const neg = v < 0n;
    const abs = neg ? -v : v;
    const s = abs.toString().padStart(scale + 1, "0");
    const whole = s.slice(0, s.length - scale) || "0";
    let frac = s.slice(s.length - scale);
    frac = frac.replace(/0+$/, "");
    const out = frac ? whole + "." + frac : whole;
    return (neg ? "-" : "") + out;
  }

  function calculate(amountRaw, asset, networkFee) {
    const parsed = parseAmount(amountRaw, asset ? asset.decimals : undefined);
    if (!parsed.ok) {
      return { ok: false, error: parsed.error };
    }
    if (parsed.value.whole === "0" && parsed.value.frac === "") {
      return { ok: false, error: "Amount must be greater than zero." };
    }
    const gross = (parsed.value.whole === "0" && parsed.value.frac === "" ? "0" : parsed.value.whole + (parsed.value.frac ? "." + parsed.value.frac : ""));

    const feeOutDecimals = Math.min(asset ? asset.decimals : 8, 8);
    const serviceFee = mulRate(parsed.value, SERVICE_FEE_RATE, feeOutDecimals);

    const netBeforeNetwork = subtract(gross, serviceFee);

    const netFeeStr = networkFee && String(networkFee).trim() !== "" ? String(networkFee).trim() : "0";

    const net = subtract(netBeforeNetwork, netFeeStr);

    return {
      ok: true,
      error: null,
      gross: gross,
      serviceFeeRate: SERVICE_FEE_LABEL,
      serviceFee: serviceFee,
      networkFee: netFeeStr,
      netBeforeNetwork: netBeforeNetwork,
      net: net,
      display: {
        gross: formatDisplay(gross),
        serviceFee: formatDisplay(serviceFee),
        networkFee: formatDisplay(netFeeStr),
        net: formatDisplay(net)
      }
    };
  }

  global.NORTHMIX = global.NORTHMIX || {};
  global.NORTHMIX.fees = {
    SERVICE_FEE_RATE: SERVICE_FEE_RATE,
    SERVICE_FEE_LABEL: SERVICE_FEE_LABEL,
    parseAmount: parseAmount,
    calculate: calculate,
    formatDisplay: formatDisplay,
    add: add,
    subtract: subtract
  };
})(window);
