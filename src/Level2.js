import React, { Component } from 'react';
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
// Recall number memory
class Recall extends Component {
  constructor(props){
    super(props);
    this.state = {val: ''};
  }

  render() {
    const numbers = Major.getNumberSequence(this.props.flashSequence);
    console.log(numbers);

    return (
      <div className="ui grid">
        <ButtonGrid />
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
    if(newIdx < this.props.flashSequence.length){
      this.setState({idx: newIdx});
      setTimeout(() => this.onTrigger(), interval);
    } else {
      this.props.onComplete();
    }
  }

  render() {
    const majorIdx = this.props.flashSequence[this.state.idx];
    const item = Major.system[majorIdx];
    return (
      <Card number={item.number} peg={item.peg} />
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
    this.state = {
      //flashSequence: [0, 1, 2, 3],
      //flashSequence: [10, 11, 12, 13],
      flashSequence: [22, 2, 11, 24],
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
                flashSequence={this.state.flashSequence}
                interval={1500}
                onComplete={this.goToRecall}
              />
    } else {
      mode = <Recall
                flashSequence={this.state.flashSequence}
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
