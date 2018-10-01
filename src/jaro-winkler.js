(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
      define([], factory);
  } else if (typeof module === 'object' && module.exports) {
      module.exports = factory();
  } else {
      root.JaroWinkler = factory();
  }
}(this, function () {
  "use strict";

  /**
   * Compute the distance between two words
   *
   * @param {string} string1 First word
   * @param {string} string2 Second word
   * @param {Object} user_config Additionnal configuration
   * @return {float} Distance, in range 0 (no similarity) to 1 (exact similarity)
   */
  function distanceJaroWinkler(string1, string2, user_config) {
    let str1 = String(string1), str2 = String(string2);
    let config = setConfig(user_config);

    if (str1.length === 0 || str2.length === 0) {
      return 0;
    }

    if (!config.caseSensitive) {
      str1 = str1.toUpperCase();
      str2 = str2.toUpperCase();
    }

    // if both strings are equal, there is no need to compute the distance
    if (str1 === str2) {
      return 1;
    }

    let max_dist = Math.floor(Math.max(str1.length, str2.length)*0.5) - 1;
    let s1_match = new Array(str1.length);
    let s2_match = new Array(str2.length);

    // find matching char between strings
    let m = 0;  // number of matching char
    let low = 0, high = 0;
    for (let i = 0; i < str1.length; i++) {
      low = i < max_dist ? 0 : i - max_dist;
      high = (i + max_dist > str2.length) ? (str2.length - 1) : (i + max_dist);

      for (let j = low; j <= high; j++) {
        // this avoid counting matching char twice
        if(s1_match[i] !== true && s2_match[j] !== true && str1[i] === str2[j]) {
          m++;
           // store the match
          s1_match[i] = s2_match[j] = true;
          break;
        }
      }
    }

    // if there are no matching characters, there is no similarity
    if (m === 0) {
      return 0;
    }

    // count the number of transpositions
    let offset = 0;
    let transpose = 0;
    for (let i = 0; i < s1_match.length; i++) {
      if (s1_match[i] === true) {

        for (var j = offset; j < s2_match.length; j++) {
          if (s2_match[j] === true) {
            offset = j + 1;
            break;
          }
        }

        if (str1[i] !== str2[j]) {
          transpose++;
        }
      }
    }
    transpose *= 0.5;

    // Jaro score
    let distance = ( m/str1.length + m/str2.length + (m-transpose)/m ) / 3;

    // Jaro–Winkler score: change score based on matching prefix in strings
    if (config.enableWinkler) {
      let len = 0;
      while (str1[len] === str2[len] && len < config.prefixLength) {
        len++;
      }
      distance = distance + len*config.scalingFactor*(1 - distance);
    }

    return distance;
  }

  function setConfig(user_config) {
    let config = {
      caseSensitive: false,
      enableWinkler: true,
      scalingFactor: 0.1,
      prefixLength: 4
    };

    for (var key in config) {
      if (user_config && user_config.hasOwnProperty(key)
      && typeof(user_config[key]) === typeof(config[key])) {
        config[key] = user_config[key];
      }
    }
    config.scalingFactor = Math.min(config.scalingFactor, 0.25);

    return config;
  }

  var JaroWinkler = {
    getDistance: distanceJaroWinkler
  };

  return JaroWinkler;
}));
