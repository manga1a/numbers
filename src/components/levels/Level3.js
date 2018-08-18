import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Major from '../../utils/Major';
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
    setTimeout(() => {
      this.props.onTimer();
    }, this.props.timer);
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
    onComplete: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.switchToRecall = this.switchToRecall.bind(this);

    this.state = {
      mode: CHALLENGE,
    }
  }

  switchToRecall() {
    this.setState(() => {
      return {
        mode: RECALL,
      }
    });
  }

  render() {
    let child;
    if(this.state.mode === CHALLENGE) {
      child = (
        <Card
          number={this.props.numbers.join('')}
          timer={3000}
          onTimer={this.switchToRecall}
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
// Root component
class Level3 extends Component {

  constructor(props) {
    super(props);
    this.foo = this.foo.bind(this);
  }

  foo(nums) {
    console.log('vals: ', nums)
  }

  render() {
    return(
      <div className="ui container">
        <PlaySession
          numbers={['3', '2', '3', '9']}
          onComplete={this.foo}
        />
      </div>
    );
  }
}

export default Level3;
