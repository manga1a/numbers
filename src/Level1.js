import React, { Component } from 'react';
import './App.css';

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

//Number with consonants
/*
0: s, z
1: t, d, th
2: n
3: m
4: r
5: l
6: j, ch, sh
7: k, c, g, q, ck
8: f, v, ph
9: p, b
*/

const consonantToNumber = [
  {c: 's', n: 0},
  {c: 'z', n: 0},
  {c: 't', n: 1},
  {c: 'd', n: 1},
  {c: 'th', n: 1},
  {c: 'n', n: 2},
  {c: 'm', n: 3},
  {c: 'r', n: 4},
  {c: 'l', n: 5},
  {c: 'j', n: 6},
  {c: 'ch', n: 6},
  {c: 'sh', n: 6},
  {c: 'k', n: 7},
  {c: 'c', n: 7},
  {c: 'g', n: 7},
  {c: 'f', n: 8},
  {c: 'v', n: 8},
  {c: 'ph', n: 8},
  {c: 'p', n: 9},
  {c: 'b', n: 9}];

const numberToConsonant = [
  {n: 0, c: 's, z'},
  {n: 1, c: 't, d, th'},
  {n: 2, c: 'n'},
  {n: 3, c: 'm'},
  {n: 4, c: 'r'},
  {n: 5, c: 'l'},
  {n: 6, c: 'j, ch, sh'},
  {n: 7, c: 'k, c, g'},
  {n: 8, c: 'f, v, ph'},
  {n: 9, c: 'p, b'}
];

//------------------------------------------------------
class ShowConsonants extends Component {
  constructor(props){
    super(props);
  }

  render(){
    const rows = this.props.consonants.map((entry) =>
      <tr>
        <td>{entry.n}</td>
        <td>{entry.c}</td>
      </tr>
    );

    return(
      <div>
        <table align="center">
          <tr>
            <th>Number</th>
            <th>Consonants</th>
          </tr>
          {rows}
        </table>
        <button onClick={this.props.onGo}>Go</button>
      </div>
    );
  }
}

//------------------------------------------------------
class ChallengeConsonants extends Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {idx: 0, cnt: 0, value: '', sec: 0};
  }

  componentDidMount() {
    this.timerId = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  tick(){
    this.setState({sec: this.state.sec + 1});
  }

  handleChange(e) {
    const num = parseInt(e.target.value, 10);
    const consonants = this.props.consonants;
    if(num === consonants[this.state.idx].n) {
      const newIdx = this.state.idx + 1;
      if(newIdx === consonants.length) {
        //End of challenge
        clearInterval(this.timerId);
        this.setState({cnt: newIdx, value: ''});
      } else {
        this.setState({idx: newIdx, cnt: newIdx, value: ''});
      }
    } else {
        this.setState({value: e.target.value});
    }
  }

  render(){
    return (
      <div>
        <table align="center">
          <tr>
            <td className="TextMedium">
              {this.state.cnt}/{this.props.consonants.length} |
            </td>
            <td>{this.state.sec}s</td>
          </tr>
        </table>
        <p className="TextLarge">
          {this.props.consonants[this.state.idx].c}
        </p>
        <input type='text' value={this.state.value}
          onChange={this.handleChange} />
        <br/>
        <button onClick={this.props.onBack}>Back</button>
      </div>
    );
  }
}

//------------------------------------------------------
class Level1 extends Component {
  constructor(props){
    super(props);
    this.switchMode = this.switchMode.bind(this);
    this.state = {isChallenge: true};
  }

  switchMode(){
    this.setState({isChallenge: !this.state.isChallenge})
  }

  render(){
    const mode = this.state.isChallenge ? (
      <ChallengeConsonants consonants={shuffleArray(consonantToNumber)}
        onBack={this.switchMode}/>
    ) : (
      <ShowConsonants consonants={numberToConsonant}
        onGo={this.switchMode}/>
    );
    return(
      <div className="App">
        {mode}
      </div>
    );
  }
}

export default Level1;
