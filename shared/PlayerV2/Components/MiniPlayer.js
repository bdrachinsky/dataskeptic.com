import React from 'react';
import PlayerProgressBar from '../Components/PlayerProgressBar'
import TogglePlayButton from '../Components/TogglePlayButton'

export const MiniPlayer = ({episode ={},myButton,realPos = 0, isPodcast, playing = false, preview, title = '[No episode loaded yet]', date = '', duration = '--:--', position = '--:--', onPlayToggle, howler, onSeek, loaded, volumeSlider}) => {
    if (isPodcast) {
        return (
            <div className="thin-player-container">
                {!loaded && (
                    <div className="loading">
                        <div className="playback-loading preloader"/>
                    </div>
                )}

                <div className="">
                    <div className="col-xs-9 col-sm-4 col-md-3 preview">
                        <img src={episode.img} alt={episode.title}/>
                        <div className="description">
                            <p className="date">{episode.pubDate}</p>
                            <p className="title">{episode.title}</p>
                        </div>
                    </div>
                    <div className="col-xs-4 col-sm-5 col-md-6 slider">
                        <PlayerProgressBar
                            playing={playing}
                            progress={position}
                            onChange={onSeek}
                        />
                        <div className="player-position-container"><span className="player-position">{realPos}</span>
                        </div>
                        <div className="player-duration-container"><span className="player-duration">{duration}</span>
                        </div>
                        {howler}
                    </div>
                    <div className="hidden-xs col-sm-2 col-md-2 volume">
                        {volumeSlider}
                    </div>
                    <div className="col-xs-3 col-sm-1 col-md-1 pull-right button">
                        <TogglePlayButton playing={playing} onClick={onPlayToggle}/>
                    </div>
                </div>
            </div>
        )
    } else {
        return (  <div className="thin-player-container">
                {!loaded && (
                    <div className="loading">
                        <div className="playback-loading preloader"/>
                    </div>
                )}

                <div className="row">
                    <div className="col-xs-3 col-sm-1 col-md-1 button">
                        <TogglePlayButton playing={playing} onClick={onPlayToggle}/>
                        {myButton()}
                    </div>
                    <div className="col-xs-4 col-sm-5 col-md-6 slider">
                        <PlayerProgressBar
                            playing={playing}
                            progress={position}
                            onChange={onSeek}
                        />
                        <div className="player-position-container"><span className="player-position">{realPos}</span>
                        </div>
                        <div className="player-duration-container"><span className="player-duration">{duration}</span>
                        </div>
                        {howler}
                    </div>
                    <div className="hidden-xs col-sm-2 col-md-2 volume">
                        {volumeSlider}
                    </div>

                </div>
            </div>
        )
    }
}


export default MiniPlayer