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
    console.log('clicked: ' + e.target.id)
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
function NumberCell(focus) {
  return (
    <div className="ui input focus">
      <input type="text"
        style={{width: 40 + 'px'}}
        placeholder='7'
      />
    </div>
  );
}

class NumberInput extends Component {
      /*<div className="ui center aligned">
          <div className="ui input focus">
            <input type="text"
              style={{width: 40 + 'px'}}
              placeholder='7'
            />
          <div className="ui input">
            <input type="text"
              style={{width: 50 + 'px'}}
              placeholder='88'
            />
      </div>*/
  render() {
    return (
      <div className="ui two column centered grid">
        <div className="column center aligned">
          <NumberCell />
        </div>
      </div>
    );
  }
}

//------------------------------------------------------
// Recall number memory
class Recall extends Component {
  constructor(props) {
    super(props);
    this.state = {val: ''};
  }

  render() {
    console.log(this.props.numbers);

    return (
      <div>
        <NumberInput />
        <div className="ui grid">
          <ButtonGrid />
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
    const setSize = Math.min(5, numbers.length);
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
