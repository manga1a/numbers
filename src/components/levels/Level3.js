import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Major from '../../utils/Major';
import Helpers from '../../utils/Helpers';
import NumPad from '../common/NumPad';

/*
* Go beyond major system. E.g. Basket = 9071
* When a number is incorrectly typed in recall, display it's consonant
*/

//------------------------------------------------------
// A flash card
function Card(props) {
  return (
    <div className="ui centered card">
      <div
        className="ui center aligned header"
        style={{fontSize: 40 + 'px'}}
      >
        {props.number}
      </div>
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
    this.width = 40;
    this.placeholder = '?';
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
  static propTypes = {
    numbers: PropTypes.array.isRequired,
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

  onSelect(actual) {
    const idx = this.state.focus;
    const expected = this.props.numbers[idx];
    const newValues = this.state.values.map(
        (v, i) => i === idx ? actual : v
      );

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

  onComplete() {
    console.log('*** end ***');
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
// Root component
class Level3 extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="ui container">
        {/*<Card number='12342' />*/}
        <Recall numbers={['3', '2', '3', '9']} />
      </div>
    );
  }
}

export default Level3;
