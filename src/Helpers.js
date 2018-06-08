const Helpers = (function helpers(){

  // shuffle a given array in-place, and return the same
  function shuffleArray(arr) {
    var currentIdx = arr.length, tempVal, randomIdx;
    while(0 !== currentIdx) {
      randomIdx = Math.floor(Math.random() * currentIdx);
      currentIdx -= 1;

      tempVal = arr[currentIdx];
      arr[currentIdx] = arr[randomIdx];
      arr[randomIdx] = tempVal;
    }

    return arr;
  }

  // create a shuffled array from given sequence
  function createShuffledArray(start, end) {
    var arr = [];
    for(let i = start; i < end; i++) {
      arr.push(i);
    }

    return shuffleArray(arr);
  }

  // API
  return {
    shuffleArray : shuffleArray,
    createShuffledArray: createShuffledArray,
  };
})();

export default Helpers;
