import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NumPad from '../common/NumPad';
import Consonant from '../../utils/Consonant';

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


class NumberInput extends Component {
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
  }

  componentDidUpdate() {
    // check for completion
    if(this.state.focus === this.props.numbers.length) {
      setTimeout(this.onComplete, 1000);
    }
  }

  onComplete() {
    this.props.onComplete(this.state.values);
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

    const idx = this.state.focus - 1;
    let consonant;
    if(0 <= idx && idx < this.props.numbers.length) {
      if(this.props.numbers[idx] === this.state.values[idx]) {
        consonant = '.';
      } else {
        consonant = Consonant.ForNumber[this.props.numbers[idx]];
      }
    } else {
      consonant = '.';
    }

    return (
      <div>
        <div className="ui two column centered grid">
          <div className="column center aligned">
            <p>{consonant}</p>
            <div/>
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

export default NumberInput;
