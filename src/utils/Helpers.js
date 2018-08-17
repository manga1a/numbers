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

  // save in localStorage
  function saveState(key, state) {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(key, serializedState);
      console.log(`Saving state of ${key}...`);
    } catch(err) {
      console.log('Failed to save state: ' + err);
    }
  }

  // retrive local storage
  function loadState(key) {
    try {
      const serializedState = localStorage.getItem(key);
      if(serializedState === null) {
        console.log(`Empty state of ${key}`);
        return undefined;
      }
      console.log(`Loading state of ${key}...`);
      return JSON.parse(serializedState);
    } catch(err) {
      return undefined;
    }
  }

  // API
  return {
    shuffleArray : shuffleArray,
    createShuffledArray: createShuffledArray,
    saveState: saveState,
    loadState: loadState,
  };
})();

export default Helpers;
