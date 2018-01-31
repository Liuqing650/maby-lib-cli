import React from 'react';
import './index.less';

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
      </div>
    );
  };

};
export default MabyLibCli;
