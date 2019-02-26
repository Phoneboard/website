import React from 'react';
import './LoadingDots.css';

export default class LoadingDots extends React.Component {
    render() {
        return (
            <span className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
            </span>
        );
    }
}