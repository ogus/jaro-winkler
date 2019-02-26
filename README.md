# Jaro-Winkler distance

An algorithm to compute strings similarity / distance.

For an accurate description, see [Wikipedia](https://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance).

## Usage

```js
JaroWinkler.distance("qwerty", "qwertyu");
// output: 0.028571[...]

JaroWinkler.distance("foo", "");
// output: 1

JaroWinkler.similarity("one", "once");
// output: 0.933333[...]

JaroWinkler.similarity("One", "once", {caseSensitive: true});
// output: 0.722222[...]
```


## API

The module has two method, one for similarity and one for distance

 + They both accept the same input arguments
 + They both return a value in the range [0, 1]
 + They are complementary: `similarity = 1 - distance` *(with perfect floating point precision)*


### `JaroWinkler.similarity(string1, string2, inputConfig={})`

Takes two strings as input, and an optionnal configuration, and compute their similarity.

It returns a value in value in the range `[0, 1]`. A value of `0` corresponds to no similarity, a value of `1` corresponds to complete similarity.

### `JaroWinkler.distance(string1, string2, inputConfig={})`

Takes two strings as input, and an optionnal configuration, and compute their similarity.

It returns a value in value in the range `[0, 1]`. A value of `0` corresponds to no distance, a value of `1` corresponds to the maximum distance.


### Configuration

 + `caseSensitive`: *boolean*, indicates if the similarity should be case-sensitive (default: `false`)
 + `enableWinkler`: *boolean*, indicates if the Winkler score modifier should be used (default: `true`)
 + `scalingFactor`: *float*, set how much the score is adjusted to common prefixes (default: `0.25`)
 + `prefixLength`: *integer*, set the length of words prefix (default: `4`)

This is the default config:
```js
var config = {
  caseSensitive: false,
  enableWinkler: true,
  scalingFactor: 0.1,
  prefixLength: 4
};
```

## Installation

The module can be installed from `npm`

```js
npm install @ogus/jaro-winkler
```

It can also be installed by downloading the repo & including the `jaro-winkler.js` file in your project.


## License

This project is licensed under the WTFPL - see [LICENSE](LICENSE) for more details
