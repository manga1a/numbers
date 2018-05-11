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

class Challenge extends Component {
  constructor(props){
    super(props);
    this.state = {idx: 0};
    this.interval = 1500;
    this.onTrigger = this.onTrigger.bind(this);
  }

  componentDidMount() {
    setTimeout(() => this.onTrigger(), this.interval);
  }

  componentWillUnmount() {
  }

  onTrigger() {
    const newIdx = this.state.idx + 1;
    if(newIdx < this.props.challenges.length){
      this.setState({idx: newIdx});
      setTimeout(() => this.onTrigger(), this.interval);
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

const numbersWithPegs = [
      {n: 42, p: 'rain'},
      {n: 56, p: 'lego'},
      {n: 21, p: 'ant'},
      {n: 70, p: 'kiss'},
      {n: 34, p: 'mare'}];

class App extends Component {
  render(){
    return (
      <div className="App">
        <Challenge challenges={numbersWithPegs}/>
      </div>
    );
  }
}

export default App;
