import React from 'react';
import './App.css';
import 'github-markdown-css';

import { I18nProvider } from '@lingui/react';
import { Trans } from '@lingui/macro';
import ReactMarkdown from 'react-markdown';
import DownloadButtonList from './DownloadButtonList';
import LoadingDots from './LoadingDots';

import catalogEn from './locales/en/messages.js'
import catalogEs from './locales/es/messages.js'

const catalogs = { en: catalogEn, es: catalogEs };

var browserLanguage = function() {
  let lang = (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    navigator.userLanguage;

    return lang.slice(0, 2);
}
  

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      changelog: "",
      language: "en"
    };
  }

  componentDidMount() {
    this.setState({language: browserLanguage()});
    console.log(browserLanguage());
    fetch("https://raw.githubusercontent.com/Phoneboard/phoneboard/master/CHANGELOG.md")
      .then(response => response.text())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            changelog: result
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
    const { error, isLoaded, changelog, language } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div><Trans id="loading">Loading</Trans><LoadingDots /></div>;
    } else {
      return (
        <I18nProvider language={language} catalogs={catalogs}>
          <div className="container flex flex-col mx-auto">
            <header className="flex flex-col mx-auto">
              <h1>Phoneboard</h1>
              <div className="intro">
                <p><Trans>Phoneboard is a free alternative to apps like ZXW, Wuxinji etc.</Trans></p>
                <p><Trans>These paid apps cost up to a hundred bucks a year but Phoneboard is completely free.</Trans></p>
              </div>
            </header>
            <div className="changelog markdown-body flex flex-col mx-auto w-screen lg:w-3/5 h-64 overflow-y-scroll my-4">
              <ReactMarkdown source={changelog} className="p-4" />
            </div>
            
            <DownloadButtonList />
            
            <div className="mx-auto my-12 p-6 bg-blue text-white">
            <Trans>While Phoneboard is <mark className="mx-1 px-1">free</mark> it takes time and effort to work on it, consider supporting me on <a className="underline text-white mx-1" href="https://www.patreon.com/Phoneboard">Patreon</a> or donate on <a className="underline text-white mx-1" href="https://www.paypal.me/phoneboardapp">Paypal</a> or <a className="underline text-white ml-1" href="https://blockchain.info/address/32MGUvGdsZkDEXzv7d8xGj81JgAbuygzv3">Bitcoin</a>. Thank you!</Trans>
            </div>
          </div>
        </I18nProvider>
      );
    }
  }
}

