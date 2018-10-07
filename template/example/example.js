import React, { Component } from 'react';
import MabyLibCli from '../src';

export default class Example extends Component {
  render() {
    return (
      <div>
        <h2>maby-lib-cli</h2>
        <MabyLibCli sendMsg="hello lib!" />
      </div>
    );
  }
}
