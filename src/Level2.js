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
  const displayNum = props.showPeg ?
    (props.number + ' | ' + props.peg) :
    props.number;

  return (
    <div className="ui centered card">
      <div
        className="ui center aligned header"
        style={{fontSize: 40 + 'px'}}
      >
        {displayNum}
      </div>
      {/*
      <div className="content">
        <div
          className="ui center aligned header"
          style={{fontSize: 32 + 'px'}}
        >
          {props.number}
        </div>
      </div>
      */}
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
// Play a Bucket
const FLASH = 0;
const RECALL = 1;

class PlayBucket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      picked: props.numbers.slice(0, props.setCount),
      unpicked: props.numbers.slice(props.setCount),
      mode: FLASH,
    };

    this.goToRecall = this.goToRecall.bind(this);
    this.pickNewSet = this.pickNewSet.bind(this);
  }

  willUpdate() {
    console.log('PlayBucket.willUpdate');
  }

  goToRecall() {
    this.setState({mode: RECALL});
  }

  pickNewSet(pass, fail) {
    // add to pass bucket
    this.props.addToPass(pass);
    // add to fail bucket
    this.props.addToFail(fail);
    // pick remaining if any
    if(0 < this.state.unpicked.length) {
      //console.log(`picked from ${this.state.unpicked.length}`)
      const setCount = Math.min(
        this.props.setCount, this.state.unpicked.length);

      this.setState({
        picked: this.state.unpicked.slice(0, setCount),
        unpicked: this.state.unpicked.slice(setCount),
        mode: FLASH
      });

      this.props.onPicked(setCount);
    } else {
      //console.log('empty choices');
      this.setState({
        mode: FLASH
      });

      this.props.onComplete();
    }
  }

  render() {
    if(this.state.mode === FLASH) {
      return (<FlashCards
                numbers={this.state.picked}
                interval={this.props.interval}
                onComplete={this.goToRecall}
                showPeg={this.props.showPeg}
              />);
    } else {
      return (<Recall
                numbers={this.state.picked}
                onComplete={this.pickNewSet}
              />);
    }
  }
}

//------------------------------------------------------
// Root component
class Level2 extends Component {
  constructor(props){
    super(props);
    var arr = Object.keys(Major.system);
    this.state = {
      bucket0: [],
      bucket1: [],
      bucket2: [],
      selected: Helpers.shuffleArray(arr),
      remainder: arr.length,
    };

    this.addToBucket = this.addToBucket.bind(this);
    this.changeBucket = this.changeBucket.bind(this);
    this.handlePicked = this.handlePicked.bind(this);
  }

  /*
  componentDidMount() {
  }
  */

  addToBucket(idx, arr) {
    this.setState((prevState) => {
      if(idx === 0) {
        return {bucket0: prevState.bucket0.concat(arr)};
      } else if(idx === 1) {
        return {bucket1: prevState.bucket1.concat(arr)};
      } else {
        return {bucket2: prevState.bucket2.concat(arr)};
      }
    });
  }

  changeBucket() {
    console.log('*** change bucket ***' + this.state.bucket0.length);
    // start from bucket 0
    if(0 < this.state.bucket0.length) {
      // pick from bucket 0
      const pick = Helpers.shuffleArray(this.state.bucket0.slice());

      this.setState({
        bucket0: [],
        selected: pick,
        remainder: pick.length,
      });
    } else if(0 < this.state.bucket1.length) {
      // pick from bucket 1
      console.log('*** pick from bucket-1 ***');
    } else {//bucket2 can never be empty if both of the above fails
      // pick from bucket 2
      console.log('*** pick from bucket-2 ***');
    }
  }

  handlePicked(count) {
    this.setState(prevState => {
      return {
        remainder: (prevState.remainder - count),
      }});
  }

  render() {
    return(
      <div className="ui container">
        {/*Play bucket*/}
        <PlayBucket
          numbers={this.state.selected}
          setCount={2}
          interval={2000}
          showPeg={true}
          addToPass={arr => this.addToBucket(1, arr)}
          addToFail={arr => this.addToBucket(0, arr)}
          onComplete={this.changeBucket}
          onPicked={this.handlePicked}
        />

        <BucketSize
          picked={this.state.remainder}
          bucket0={this.state.bucket0.length}
          bucket1={this.state.bucket1.length}
          bucket2={this.state.bucket2.length}
        />
      </div>
    );
  }
}

export default Level2;
