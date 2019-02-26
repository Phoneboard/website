import React from 'react';
import { Trans } from '@lingui/macro';

export default class DownloadButton extends React.Component {
  handleClick() {
    window.location.href = this.props.url;
  }

  render() {
    const { version, platform } = this.props;
    if (platform === "")
      return null;

    return (
      <button className="download-button" onClick={this.handleClick.bind(this)}>
          <span className="font-lato text-lg"><Trans>Download {version} for {platform}</Trans></span>
      </button>
    );
  }
}

