import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';

import CommentBoxForm from '../../Components/CommentBoxForm/CommentBoxForm';
import CommentTypeSelectorContainer from '../../Containers/CommentTypeSelectorContainer/CommentTypeSelectorContainer';

import {changeCommentType, uploadFiles} from '../../Actions/CommentBoxFormActions';
import {TEXT, UPLOAD, RECORDING, SUBMIT} from '../../Constants/CommentTypes';

import CommentTypeBox from '../../Components/CommentTypeBox/CommentTypeBox';
import UserInfoBox from '../../Components/UserInfoBox/UserInfoBox';
import UploadFileTypeBox from '../../Components/UploadFileTypeBox/UploadFileTypeBox';
import Recorder, {steps} from '../../../Recorder';

import {
    init,
    ready,
    recordingStart,
    recordingFinish,
    review,
    submit,
    complete,
    fail
} from '../../Actions/RecordingFlowActions';
import Wizard from '../../../Wizard';
import Debug from '../../../Debug';

class CommentBoxFormContainer extends Component {

    static propTypes = {
        messageType: PropTypes.string,

        changeCommentType: PropTypes.func,
        init: PropTypes.func,
        ready: PropTypes.func,
        recordingStart: PropTypes.func,
        recordingFinish: PropTypes.func,
        submit: PropTypes.func,
        complete: PropTypes.func,
    };

    constructor() {
        super();

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeCommentType = this.onChangeCommentType.bind(this);

        this.recordingReady = this.recordingReady.bind(this);
        this.recorderRecording = this.recorderRecording.bind(this);
        this.recorderStop = this.recorderStop.bind(this);
        this.recorderReview = this.recorderReview.bind(this);
        this.recorderSubmit = this.recorderSubmit.bind(this);
        this.recorderComplete = this.recorderComplete.bind(this);
        this.recorderError = this.recorderError.bind(this);

        this.fileDrop = this.fileDrop.bind(this);
    }

    handleSubmit(data) {
        console.log(JSON.stringify(data));
    }

    onChangeCommentType(type) {
        this.props.changeCommentType(type);
    }

    recordingReady() {
        this.props.ready();
    }

    recorderRecording() {
        this.props.recordingStart();
    }

    recorderStop() {
        this.props.recordingFinish();
    }

    recorderReview() {
        this.props.review()
    }

    recorderSubmit() {
        this.props.submit();
    }

    recorderComplete() {
        this.props.complete();
    }

    recorderError(error) {
        this.props.fail(error);
    }

    isRecordingComplete() {
        const {messageType, activeStep} = this.props;
        if (messageType === RECORDING) {
            return (activeStep === steps.COMPLETE);
        }

        return false;
    }

    shouldShowSubmitButton() {
        const {messageType} = this.props;

        if (this.isRecordingComplete()) {
            return true;
        }

        return [TEXT, UPLOAD, SUBMIT].indexOf(messageType) > -1;
    }

    shouldShowInfoBox() {
        const {messageType} = this.props;

        if (messageType === TEXT || messageType === UPLOAD) {
            return true;
        } else if (this.isRecordingComplete()) {
            return true;
        }

        return false;
    }

    fileDrop(files) {
        this.props.uploadFiles(files);
    }

    render() {
        const {values, messageType, errorMessage, activeStep} = this.props;
        const {files} = values;
        const showSubmit = this.shouldShowSubmitButton();
        const showInfoBox = this.shouldShowInfoBox();

        return (
            <div className="comment-box-form-container">
                <Debug data={values}/>

                <CommentTypeSelectorContainer onChangeCommentType={this.onChangeCommentType} messageType={messageType}/>

                <CommentBoxForm onSubmit={this.handleSubmit} showSubmit={showSubmit}>
                    <Wizard activeKey={messageType}>
                        <CommentTypeBox key={TEXT}/>

                        <UploadFileTypeBox
                            key={UPLOAD}
                            onDrop={this.fileDrop}
                            files={files}
                        />

                        <Recorder
                            key={RECORDING}
                            activeStep={activeStep}
                            errorMessage={errorMessage}

                            ready={this.recordingReady}
                            recording={this.recorderRecording}
                            stop={this.recorderStop}
                            review={this.recorderReview}
                            submit={this.recorderSubmit}
                            complete={this.recorderComplete}
                            error={this.recorderError}
                        />

                    </Wizard>

                    { showInfoBox ?
                        <UserInfoBox />
                    : null }

                </CommentBoxForm>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        values: state.proposals.getIn(['form']).toJS(),

        activeStep: state.proposals.getIn(['form', 'step']),
        messageType: state.proposals.getIn(['form', 'type']),

        errorMessage: state.proposals.getIn(['form', 'error']).toJS()
    }),
    (dispatch) => bindActionCreators({
        changeCommentType,
        uploadFiles,

        init,
        ready,
        recordingStart,
        recordingFinish,
        submit,
        review,
        complete,
        fail
    }, dispatch)
)(CommentBoxFormContainer);