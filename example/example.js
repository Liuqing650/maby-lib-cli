import React, { Component } from 'react';
import MabyLibCli from 'src/index';
export default class Example extends Component {
  render() {
    return (
      <div>
        <h2>maby-lib-cli</h2>
        <MabyLibCli sendMsg="hello lib 5!" />
      </div>
    );
  }
}