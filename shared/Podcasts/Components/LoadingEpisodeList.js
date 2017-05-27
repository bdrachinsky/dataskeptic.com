import React, { Component } from 'react'
import { connect } from 'react-redux';

import LoadingEpisodeListItem from "./LoadingEpisodeListItem"

class LoadingEpisodeList extends Component {

    constructor() {
        super();
    }

    fillMockedArray(l) {
        let a = [];

        for (let i=0;i<l;i++) {
            a.push({
                id: i,
                link: '#',
                title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                date: '3 DAYS AGO',
                desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat'
            })
        }

        return a;
    }

    render() {
    	const {length} = this.props;
    	const episodes = this.fillMockedArray(length)

        return (
            <div className="row">
                {episodes.map((episode, index) => {
                    return <LoadingEpisodeListItem key={index} {...episode}/>
                })}
            </div>
        )
    }
}

export default LoadingEpisodeList