import React from 'react';
import NewCom from './components/new';
import './style';

class MabyLibCli extends React.Component {
  state = {
    value: 'maby-lib-cli'
  };
  render() {
    const { value } = this.state;
    const { sendMsg } = this.props;
    return (
      <div>
        <div>{value}</div>
        <i>{sendMsg}</i>
        <NewCom />
      </div>
    );
  }
}
export default MabyLibCli;
