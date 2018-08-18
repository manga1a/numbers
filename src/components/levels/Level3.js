import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Major from '../../utils/Major';
import Helpers from '../../utils/Helpers';
import NumberInput from '../common/NumberInput';

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
        {/*<Card number='12342' />*/}
        <NumberInput
          numbers={['3', '2', '3', '9']}
          onComplete={this.foo}
        />
      </div>
    );
  }
}

export default Level3;
