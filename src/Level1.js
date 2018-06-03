import React, { Component } from 'react';
import Helpers from './Helpers'

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
    h: 'Both \'t\' and \'d\' have 1 vertical stroke.', id: 0},
  {n: 2, c: 'n', h: 'Simple \'n\' has 2 vertical strokes.', id: 1},
  {n: 3, c: 'm', h: 'Simple \'m\' has 3 vertical strokes.', id: 2},
  {n: 4, c: 'r', h: 'Four ends with \'r\'.', id: 3},
  {n: 5, c: 'l', h: '\'L\' is the roman numeral for 50.', id: 4},
  {n: 6, c: 'j, ch, sh',
    h: 'Script \'j\' tend to have a lower loop, like the numeral 6.', id: 5},
  {n: 7, c: 'k, (hard) c, (hard) g',
    h: '\'K\' looks like two small 7s on their sides.', id: 6},
  {n: 8, c: 'f, v, ph',
    h: 'Script \'f\' tend to have an upper and lower loop, like a figure 8.',
    id: 7},
  {n: 9, c: 'p, b',
    h: '\'P\' and simple \'b\' looks like the numeral 9 transformed.', id: 8},
  {n: 0, c: 's, z',
    h: 'Zero begins with \'z\'. Both \'s\' and \'z\' has 0 vertical strokes.',
    id: 9}
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
      <div className="ui grid">
        {
          //Informative text
        }
        <div className="sixteen wide column">
          <h4 className="ui center aligned header">
            A number maps to one or more consonant.
          </h4>
        </div>
        {
          //Number to consonant mapping
        }
        <div className="four wide column" />
        <div className="eight wide column">
          <h1 className="ui center aligned header">
            {consonant.n}&nbsp;=&gt;&nbsp;{consonant.c}
          </h1>
        </div>
        <div className="four wide column" />
        {
          //Hint
        }
        <div className="sixteen wide column center aligned">
          <div className="ui grey large basic label">
            Hint: {consonant.h}
          </div>
        </div>
        {
          //Navigation buttons
        }
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
        {
          //Progress and go button
        }
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
    const rows = this.props.consonants.map((entry) => (
      <tr key={entry.id}>
        <td />
        <td className="right aligned">
          <h3 className="ui header">{entry.n}&nbsp;=&gt;</h3>
        </td>
        <td>
          <h3 className="ui header">{entry.c}</h3>
        </td>
        <td />
      </tr>
    ));

    return (
      <div className="ui container">
        <table className="ui basic compact table">
          <thead>
            <tr>
              <th className="four wide"></th>
              <th className="four wide right aligned">Number</th>
              <th className="four Wide">Consonant(s)</th>
              <th className="four wide"></th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
        <div className="ui grid">
          <div className="column seven wide" />
          <div className="column two wide">
            <button className="ui positive button"
              onClick={this.props.onGo}>
              Go
            </button>
          </div>
          <div className="column seven wide" />
        </div>
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
      <div className="ui grid">
        {/*Progress and counter*/}
        <div className="row">
          <div className="five wide column" />
          <div className="six wide column">
            <h3 className="ui header center aligned">
              {this.state.cnt}/{this.props.consonants.length}
              &nbsp;|&nbsp;{this.state.sec}s
            </h3>
          </div>
          <div className="five wide column" />
        </div>
        {/*Challenge*/}
        <div className="row">
          <div className="sixteen wide column">
            <h1 className="ui header center aligned">
              {this.props.consonants[this.state.idx].c}
              &nbsp;=&gt;&nbsp;?
            </h1>
          </div>
        </div>
        {/*Input button grid*/}
        <div className="row">
          <div className="six wide column"/>
          <div className="four wide column">
            <div className="3 fluid ui buttons">
              <div className="ui button" onClick={this.onBtnClick}
                id={7}>7</div>
              <div className="ui button" onClick={this.onBtnClick}
                id={8}>8</div>
              <div className="ui button" onClick={this.onBtnClick}
                id={9}>9</div>
            </div>
            <div className="3 fluid ui buttons">
              <div className="ui button" onClick={this.onBtnClick}
                id={4}>4</div>
              <div className="ui button" onClick={this.onBtnClick}
                id={5}>5</div>
              <div className="ui button" onClick={this.onBtnClick}
                id={6}>6</div>
            </div>
            <div className="3 fluid ui buttons">
              <div className="ui button" onClick={this.onBtnClick}
                id={1}>1</div>
              <div className="ui button" onClick={this.onBtnClick}
                id={2}>2</div>
              <div className="ui button" onClick={this.onBtnClick}
                id={3}>3</div>
            </div>
            <div className="2 fluid ui buttons">
              <div className="ui button" onClick={this.props.onBack}>
                Help</div>
              <div className="ui button" onClick={this.onBtnClick}
                id={0}>0</div>
            </div>
          </div>
          <div className="six wide column"/>
        </div>
      </div>
    );
  }
}

//------------------------------------------------------
class Ending extends Component {
  render() {
    return (
      <div className="ui grid">
        <div className="three wide column" />
        <div className="ten wide column">
          <h2 className="ui header center aligned">
            Your best time is {this.props.time} seconds. Beat it?
          </h2>
        </div>
        <div className="three wide column" />
        <div className="five wide column" />
        <div className="six wide column">
          <div className="ui fluid buttons">
            <div className="ui positive button"
              onClick={this.props.onYes}>Yes</div>
            <div className="or"></div>
            <div className="ui button"
              onClick={this.props.onNo}>No</div>
          </div>
        </div>
        <div className="five wide column" />
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
      mode = <Play consonants={Helpers.shuffleArray(consonantToNumber)}
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
