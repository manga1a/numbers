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
  return (
    <div className="ui centered card">
      <div
        className="ui center aligned header"
        style={{fontSize: 48 + 'px'}}
      >
        {props.number}
      </div>
      <div className="content">
        <div
          className="ui center aligned header"
          style={{fontSize: 32 + 'px'}}
        >
          {props.peg}
        </div>
      </div>
    </div>
  );
}

//------------------------------------------------------
class InputCell extends Component {
  constructor(props) {
    super(props);
    this.width = props.expected.length > 1 ? 50 : 40;
    this.placeholder = props.expected.length > 1 ? '??' : '?';
  }

  render () {
    const focus = this.props.isFocus ? 'focus' : '';
    return (
      <div className={`ui large input ${focus}`}>
        <input type="text"
          placeholder={this.placeholder}
          value={this.props.value}
          style={{
            width: this.width + 'px',
            padding: '12px 12px'}}
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
    this.state = {
      focus: 0,
      values: props.numbers.map(v => ''),
    };

    console.log(props.numbers);
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
      //validate
      /*
      const newPassed = this.state.passed.map( (v, i) => {
          return (i === this.state.focus ? (actual === expected) : v);
      });*/
      //console.log(newPassed);
      //focus next
      const newFocus = this.state.focus + 1;
      //TODO: check for completion
      this.setState({
        focus: newFocus,
        values: newValues,
      });
    }
    //console.log(newVal, this.props.numbers[this.state.focus]);
  }

  render() {
    var inputCells = this.props.numbers.map( (val, idx) => {
        return (<InputCell
          expected={val}
          isFocus={idx === this.state.focus}
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
      <Card number={number} peg={peg} />
    );
  }
}

//------------------------------------------------------
// Root component
const FLASH = 0;
const RECALL = 1;

class Level2 extends Component {
  constructor(props){
    super(props);
    const numbers = Helpers.shuffleArray(Object.keys(Major.system));
    const setSize = Math.min(3, numbers.length);
    this.state = {
      currentSet: numbers.slice(0, setSize),
      bucket0: numbers.slice(setSize),
      bucket1: [],
      mode: RECALL,
    };
    this.goToRecall = this.goToRecall.bind(this);
  }

  goToRecall() {
    this.setState({mode: RECALL});
  }

  render() {
    var mode;
    if(this.state.mode === FLASH) {
      mode = <FlashCards
                numbers={this.state.currentSet}
                interval={1500}
                onComplete={this.goToRecall}
              />
    } else {
      mode = <Recall
                numbers={this.state.currentSet}
              />
    }

    return(
      <div className="ui container">
        {mode}
      </div>
    );
  }
}

export default Level2;
