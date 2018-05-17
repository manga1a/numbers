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
        Construct words from consonants which map to a specific number.</p>
        <table align="center">
          <tr>
            <th>Number</th>
            <th>&lt;=&gt;</th>
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
class Play extends Component {
  constructor(props){
    super(props);
    this.onBtnClick = this.onBtnClick.bind(this);
    //TODO: count up or down depending on input time
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

  onBtnClick(e){
    const num = parseInt(e.target.id, 10);
    const consonants = this.props.consonants;
    if(num === consonants[this.state.idx].n) {
      const newIdx = this.state.idx + 1;
      if(newIdx === consonants.length) {
        //End of challenge
        clearInterval(this.timerId);
        this.setState({cnt: newIdx});
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
            <td><button onClick={this.onBtnClick} id={7}>7</button></td>
            <td><button onClick={this.onBtnClick} id={8}>8</button></td>
            <td><button onClick={this.onBtnClick} id={9}>9</button></td>
          </tr>
          <tr>
            <td><button onClick={this.onBtnClick} id={4}>4</button></td>
            <td><button onClick={this.onBtnClick} id={5}>5</button></td>
            <td><button onClick={this.onBtnClick} id={6}>6</button></td>
          </tr>
          <tr>
            <td><button onClick={this.onBtnClick} id={1}>1</button></td>
            <td><button onClick={this.onBtnClick} id={2}>2</button></td>
            <td><button onClick={this.onBtnClick} id={3}>3</button></td>
          </tr>
          <tr>
            <td colspan='2'><button onClick={this.props.onBack}>
              Back</button></td>
            <td><button onClick={this.onBtnClick} id={0}>0</button></td>
          </tr>
        </table>
      </div>
    );
  }
}

//------------------------------------------------------
class Ending extends Component {
  constructor(props) {
    super(props);
    this.onClickYes = this.onClickYes.bind(this);
    this.onClickNo = this.onClickNo.bind(this);
  }

  onClickYes() {

  }

  onClickNo() {
    this.props.onNo();
  }

  render(){
    return (
      <div>
        <p className="TextMedium">
          Beat your current best<br/> time of {this.props.time}s ?
        </p>
        <button onClick={this.onClickYes}>Yes</button>
        <button onClick={this.onClickNo}>No</button>
      </div>
    );
  }
}

//------------------------------------------------------
//0 = Begin
//1 = Play
//2 = Ending
class Level1 extends Component {
  constructor(props){
    super(props);
    this.switchMode = this.switchMode.bind(this);
    this.goToBegin = this.goToBegin.bind(this);
    this.state = {mode: 2, time: 0};
  }

  switchMode(m){
    this.setState({mode: m})
  }

  goToBegin(t = 0) {
    this.setState({mode: 0, time: t});
  }

  render(){
    var mode;
    if(this.state.mode === 0) {
      mode = <Begin consonants={numberToConsonant}
        onGo={() => {this.switchMode(1)}}/>
    } else if(this.state.mode === 1) {
      mode = <Play consonants={shuffleArray(consonantToNumber)}
        onBack={this.goToBegin}/>
    } else if(this.state.mode === 2) {
      mode = <Ending time={34} onNo={this.goToBegin}/>
    }

    return(
      <div className="App">
        {mode}
      </div>
    );
  }
}

export default Level1;
