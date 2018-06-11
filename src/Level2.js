import React, { Component } from 'react';
import Major from './Major'
import Helpers from './Helpers'

/*
https://en.wikipedia.org/wiki/Leitner_system

Keep numbers 00 to 99 with pegs shuffled in bucket 0.
Show n (e.g. 5) items from bucket 0, each for a duration of t (e.g. 3) seconds.
Recall those numbers in sequence. Time limit???
Add successful items to bucket 1, while keeping failing items at bucket 0.
Continue until bucket 0 is empty.
*/

//------------------------------------------------------
// Button grid
class ButtonGrid extends Component {
  constructor(props){
    super(props);
    this.onBtnClick = this.onBtnClick.bind(this);
  }

  onBtnClick(e) {
    //const num = parseInt(e.target.id, 10);
    //console.log('clicked: ' + e.target.id)
    this.props.onClick(e.target.id);
  }

  render() {
    return (
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
          <div className="ui button" onClick={this.onBtnClick}
            id={0}>0</div>
        </div>
        <div className="six wide column"/>
      </div>
    );
  }
}

//------------------------------------------------------
// A flash card
function Card(props) {
  const peg = props.showPeg ? (
    <div className="content">
      <div
        className="ui center aligned header"
        style={{fontSize: 32 + 'px'}}
      >
        {props.peg}
      </div>
    </div>
  ) : <span/>;

  return (
    <div className="ui centered card">
      <div
        className="ui center aligned header"
        style={{fontSize: 40 + 'px'}}
      >
        {props.number}
      </div>
      {peg}
    </div>
  );
}

//------------------------------------------------------
const DEFAULT = 0;
const FOCUSED = 1;
const PASSED = 2;
const FAILED = 3;

// Single number input
class InputCell extends Component {
  constructor(props) {
    super(props);
    this.width = props.expected.length > 1 ? 50 : 40;
    this.placeholder = props.expected.length > 1 ? '??' : '?';
  }

  render () {
    const focus = this.props.state === FOCUSED ? 'focus' : '';
    const border = this.props.state === PASSED ?
      'green' :
      (this.props.state === FAILED ? 'red' : '');

    return (
      <div className={`ui large input ${focus}`}>
        <input type="text"
          placeholder={this.placeholder}
          value={this.props.value}
          style={{
            width: this.width + 'px',
            padding: '12px 12px',
            borderColor: border}}
        />
      </div>
    );
  }
}

//------------------------------------------------------
// Recall number memory
class Recall extends Component {
  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.onComplete = this.onComplete.bind(this);
    this.state = {
      focus: 0,
      values: props.numbers.map(v => ''),
    };

    //console.log(props.numbers);
  }

  onSelect(n) {
    const idx = this.state.focus;
    const expected = this.props.numbers[idx];
    const actual = this.state.values[idx] + n;
    const newValues = this.state.values.map(
        (v, i) => i === idx ? actual : v
      );

    if(actual.length < expected.length) {
      // update text only
      this.setState({values: newValues});
    } else {
      //focus next
      const newFocus = this.state.focus + 1;
      //change state
      this.setState({
        focus: newFocus,
        values: newValues,
      });

      // check for completion
      if(newFocus === this.props.numbers.length) {
        // Will this execute after the previous setState???
        setTimeout(this.onComplete, 500);
      }
    }
  }

  onComplete() {
    //split passes and failures
    var passed = [], failed = [];
    this.props.numbers.forEach( (val, idx) => {
      if(val === this.state.values[idx]) {
        passed.push(val);
      } else {
        failed.push(val);
      }
    });

    this.props.onComplete(passed, failed);
  }

  render() {
    var inputCells = this.props.numbers.map( (val, idx) => {
        const inputState = idx < this.state.focus ? (
          val === this.state.values[idx] ? PASSED : FAILED
        ) : (idx === this.state.focus ? FOCUSED : DEFAULT);

        return (<InputCell
          expected={val}
          state={inputState}
          value={this.state.values[idx]}
          key={idx}/>);
    });
    return (
      <div>
        <div className="ui two column centered grid">
          <div className="column center aligned">
            {inputCells}
          </div>
        </div>
        <div className="ui grid">
          <ButtonGrid onClick={this.onSelect}/>
        </div>
      </div>
    );
  }
}

//------------------------------------------------------
// Show sequence of cards with numbers and pegs
class FlashCards extends Component {
  constructor(props){
    super(props);
    this.state = {idx: 0};
    this.onTrigger = this.onTrigger.bind(this);
  }

  componentDidMount() {
    setTimeout(() => this.onTrigger(), this.props.interval);
  }

  componentWillUnmount() {
  }

  onTrigger() {
    const newIdx = this.state.idx + 1;
    const interval = this.props.interval;
    if(newIdx < this.props.numbers.length){
      this.setState({idx: newIdx});
      setTimeout(() => this.onTrigger(), interval);
    } else {
      this.props.onComplete();
    }
  }

  render() {
    const number = this.props.numbers[this.state.idx];
    const peg = Major.system[number];
    return (
      <Card number={number} peg={peg} showPeg={this.props.showPeg}/>
    );
  }
}

//------------------------------------------------------
function BucketSize(props) {
  return (
    <div className="ui three column centered grid">
      <div className="column center aligned">
        <div className="ui secondary segment">
          <p>[[{props.picked}]]</p>
          <p>
            [{props.bucket0}] ==> [{props.bucket1}] ==> [{props.bucket2}]
          </p>
        </div>
      </div>
    </div>
  );
}

//------------------------------------------------------
// Root component
const FLASH = 0;
const RECALL = 1;
//const SET_COUNT = 4;
const BUCKET_CONFIG = {
  0: {showPeg: true, interval: 2000, setCount: 4},
  1: {showPeg: false, interval: 3000, setCount: 4},
};

class Level2 extends Component {
  constructor(props){
    super(props);
    this.state = {
      bucket0: Object.keys(Major.system),
      bucket1: [],
      bucket2: [],
      picked: [],
      remainder: [],
      mode: FLASH,
      bucketId: 0,
    };
    this.fillBuckets = this.fillBuckets.bind(this);
    this.pickNewSet = this.pickNewSet.bind(this);
    this.reloadGame = this.reloadGame.bind(this);
    this.goToRecall = this.goToRecall.bind(this);
  }

  componentDidMount() {
    this.setState(prevState => {
      return this.reloadGame(prevState);
    });
  }

  fillBuckets(pass, fail) {
    this.setState(prevState => {
      // always add failed items to bucket-0 (i.e. Leitner system)
      const failState = { bucket0: prevState.bucket0.concat(fail)};
      var newState;
      if(prevState.bucketId === 0) {
        newState = Object.assign(failState, {
          bucket1: prevState.bucket1.concat(pass),
        });
      } else if(prevState.bucketId === 1) {
        newState = Object.assign(failState, {
          bucket2: prevState.bucket2.concat(pass),
        });
      } else {
        //TODO: Add to a new bucket???
      }
      return newState;
    });
    // get new set from selected
    this.pickNewSet();
  }

  pickNewSet() {
    this.setState(prevState => {
      if(0 < prevState.remainder.length) {
        var setCount = BUCKET_CONFIG[prevState.bucketId].setCount;
        setCount = Math.min(setCount, prevState.remainder.length);
        return {
            picked: prevState.remainder.slice(0, setCount),
            remainder: prevState.remainder.slice(setCount),
            mode: FLASH,
        }
      } else {
        return this.reloadGame(prevState);
      }
    });
  }

  reloadGame(currentState) {
    var newState = {};
    //if bucket-0 is not empty
    if(0 < currentState.bucket0.length) {
      console.log('*** Load bucket-0');
      // fill picked, remainder from bucket-0
      const setCount = Math.min(BUCKET_CONFIG[0].setCount,
        currentState.bucket0.length);

      newState.remainder = Helpers.shuffleArray(
        currentState.bucket0.slice());

      newState.picked = newState.remainder.slice(0, setCount);
      newState.remainder = newState.remainder.slice(setCount);
      newState.bucket0 = [];
      newState.mode = FLASH;
      newState.bucketId = 0;
    }
    //if bucket-1 is not empty
    else if(0 < currentState.bucket1.length) {
      // fill picked, remainder from bucket-1
      console.log('*** Load bucket-1');
      const setCount = Math.min(BUCKET_CONFIG[1].setCount,
        currentState.bucket1.length);

      newState.remainder = Helpers.shuffleArray(
        currentState.bucket1.slice());

      newState.picked = newState.remainder.slice(0, setCount);
      newState.remainder = newState.remainder.slice(setCount);
      newState.bucket1 = [];
      newState.mode = FLASH;
      newState.bucketId = 1;
    }
    else {
      // fill picked, remainder from bucket-2
      console.log('*** Load bucket-2');
    }

    return newState;
  }

  goToRecall() {
    this.setState({mode: RECALL});
  }

  render() {
    const flashOrRecall = this.state.mode === FLASH ?
      (
        <FlashCards
          numbers={this.state.picked}
          interval={BUCKET_CONFIG[this.state.bucketId].interval}
          showPeg={BUCKET_CONFIG[this.state.bucketId].showPeg}
          onComplete={this.goToRecall}
        />
      ) :
      (
        <Recall
          numbers={this.state.picked}
          onComplete={this.fillBuckets}
        />
      );

    return(
      <div className="ui container">
        {flashOrRecall}

        <BucketSize
          picked={
            this.state.remainder.length +
            this.state.picked.length
          }
          bucket0={this.state.bucket0.length}
          bucket1={this.state.bucket1.length}
          bucket2={this.state.bucket2.length}
        />
      </div>
    );
  }
}

export default Level2;
