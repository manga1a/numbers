import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

function Number(props) {
  return(
    <div>
      <h1>{props.number}</h1>
      <h2>{props.peg}</h2>
    </div>
  );
}

class ChallengeSet extends Component {
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
    if(newIdx < this.props.challenges.length){
      this.setState({idx: newIdx});
      setTimeout(() => this.onTrigger(), interval);
    } else {
      this.props.onComplete();
    }
  }

  render() {
    const entry = this.props.challenges[this.state.idx];
    return (
      <Number
        number={entry.n}
        peg={entry.p} />
    );
  }
}

//------------------------------------------
class ChallengeGet extends Component {
  constructor(props){
    super(props);
    this.state = {idx: 0, value: ''};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e){
    const num = parseInt(e.target.value, 10);
    const answer = this.props.challenges[this.state.idx].n;
    const newIdx = this.state.idx + 1;
    const count = this.props.challenges.length;

    if(num === answer) {
      if(newIdx < count) {
        this.setState({idx: newIdx, value: ''});
      } else {
        this.props.onComplete();
      }
    } else {
      this.setState({value: e.target.value});
    }
  }

  render(){
    return(
      <div>
        <h3>{this.state.idx}/{this.props.challenges.length}</h3>
        <input type='text' value={this.state.value} onChange={this.handleChange}/>
      </div>
    );
  }
}
//------------------------------------------

const numbersWithPegs = [
      {n: 42, p: 'rain'},
      {n: 56, p: 'lego'},
      {n: 21, p: 'ant'},
      {n: 70, p: 'kiss'},
      {n: 34, p: 'mare'}];

class App extends Component {

  constructor(props){
    super(props);
    this.state = {isShow: true};
    this.switchMode = this.switchMode.bind(this);
  }

  switchMode(){
    this.setState({isShow: !this.state.isShow});
  }

  render(){
    const Challenge = this.state.isShow ? (
      <ChallengeSet challenges={numbersWithPegs}
        interval={1500} onComplete={this.switchMode}/>
    ) : (
      <ChallengeGet challenges={numbersWithPegs}
        onComplete={this.switchMode}/>
    );

    return (
      <div className="App">
        {Challenge}
      </div>
    );
  }
}

export default App;
