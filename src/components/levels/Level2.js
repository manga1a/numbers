import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Major from '../../utils/Major';
import Helpers from '../../utils/Helpers';
import NumPad from '../common/NumPad';

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

  onSelect(id) {
    const n = parseInt(id, 10);
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
          <div className="row">
            <div className="six wide column"/>
            <div className="four wide column">
              <NumPad onButton={this.onSelect} />
            </div>
            <div className="six wide column"/>
          </div>
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
    * (bucket-2: 2, bucket-3: 3, bucket-4: 5[, bucket-5: 7])
    * practice items from that bucket
    * add pass to next bucket, fail to bucket-0
* Save state at end of a session

* Always try to keep 5? items in bucket-0
* Maintain this at the start of a session?
*/

const MaxRecallSeq = 4;
const MinRecallSeq = 3;
//------------------------------------------------------
// GameSession component
class GameSession extends Component {

  static propTypes = {
    buckets: PropTypes.array.isRequired,
    sessionId: PropTypes.number.isRequired,
    onComplete: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.onBucketComplete = this.onBucketComplete.bind(this);
    this.getInitState = this.getInitState.bind(this);
    this.setModeRecall = this.setModeRecall.bind(this);
    this.getNextBucketId = this.getNextBucketId.bind(this);

    this.state = this.getInitState(props.buckets);
  }

  getInitState(buckets) {
    // deep copy buckets
    const clonedBuckets = buckets.map(bucket => {
      return [].concat(bucket);
    });

    //Limit the size of playing bucket
    let pBucket = clonedBuckets[0].slice(0, MaxRecallSeq);
    clonedBuckets[0] = clonedBuckets[0].slice(MaxRecallSeq);

    return {
      bucketId: 0,
      sessionBuckets: clonedBuckets,
      playingBucket: pBucket,
      practiceMode: PracticeMode.Memorize,
    };
  }

  setModeRecall() {
    this.setState({practiceMode: PracticeMode.Recall});
  }

  onBucketComplete(pass, fail) {
    this.setState((prevState, props) => {
      const currBucketId = prevState.bucketId;
      const nextBucketId = currBucketId + 1;
      let newBuckets = prevState.sessionBuckets.map((numbers, idx) => {
        if(idx === nextBucketId) {
          return Helpers.shuffleArray(numbers.concat(pass));
        } else {
          return [].concat(numbers); //deep copy
        }
      });

      //learn all fail numbers from bucket 0
      newBuckets[0] = newBuckets[0].concat(fail);

      let newBucketId;
      //if(currBucketId !== 0 && MinRecallSeq <= newBuckets[currBucketId].length) {
      if(MinRecallSeq <= newBuckets[currBucketId].length) { // play all in bucket-0 before moving to next
        //console.log(`new bucket ${currBucketId}: ${newBuckets[currBucketId].length}`);
        newBucketId = currBucketId;
      } else {
        newBucketId = (nextBucketId < 2) ? nextBucketId :
          this.getNextBucketId(nextBucketId,
            props.sessionId,
            props.buckets.length - 1 // last bucket is retired
          );
      }

      if(newBucketId < 0) { // end of session
        props.onComplete(newBuckets)
        return {};
      }

      //Refill playing bucket
      let pBucket = newBuckets[newBucketId].slice(0, MaxRecallSeq);
      newBuckets[newBucketId] = newBuckets[newBucketId].slice(MaxRecallSeq);

      console.log('new bucket: ', newBucketId);

      return {
        bucketId: newBucketId,
        sessionBuckets: newBuckets,
        playingBucket: pBucket,
        practiceMode: PracticeMode.Memorize
      };
    });
  }

  getNextBucketId(currentId, sessionId, bucketCount) {
    const primes = [2, 3, 5, 7, 11]; // Supports upto 7 buckets, except retired
    let current = currentId;
    while(current < bucketCount) {
      if(sessionId % primes[current - 2] === 0) {
        return current;
      }
      current++;
    }

    return -1;
  }

  componentDidUpdate(prevProps) {
    //console.log(`prev session: ${prevProps.sessionId}, new session: ${this.props.sessionId}`);
    if(prevProps.sessionId < this.props.sessionId) {
      this.setState(this.getInitState(this.props.buckets));
    }
  }

  render() {
    return (
      <div>
        <Practice
          numbers={this.state.playingBucket}
          mode={this.state.practiceMode}
          showPeg={0 === this.state.bucketId}
          interval={2000}
          onModeChange={this.setModeRecall}
          onComplete={this.onBucketComplete}
        />
        <h4 className="ui center aligned header">
          Session {this.props.sessionId} | Bucket {this.state.bucketId}
        </h4>
      </div>
    );
  }
}

//------------------------------------------------------
// Root component
const StateKey = 'Level2';
const MinBucket0Length = MaxRecallSeq;

class Level2 extends Component {

  constructor(props) {
    super(props);
    this.onSessionComplete = this.onSessionComplete.bind(this);
    this.getNewSession = this.getNewSession.bind(this);
    //load persistant state
    let state = Helpers.loadState(StateKey);
    if(state) {
      this.state = state;
    } else {
      this.state = this.getNewSession({
        buckets: [
          [], //0th bucket
          [], //1st bucket
          [], //2nd bucket
          [], //3rd bucket
          [], //4th bucket
          [], //5th bucket
          [], //6th bucket
          [], //retired bucket
        ],
        sessionId: 0, // one before very first session
        nextSystemIdx: 0, // start major system index
      });
    }
  }

  getNewSession(prevState) {
    let bucket0 = [].concat(prevState.buckets[0]); // deep copy
    const len = bucket0.length;
    let idx = prevState.nextSystemIdx;
    // make sure bucket0 has minimum length
    if(len < MinBucket0Length) {
      const end = idx + (MinBucket0Length - len);
      var newNumbers = Major.Numbers.slice(idx, end);
      bucket0 = bucket0.concat(newNumbers);
      idx = end; //TODO: handle end of numbers
    }
    // update buckets with new bucket0
    const newBuckets = prevState.buckets.map((bucket, i) => {
      if(0 === i) {
        return Helpers.shuffleArray(bucket0);
      } else {
        return Helpers.shuffleArray([].concat(bucket)); // deep copy
      }
    });

    return {
      buckets: newBuckets,
      nextSystemIdx: idx,
      sessionId: prevState.sessionId + 1,
    };
  }

  onSessionComplete(newBuckets) {
    console.log(`End of session ${this.state.sessionId}`);
    Helpers.saveState(StateKey, this.state);
    debugger; //pause
    //start a new session
    this.setState(prevState => {
     return this.getNewSession({
       buckets: newBuckets,
       nextSystemIdx: prevState.nextSystemIdx,
       sessionId: prevState.sessionId,
     });
    });
  }

  render() {
    return(
      <div className="ui container">
        <GameSession
          buckets={this.state.buckets}
          sessionId={this.state.sessionId}
          onComplete={this.onSessionComplete}
        />
      </div>
    );
  }
}

export default Level2;
