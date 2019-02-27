import React from 'react';
import { Trans } from '@lingui/macro';
import LoadingDots from './LoadingDots';
import DownloadButton from './DownloadButton';

export default class DownloadButtonList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      json: []
    };
  }

  componentDidMount() {
    fetch("https://api.github.com/repos/phoneboard/phoneboard/releases/latest")
      .then(response => response.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            json: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
  render() {
    const { error, isLoaded, json } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return (
            <button className="download-button">
                <span><Trans id="loading">Loading</Trans><LoadingDots /></span>
            </button>
        );
    } else {
      const tagName = json.tag_name;

      var extractPlatform = function(asset) {
        if (asset.name.match(/exe/))
          return "Windows";
        else if (asset.name.match(/AppImage/))
          return "Linux";
        else
          return "";
      }
      return (
        <div className="flex flex-col lg:flex-row mx-auto my-4">
          {json.assets.map((asset) => 
            <DownloadButton version={tagName} platform={extractPlatform(asset)} url={asset.browser_download_url} />
          )}
          <DownloadButton version={tagName} platform="macOS" url="https://www.patreon.com/posts/phoneboard-for-3-24874332" />
        </div>
      );
    }
  }
}

