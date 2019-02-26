(function (root, factory) {
  if (typeof define === 'function' && define.amd) { define([], factory); }
  else if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.JaroWinkler = factory(); }
}(this, function () { 'use strict';

  /**
   * Compute the similarity between two Strings
   *
   * @param {string} str1 First string
   * @param {string} str2 Second string
   * @param {Object} inputConfig Additionnal configuration
   * @return {float} Similarity, in range 0 (no similarity) to 1 (exact similarity)
   */
  function getSimilarity(str1, str2, inputConfig) {
    // if a string is empty, similarity is null
    if (str1.length === 0 || str2.length === 0) {
      return 0;
    }

    var config = setConfig(inputConfig);
    if (!config.caseSensitive) {
      str1 = str1.toUpperCase();
      str2 = str2.toUpperCase();
    }

    // if both strings are equal, similarity is max
    if (str1 === str2) {
      return 1;
    }

    var distanceMax = Math.floor(Math.max(str1.length, str2.length)*0.5) - 1;
    // find matching char between strings
    var match = [new Array(str1.length), new Array(str2.length)];
    // number of matching char
    var m = 0;
    var low = 0, high = 0;
    for (var i = 0; i < str1.length; i++) {
      low = i < distanceMax ? 0 : i - distanceMax;
      high = (i + distanceMax > str2.length) ? (str2.length - 1) : (i + distanceMax);

      for (var j = low; j <= high; j++) {
        // this avoid counting matching char twice
        if(match[0][i] !== true && match[1][j] !== true && str1[i] === str2[j]) {
          m++;
           // store the matching char
          match[0][i] = match[1][j] = true;
          break;
        }
      }
    }

    // if there are no matching characters, there is no similarity
    if (m === 0) {
      return 0;
    }

    // count the number of transpositions
    var offset = 0;
    var transposition = 0;
    for (var i = 0; i < match[0].length; i++) {
      if (match[0][i] === true) {

        for (var j = offset; j < match[1].length; j++) {
          if (match[1][j] === true) {
            offset = j + 1;
            break;
          }
        }

        if (str1[i] !== str2[j]) {
          transposition++;
        }
      }
    }

    // Jaro score
    var similarity = (m/str1.length + m/str2.length + (m - transposition*0.5)/m) / 3;

    // Jaro–enableWinkler score: change score based on matching prefixes in strings
    if (config.enableWinkler) {
      var len = 0;
      while (str1[len] === str2[len] && len < config.prefixLength) {
        len++;
      }
      similarity = similarity + len*config.scalingFactor*(1 - similarity);
    }

    return similarity;
  }

  function setConfig(inputConfig) {
    var config = {
      caseSensitive: false,
      enableWinkler: true,
      scalingFactor: 0.1,
      prefixLength: 4
    };

    for (var key in config) {
      if (inputConfig.hasOwnProperty(key) && typeof(inputConfig[key]) === typeof(config[key])) {
        config[key] = inputConfig[key];
      }
    }
    config.scalingFactor = Math.min(config.scalingFactor, 0.25);

    return config;
  }

  var JaroWinkler = {
    similarity: function (string1, string2, inputConfig) {
      var result = getSimilarity(String(string1), String(string2), inputConfig || {});
      return result;
    },
    distance: function (string1, string2, inputConfig) {
      var result = getSimilarity(String(string1), String(string2), inputConfig || {});
      return 1 - result;
    }
  };

  return JaroWinkler;
}));
