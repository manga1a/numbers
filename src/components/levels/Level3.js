import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helpers from '../../utils/Helpers';
import NumberInput from '../common/NumberInput';

/*
* Do not bind to the Major system. E.g. Basket = 9071
*
* Display a sequence of n digit numbers (3 <= n)
*   Display a number in the sequence for t seconds (5? <= t)
*   Recall the number
*     Recall ends when the digit count of actual number and expected are same
*     There is no timer for recall
*   Repeat till end of sequence
* When all the sequence is recalled correctly...
*   increment n by 1
* Else...
*   increment t by 1
*
* When a number is incorrectly typed in recall, display it's consonant
* Soon as the last digit is typed in a correct recall, move to next item in sequence
*   even when there is remaining time
*/

//------------------------------------------------------
// A flash card
class Card extends Component {
  static propTypes = {
    number: PropTypes.string.isRequired,
    timer: PropTypes.number.isRequired,
    onTimer: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.timerId = setTimeout(() => {
      this.props.onTimer();
    }, this.props.timer);
  }

  componentWillUnmount() {
    clearTimeout(this.timerId);
  }

  render() {
    return (
      <div className="ui centered card">
        <div
          className="ui center aligned header"
          style={{fontSize: 40 + 'px'}}
        >
          {this.props.number}
        </div>
      </div>
    );
  }
}

//------------------------------------------------------
const CHALLENGE = 0;
const RECALL = 1;

class PlaySession extends Component {
  static propTypes = {
    numbers: PropTypes.array.isRequired,
    onTimerEnd: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
  };

  render() {
    let child;
    if(this.props.mode === CHALLENGE) {
      child = (
        <Card
          number={this.props.numbers.join('')}
          timer={3000}
          onTimer={this.props.onTimerEnd}
        />);
    } else {
      child = (
        <NumberInput
          numbers={this.props.numbers}
          onComplete={this.props.onComplete}
        />
      );
    }

    return (
      <div>
        {child}
      </div>
    );
  }
}

//------------------------------------------------------
class GameSession extends Component {
  static propTypes = {
    count: PropTypes.number.isRequired,
    onComplete: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.onPlayEnd = this.onPlayEnd.bind(this);
    this.getNumArray = this.getNumArray.bind(this);
    this.goToRecall = this.goToRecall.bind(this);

    this.state = {
      numbers: this.getNumArray(),
      wins: 0,
      mode: CHALLENGE,
    };
  }

  getNumArray() {
    let n = [];
    for(let i = 0; i < this.props.count; ++i) {
       n.push(Helpers.getRandomInt(10).toString());
    }
    return n;
  }

  goToRecall() {
    this.setState(() => {
      return {
        mode: RECALL
      };
    });
  }

  onPlayEnd(numEntered) {
    let func;
    if(Helpers.areArraysEqual(this.state.numbers, numEntered)) {
      func = (prevState) => {
        return {
          numbers: this.getNumArray(),
          wins: prevState.wins + 1,
          mode: CHALLENGE,
        };
      };
    } else {
      func = () => {
        return {
          numbers: this.getNumArray(),
          mode: CHALLENGE,
        };
      };
    }

    this.setState(func);
  }

  render () {
    return (
      <div className="ui container">
        <PlaySession
          numbers={this.state.numbers}
          onTimerEnd={this.goToRecall}
          onComplete={this.onPlayEnd}
          mode={this.state.mode}
        />
      </div>
    );
  }

}

//------------------------------------------------------
// Root component
class Level3 extends Component {

  constructor(props) {
    super(props);
    this.foo = this.foo.bind(this);
  }

  foo() {
    console.log('*** End of Session ***');
  }

  render() {
    return(
      <GameSession
        count={3}
        onComplete={this.foo}
      />
    );
  }
}

export default Level3;
