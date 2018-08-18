var Consonant = (function(){

  const c = {
    0: 's, z', //0
    1: 't, d, th',
    2: 'n',
    3: 'm',
    4: 'r',
    5: 'l',
    6: 'j, ch, sh',
    7: 'k, c, g',
    8: 'f, v, ph',
    9: 'p, b',
  };

  return {
    ForNumber: c,
  };
})();

export default Consonant;
