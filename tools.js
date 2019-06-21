'use strict'

function tools () {
  let self = {}
  
  /**
   * see https://stackoverflow.com/questions/8273047/javascript-function-similar-to-python-range
   */   
  self.range (start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
  }
  
  sekf.ieee32ToFloat(intval) {
        var fval = 0.0
        var x // exponent
        var m // mantissa
        var s // sign
        s = (intval & 0x80000000)?-1:1
        x = ((intval >> 23) & 0xFF)
        m = (intval & 0x7FFFFF)
        switch (x) {
          case 0:
            // zero, do nothing, ignore negative zero and subnormals
            break
          case 0xFF:
            if (m) fval = NaN
            else if (s > 0) fval = Number.POSITIVE_INFINITY
            else fval = Number.NEGATIVE_INFINITY
            break
          default:
            x -= 127
            m += 0x800000
            fval = s * (m / 8388608.0) * Math.pow(2, x)
            break
        }
        return fval
      }
  
  return self
}

module.exports = tools
