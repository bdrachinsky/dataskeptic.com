import React, {Component} from 'react'
import PlayerContainer from './PlayerContainer'
import PlayButton from '../Components/PlayButton'
import VolumeContainer from '../Containers/VolumeContainer'
import VolumeBarContainer from '../Containers/VolumeBarContainer'
const oepisode = {
    guid:"4b99863b70904bf6ecbe2c9de4a0a024",
    img:"https://static.libsyn.com/p/assets/2/9/3/8/2938570bb173ccbc/DataSkeptic-Podcast-1A.jpg",
    mp3:"http://traffic.libsyn.com/dataskeptic/long-short-term-memory.mp3?dest-id=201630",
    pubDate:"2017-09-08T15:00:00.000Z",
    title:"[MINI] Long Short Term Memory",
}

const renderMyButton = () =>(
    <button>My button</button>
)

export default class PlayersTests extends Component{
    render(){
        return(
            <div>

                {/*<PlayerContainer oepisode={oepisode} />*/}
                <PlayerContainer
                />
                <VolumeContainer
                    quantity = {10}
                />
                {/*<PlayerContainer*/}
                    {/*mp3={oepisode.mp3}*/}
                {/*/>*/}

            </div>
        )
    }
}