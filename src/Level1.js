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
class Begin extends Component {
  render(){
    const rows = this.props.consonants.map((entry) =>
      <tr>
        <td>{entry.n}</td>
        <td>&lt;=&gt;</td>
        <td>{entry.c}</td>
      </tr>
    );

    return(
      <div>
        <p>Words are easily memorized than numbers.<br/>
        Construct words from consonants,<br/>
        which map to a specific number.</p>
        <table align="center">
          <tr>
            <th>Number</th>
            <th>&lt;=&gt;</th>
            <th>Consonants</th>
          </tr>
          {rows}
        </table>
        <button onClick={this.props.onGo} className="App-button">
          Got It!
        </button>
      </div>
    );
  }
}

//------------------------------------------------------
class Play extends Component {
  constructor(props){
    super(props);
    this.onBtnClick = this.onBtnClick.bind(this);
    this.state = {idx: 0, cnt: 0, sec: 0};
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

  onBtnClick(e) {
    const num = parseInt(e.target.id, 10);
    const consonants = this.props.consonants;
    if(num === consonants[this.state.idx].n) {
      const newIdx = this.state.idx + 1;
      if(newIdx === consonants.length) {
        //End of challenge
        this.props.onComplete(this.state.sec);
        //clearInterval(this.timerId);
        //this.setState({cnt: newIdx});
      } else {
        this.setState({idx: newIdx, cnt: newIdx});
      }
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
          {this.props.consonants[this.state.idx].c} =&gt; ?
        </p>
        <table align="center">
          <tr>
            <td><button className="App-button" onClick={this.onBtnClick}
              id={7}>7</button></td>
            <td><button className="App-button" onClick={this.onBtnClick}
              id={8}>8</button></td>
            <td><button className="App-button" onClick={this.onBtnClick}
              id={9}>9</button></td>
          </tr>
          <tr>
            <td><button className="App-button" onClick={this.onBtnClick}
              id={4}>4</button></td>
            <td><button className="App-button" onClick={this.onBtnClick}
              id={5}>5</button></td>
            <td><button className="App-button" onClick={this.onBtnClick}
              id={6}>6</button></td>
          </tr>
          <tr>
            <td><button className="App-button" onClick={this.onBtnClick}
              id={1}>1</button></td>
            <td><button className="App-button" onClick={this.onBtnClick}
              id={2}>2</button></td>
            <td><button className="App-button" onClick={this.onBtnClick}
              id={3}>3</button></td>
          </tr>
          <tr>
            <td colspan='2'>
              <button className="App-button" onClick={this.props.onBack}>
                Back
              </button>
            </td>
            <td><button className="App-button" onClick={this.onBtnClick}
              id={0}>0</button></td>
          </tr>
        </table>
      </div>
    );
  }
}

//------------------------------------------------------
class Ending extends Component {

  render() {
    return (
      <div>
        <p className="TextMedium">
          Your best time is {this.props.time}s.<br/>
          Wanna beat it?
        </p>
        <button className="App-button" onClick={this.props.onYes}>Yes</button>
        <button className="App-button" onClick={this.props.onNo}>No</button>
      </div>
    );
  }
}

//------------------------------------------------------
const BEGIN = 0;
const PLAY = 1;
const ENDING = 2;

class Level1 extends Component {
  constructor(props) {
    super(props);
    this.goToBegin = this.goToBegin.bind(this);
    this.goToPlay = this.goToPlay.bind(this);
    this.goToEnding = this.goToEnding.bind(this);
    this.state = {mode: BEGIN, bestTime: 0};
  }

  goToBegin() {
    this.setState({mode: BEGIN, bestTime: 0});
  }

  goToPlay() {
    this.setState({mode: PLAY});
  }

  goToEnding(t) {
    let newBestTime = t;
    if(0 < this.state.bestTime && this.state.bestTime < t) {
        newBestTime = this.state.bestTime;
    }
    this.setState({mode: ENDING, bestTime: newBestTime});
  }

  render() {
    var mode;
    if(this.state.mode === BEGIN) {
      mode = <Begin consonants={numberToConsonant}
        onGo={this.goToPlay}/>
    } else if(this.state.mode === PLAY) {
      mode = <Play consonants={shuffleArray(consonantToNumber)}
        onBack={this.goToBegin} onComplete={this.goToEnding} />
    } else if(this.state.mode === ENDING) {
      mode = <Ending time={this.state.bestTime}
        onYes={this.goToPlay} onNo={this.goToBegin}/>
    }

    return(
      <div className="App">
        {mode}
      </div>
    );
  }
}

export default Level1;
