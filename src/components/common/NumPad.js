
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class NumPad extends Component {
  static propTypes = {
    onButton: PropTypes.func.isRequired,
  };

  static defaultProps = {
    showHelp: false,
  }

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    this.props.onButton(e.target.id);
  }

  render() {
    let help = this.props.showHelp ? (
      <td colSpan="2">
        <div className="ui button" onClick={this.onClick} id = 'hlp'>
          Help
        </div>
      </td>
    ) : (<td></td>);

    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td><div className="ui button" onClick={this.onClick} id='7'>7</div></td>
              <td><div className="ui button" onClick={this.onClick} id='8'>8</div></td>
              <td><div className="ui button" onClick={this.onClick} id='9'>9</div></td>
            </tr>
            <tr>
              <td><div className="ui button" onClick={this.onClick} id='4'>4</div></td>
              <td><div className="ui button" onClick={this.onClick} id='5'>5</div></td>
              <td><div className="ui button" onClick={this.onClick} id='6'>6</div></td>
            </tr>
            <tr>
              <td><div className="ui button" onClick={this.onClick} id='1'>1</div></td>
              <td><div className="ui button" onClick={this.onClick} id='2'>2</div></td>
              <td><div className="ui button" onClick={this.onClick} id='3'>3</div></td>
            </tr>
            <tr>
              <td><div className="ui button" onClick={this.onClick} id='0'>0</div></td>
              {help}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default NumPad;
