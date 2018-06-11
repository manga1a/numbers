
const Major = (function major(){
  const system = {
    '0': 'oZzy',
    '1': 'Tea',
    '2': 'Noah',
    '3': 'Mo',
    '4': 'Ray',
    '5': 'Lee',
    '6': 'aSH',
    '7': 'Key',
    '8': 'Fee',
    '9': 'Bee',

    '00': 'ZeuS',
    '01': 'SuiT',
    '02': 'SwaN',
    '03': 'SuMo',
    '04': 'ZoRro',
    '05': 'SeaL',
    '06': 'SaSH',
    '07': 'SoCK',
    '08': 'SoFa',
    '09': 'SoaP',

    '10': 'DiCe',
    '11': 'TeD',
    '12': 'TiN',
    '13': 'DaM',
    '14': 'TyRe',
    '15': 'DoLl',
    '16': 'DiSH',
    '17': 'TaCK',
    '18': 'DoVe',
    '19': 'TaPe',

    '20': 'NoSe',
    '21': 'NeT',
    '22': 'NuN',
    '23': 'NeMo',
    '24': 'NeRo',
    '25': 'NaiL',
    '26': 'NiCHe',
    '27': 'NeCK',
    '28': 'kNiFe',
    '29': 'NiB',

    '30': 'MouSe',
    '31': 'MaT',
    '32': 'MiNe',
    '33': 'MiMe',
    '34': 'MoweR',
    '35': 'MoLe',
    '36': 'MatCH',
    '37': 'MiC',
    '38': 'MoVie',
    '39': 'MoP',

    '40': 'RoSe',
    '41': 'RaT',
    '42': 'RaiN',
    '43': 'RuM',
    '44': 'RoweR',
    '45': 'RaiL',
    '46': 'RiDGe',
    '47': 'RaKe',
    '48': 'RooF',
    '49': 'RoPe',
  };

/*
http://www.real-memory-improvement.com/the-major-system-peg-words.html
1	Tie	23	Nemo	45	Rail	67	Jug	89	Fob
2	Noah	24	Nero	46	Ridge	68	Chef	90	Bus
3	Mo	25	Nail	47	Rake	69	Jeep	91	Bat
4	Ray	26	Niche	48	Roof	70	Case	92	Bin
5	Lee	27	Neck	49	Rope	71	Cat	93	Bomb
6	Ash	28	Knife	50	Lace	72	Caine	94	Bear
7	Key	29	Nib	51	Light	73	Comb	95	Bell
8	Fee	30	Mouse	52	Lion	74	Car	96	Badge
9	Bee	31	Mat	53	Lamb	75	Coal	97	Book
10	Toes	32	Mine	54	Lorry	76	Cage	98	Beef
11	Ted	33	Mime	55	Lulu	77	Cake	99	Baby
12	Tin	34	Mower	56	Latch	78	Cuff	0	Ozzy
13	Tomb	35	Mole	57	Lock	79	Cop	00	Zeus
14	Tyre	36	Match	58	Leaf	80	Fez	01	Suit
15	Doll	37	Mic	59	Lip	81	Fit	02	Swan
16	Dish	38	Movie	60	Cheese	82	Fan	03	Sumo
17	Tack	39	Mop	61	Jet	83	Foam	04	Zorro
18	Dove	40	Rose	62	Chain	84	Fire	05	Seal
19	Tape	41	Rat	63	Jam	85	File	06	Sash
20	Nose	42	Rain	64	Chair	86	Fish	07	Sock
21	Net	43	Ram	65	Gel	87	Fig	08	Sofa
22	Nun	44	Rower	66	Judge	88	Fife	09	Soap
*/
  const playSet = [
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '00', '01', '02', '03', '04', '05', '06', '07', '08', '09'],

    ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23', '24', '25', '26', '27', '28', '29'],

    ['30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
    '40', '41', '42', '43', '44', '45', '46', '47', '48', '49'],
  ];

  return {
    System: system,
    PlaySet: playSet,
  };
})();


export default Major;
