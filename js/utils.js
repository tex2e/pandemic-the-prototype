
class Utils {};

// return random int
//
//   rand(max)      // => int where is [0, max)
//   rand(min, max) // => int where is [min, max)
//
Utils.rand = function (min, max) {
  if (max === undefined) {
    max = min; min = 0;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
