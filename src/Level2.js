import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Major from './Major'
//import Helpers from './Helpers'

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
// Show sequence of cards with numbers [and pegs]
class Memorize extends Component {
  static propTypes = {
    interval: PropTypes.number.isRequired,
    numbers: PropTypes.array.isRequired,
    onComplete: PropTypes.func.isRequired,
    showPeg: PropTypes.bool,
  };

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
    const peg = Major.System[number];
    return (
      <Card number={number} peg={peg} showPeg={this.props.showPeg}/>
    );
  }
}

//------------------------------------------------------
// Recall number memory
class Recall extends Component {
  static propTypes = {
    numbers: PropTypes.array.isRequired,
    onComplete: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.onComplete = this.onComplete.bind(this);
    this.state = {
      focus: 0,
      values: props.numbers.map(v => ''),
    };
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
// Practice memorization and recollection
const PracticeMode = { Memorize: 0, Recall: 1};

class Practice extends Component {
  static propTypes = {
    numbers: PropTypes.array.isRequired,
    mode: PropTypes.number.isRequired,
    showPeg: PropTypes.bool.isRequired,
    interval: PropTypes.number.isRequired,
    onModeChange: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired,
  }

  /*
  constructor(props){
    super(props);
    //this.state = {mode: PracticeMode.Memorize}
    //this.goToRecall = this.goToRecall.bind(this);
  }
  */

  /*
  goToRecall() {
    this.setState({mode: PracticeMode.Recall});
  }
  */

  render () {
    if(this.props.mode === PracticeMode.Memorize) {
      return (
        <Memorize
          numbers={this.props.numbers}
          interval={this.props.interval}
          showPeg={this.props.showPeg}
          onComplete={this.props.onModeChange}
        />
      );
    } else {
      return (
        <Recall
          numbers={this.props.numbers}
          onComplete={this.props.onComplete}
        />
      );
    }
  }
}

//------------------------------------------------------
/*
* Keep buckets 0 - 5, and r (i.e. retired)
* Keep track of session number starting from 1
* A session consists of...
  * Keep a seperate set of temporary buckets for each session???
  * Pick items from bucket-0 and study (i.e. show peg)
    * add pass to bucket-1, fail to bucket-0
  * Pick items from bucket-1 and practice
    * add pass to bucket-2, fail to bucket-0
  * For each remaining buckets...
  * If the session id is a factor of their associated prime
    * (bucket-2: 2, bucket-3: 3, bucket-4: 5, bucket-5: 7)
    * practice items from that bucket
    * add pass to next bucket, fail to bucket-0
* Save state at end of a session

* Always try to keep 5? items in bucket-0
* Maintain this at the start of a session?
*/
//------------------------------------------------------
// GameSession component
class GameSession extends Component {

  static propTypes = {
    buckets: PropTypes.array.isRequired,
    sessionId: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);
    this.onBucketComplete = this.onBucketComplete.bind(this);
    this.setModeRecall = this.setModeRecall.bind(this);
    // deep copy buckets
    const clonedBuckets = props.buckets.map(bucket => {
      return [].concat(bucket);
    });
    // set initial state
    this.state = {
      bucketId: 0,
      sessionBuckets: clonedBuckets,
      practiceMode: PracticeMode.Memorize
    }
  }

  setModeRecall() {
    this.setState({practiceMode: PracticeMode.Recall});
  }

  onBucketComplete(pass, fail) {
    this.setState((prevState, props) => {
      const currBucket = prevState.bucketId;
      const nextBucket = currBucket + 1;
      let nextSessionBuckets = prevState.sessionBuckets.map((numbers, idx) => {
        // current bucket should be empty
        if(idx === currBucket) {
          return [];
        } else if(idx === nextBucket) {
          return numbers.concat(pass);
        } else {
          return numbers;
        }
      });

      //learn all fail numbers from bucket 0
      nextSessionBuckets[0] = nextSessionBuckets[0].concat(fail);

      //TODO: check end of session

      return {
        bucketId: nextBucket,
        sessionBuckets: nextSessionBuckets,
        practiceMode: PracticeMode.Memorize
      };
    });
  }

  render() {
    return (
      <Practice
        numbers={this.state.sessionBuckets[this.state.bucketId]}
        mode={this.state.practiceMode}
        showPeg={0 === this.state.bucketId}
        interval={2000}
        onModeChange={this.setModeRecall}
        onComplete={this.onBucketComplete}
      />
    );
  }
}

//------------------------------------------------------
// Root component
class Level2 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buckets: [
        ['04', '03', '02', '01', '00'], //0
        [], //1
        [], //2
      ],

      sessionId: 1
    };
  }

  render() {
    return(
      <div className="ui container">
        <GameSession
          buckets={this.state.buckets}
          sessionId={this.state.sessionId}
        />
      </div>
    );
  }
}

export default Level2;
