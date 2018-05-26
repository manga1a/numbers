import React, { Component } from 'react';
//import './App.css';

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
  /*
  {c: (<div><i>hard</i> c</div>), n: 7},
  {c: (<div><i>hard</i> g</div>), n: 7},
  */
  {c: '(hard) c', n: 7},
  {c: '(hard) g', n: 7},
  {c: 'f', n: 8},
  {c: 'v', n: 8},
  {c: 'ph', n: 8},
  {c: 'p', n: 9},
  {c: 'b', n: 9}];

const numberToConsonant = [
  {n: 1, c: 't, d, th',
    h: 'Both \'t\' and \'d\' have 1 vertical stroke.'},
  {n: 2, c: 'n', h: 'Simple \'n\' has 2 vertical strokes.'},
  {n: 3, c: 'm', h: 'Simple \'m\' has 3 vertical strokes.'},
  {n: 4, c: 'r', h: 'Four ends with \'r\'.'},
  {n: 5, c: 'l', h: '\'L\' is the roman numeral for 50.'},
  {n: 6, c: 'j, ch, sh',
    h: 'Script \'j\' tend to have a lower loop, like the numeral 6.'},
  //{n: 7, c: (<div>k, <i>hard</i> c, <i>hard</i> g</div>),
  {n: 7, c: 'k, (hard) c, (hard) g',
    h: '\'K\' looks like two small 7s on their sides.'},
  {n: 8, c: 'f, v, ph',
    h: 'Script \'f\' tend to have an upper and lower loop, like a figure 8.'},
  {n: 9, c: 'p, b',
    h: '\'P\' and simple \'b\' looks like the numeral 9 transformed.'},
  {n: 0, c: 's, z',
    h: 'Zero begins with \'z\'. Both \'s\' and \'z\' has 0 vertical strokes.'}
];

//------------------------------------------------------
class Intro extends Component {
  constructor(props) {
    super(props);
    this.onPrevious = this.onPrevious.bind(this);
    this.onNext = this.onNext.bind(this);
    this.state = {idx: 0, count: 1};
    this.length = this.props.consonants.length;
  }

  onPrevious() {
    this.setState({idx: this.state.idx - 1});
  }

  onNext() {
    const newIdx = this.state.idx + 1;
    const newCount = (this.state.count <= newIdx) ?
      (this.state.count + 1) : this.state.count;
    this.setState({idx: newIdx, count: newCount});
  }

  render() {
    const consonant = this.props.consonants[this.state.idx];
    const prevStatus = (0 === this.state.idx) ? 'disabled' : '';
    const nextStatus = ((this.length - 1) === this.state.idx) ?
      'disabled' : '';
    const goStatus = (this.state.count === this.length) ? '' : 'disabled';

    return (
      <div className="ui four column grid">
        {/*informative text*/}
        <div className="two column centered row">
          <div className="column">
            <h4 className="ui center aligned header">
              A number maps to one or more consonant.
            </h4>
          </div>
        </div>
        {/*number to consonant mapping*/}
        <div className="one column centered row">
          <div className="column">
            <h1 className="ui center aligned header">
              {consonant.n}&nbsp;=&gt;&nbsp;{consonant.c}
            </h1>
          </div>
        </div>
        {/*navigation buttons*/}
        <div className="one column centered row">
          <div className="ui buttons">
            <button className={`ui labeled icon button ${prevStatus}`}
              onClick={this.onPrevious}>
              <i className="left chevron icon"></i>
              Previous
            </button>
            <button className={`ui right labeled icon button ${nextStatus}`}
              onClick={this.onNext}>
              Next
              <i className="right chevron icon"></i>
            </button>
          </div>
        </div>
        {/*Progress and go button*/}
        <div className="one column centered row">
          <div className="ui labeled button" tabIndex="0">
            <div className={`ui positive button ${goStatus}`}
              onClick={this.props.onGo}>
              Go
            </div>
            <div className="ui basic left pointing label">
              {this.state.count}/{this.length}
            </div>
          </div>
        </div>
    </div>
    );
  }
}

//------------------------------------------------------
class Help extends Component {
  render() {
    const rows = this.props.consonants.map((entry) =>
      <tr>
        <td>{entry.n}</td>
        <td>=&gt;</td>
        <td>{entry.c}</td>
      </tr>
    );

    return(
      <div>
        <table align="center" cellpadding="5">
          <tr>
            <th>Number</th>
            <th>=&gt;</th>
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
  constructor(props) {
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
            <td className="TextMedium">{this.state.sec}s</td>
          </tr>
        </table>
        <table align="center">
          <tr>
            <td>
              <p className="TextLarge">
                {this.props.consonants[this.state.idx].c}
              </p>
            </td>
            <td>
              <p className="TextLarge">&nbsp;=&gt; ?</p>
            </td>
          </tr>
        </table>
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
                Help
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
          Your best time is {this.props.time} seconds.<br/>
          Wanna beat it?
        </p>
        <button className="App-button" onClick={this.props.onYes}>Yes</button>
        <button className="App-button" onClick={this.props.onNo}>No</button>
      </div>
    );
  }
}

//------------------------------------------------------
const INTRO = 0;
const HELP = 1;
const PLAY = 2;
const ENDING = 3;

class Level1 extends Component {
  constructor(props) {
    super(props);
    this.goToIntro = this.goToIntro.bind(this);
    this.goToHelp = this.goToHelp.bind(this);
    this.goToPlay = this.goToPlay.bind(this);
    this.goToEnding = this.goToEnding.bind(this);
    this.state = {mode: INTRO, bestTime: 0};
  }

  goToIntro() {
    this.setState({mode: INTRO});
  }

  goToHelp() {
    this.setState({mode: HELP});
  }

  goToPlay() {
    this.setState({mode: PLAY});
  }

  goToEnding(t) {
    let newBestTime = t;
    // keep previous time if new is worst
    if(0 < this.state.bestTime && this.state.bestTime < t) {
        newBestTime = this.state.bestTime;
    }
    this.setState({mode: ENDING, bestTime: newBestTime});
  }

  render() {
    var mode;
    if(this.state.mode === INTRO) {
      mode = <Intro consonants={numberToConsonant}
        onGo={this.goToPlay}/>
    } else if(this.state.mode === HELP) {
      mode = <Help consonants={numberToConsonant}
        onGo={this.goToPlay}/>
    } else if(this.state.mode === PLAY) {
      mode = <Play consonants={shuffleArray(consonantToNumber)}
        onBack={this.goToHelp} onComplete={this.goToEnding} />
    } else if(this.state.mode === ENDING) {
      mode = <Ending time={this.state.bestTime}
        onYes={this.goToPlay} onNo={this.goToHelp}/>
    }

    return(
      <div>
        {mode}
      </div>
    );
  }
}

export default Level1;
