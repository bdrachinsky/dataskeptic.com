import React, {Component} from "react"
import ReactHowler from 'react-howler'
import moment from 'moment'
import axios from 'axios'
import {v4} from 'uuid'
import {connect} from 'react-redux'
import {isEmpty} from 'lodash'


import MiniPlayer from '../Components/MiniPlayer'
import VolumeBarContainer from '../Containers/VolumeBarContainer'

const URL = '/api/v1/player';

const ZERO_POS_STR = '0:00';

const CAPTURE_TYPES = {
    END: 'END',
    PLAY: 'PLAY',
    PAUSE: 'PAUSE',
    SEEK: 'SEEK',
    POS: 'POS'
}


class PlayerContainer extends Component {

    constructor() {
        super()

        this.state = {
            ready: false
        }
    }

    renderLeftCorner = () => {
        const CustomComponent = this.props.leftCorner
        const props = {}

        return <CustomComponent {...props} />
    }

    renderLeftPlayButton = () => {
        const CustomComponent = this.props.leftPlayButton
        const props = {}

        return <CustomComponent {...props} />
    }

    renderHowler = () => {
        const CustomComponent = this.props.howler
        const props = {}

        return <CustomComponent {...props} />
    }

    renderCenterComponent = () => {
        const CustomComponent = this.props.centerComponent
        const props = {}

        return <CustomComponent {...props} />
    }

    renderVolumeBar = () => {
        const CustomComponent = this.props.volumeBar
        const props = {}

        return <CustomComponent {...props} />
    }

    renderRightPlayButton = () => {
        const CustomComponent = this.props.rightPlayButton
        const props = {}

        return <CustomComponent {...props} />
    }

    renderRightCorner = () => {
        const CustomComponent = this.props.rightCorner
        const props = {}

        return <CustomComponent {...props} />
    }

    render() {
        const {ready} = this.state
        const {src} = this.props

        const {
            leftCorner,
            leftPlayButton,
            howler,
            centerComponent,
            volumeBar,
            rightPlayButton,
            rightCorner
        } = this.props;

        return (
            <div>
                {leftCorner && this.renderLeftCorner()}
                {leftPlayButton && this.renderLeftPlayButton()}
                {howler && this.renderHowler()}
                {centerComponent && this.renderCenterComponent()}
                {volumeBar && this.renderVolumeBar()}
                {rightPlayButton && this.renderRightPlayButton()}
                {rightCorner && this.renderRightCorner()}
            </div>
        )
    }
}

export default connect(
    state => ({

    })
)(PlayerContainer)
