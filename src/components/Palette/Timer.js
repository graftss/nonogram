import React, { Component } from 'react';

import { getTime } from '../../utils';

const toMinutes = seconds => ({
  minutes: Math.floor(seconds / 60),
  seconds: seconds % 60,
});

export default class Timer extends Component {
  constructor() {
    super();

    this.state = {};
  }

  componentWillMount() {
    this.setState({ startTime: getTime(), elapsed: 0 });
    this.tickInterval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.tickInterval);
  }

  tick = () => {
    const { startTime } = this.state;
    const elapsed = Math.round((getTime() - startTime) / 1000);

    this.setState({ elapsed });
  }

  render() {
    const { elapsed } = this.state;
    const { seconds, minutes } = toMinutes(elapsed);

    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return <span className="timer"><b>{minutes}:{paddedSeconds}</b></span>;
  }
}
