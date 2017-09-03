import React, {Component} from "react";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';
import classNames from 'classnames'
import marked from 'marked'
import {fetchCurrentProposal, proposalDeadlineReached, authorize} from '../Actions/ProposalsActions';

import Container from '../../Layout/Components/Container/Container';
import Content from '../../Layout/Components/Content/Content';
import CommentBoxFormContainer from '../Containers/CommentBoxContainer/CommentBoxFormContainer';
import Countdown from '../../Common/Components/Countdown';
import {changePageTitle} from '../../Layout/Actions/LayoutActions';


class Proposals extends Component {

    constructor(props) {
        super(props);
        this.deadline = this.deadline.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.getAuthorizedUser = this.getAuthorizedUser.bind(this);

        this.state = {
            authorizedUser: null,
            ready: false
        }
    }

    componentWillMount() {
        const {title} = Proposals.getPageMeta();
        this.props.changePageTitle(title);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user && this.state.authorizedUser) {
            this.setState({ready: true})
        }
    }

    componentDidMount() {
        this.getAuthorizedUser();
    }

    static getPageMeta() {
        return {
            title: 'Proposals | Data Skeptic'
        }
    }

    login() {
        window.location.href = '/api/v1/auth/login/google/'
    }
    logout(){
        window.location.href =  '/api/v1/auth/logout/'
    }

    getAuthorizedUser() {
        const {user} = this.props;
        if (user && user.hasAccess) {
            try {
                this.setState({ authorizedUser: user })
            } catch (e) {}
        }
    }

    getMarkdown(text) {
        const rawMarkup = marked(text, {sanitize: true});
        return {__html: rawMarkup};
    }

    deadline() {
        this.props.proposalDeadlineReached();
    }

    render() {
        const {ready, authorizedUser} = this.state;

        if (ready) {
            const {proposal = {}, aws_proposals_bucket} = this.props;
            const {topic, long_description, deadline, active} = proposal;
            const to = moment(deadline);
            const isClosed = !active;

            const user = {
                email: authorizedUser.email,
                name: authorizedUser.displayName
            }

            return (
                <div className={classNames('proposals-page', {'closed': isClosed, 'open': !isClosed})}>

                    <Container>
                        <Content>
                            <div className="log-out-wrapper">
                                <button className="btn" onClick={this.logout}><i className="glyphicon glyphicon-arrow-left"></i>Log out</button>
                            </div>
                            {!isClosed && (
                                <div>
                                    <h2>Request for Comment</h2>
                                    <p>Thanks for considering contributing your thoughts for an upcoming episode. Please
                                        review the
                                        topic below and share any thoughts you have on it. We aren't always able to use
                                        every
                                        comment submitted, but we will do our best and appreciate your input.</p>
                                    <h3><b>Current topic:</b> {topic}</h3>
                                    <p dangerouslySetInnerHTML={this.getMarkdown(`${long_description}`)}>

                                    </p>

                                    {deadline ?
                                        <p className="deadline"><b>Time to comment:</b><Countdown to={to.toString()}
                                                                                                  onDeadlineReached={this.deadline}/>
                                        </p>
                                        : null}
                                </div>
                            )}


                            {isClosed
                                ?
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h3 className="panel-title">This RFC has closed.</h3>
                                    </div>
                                    <div className="panel-body">
                                        We don't have any active topics. Please check back soon when we launch the next!
                                    </div>
                                </div>
                                :
                                <CommentBoxFormContainer user={user} aws_proposals_bucket={aws_proposals_bucket}/>
                            }

                        </Content>
                    </Container>
                </div>
            )
        }
        else {
            return (
                <div className='proposals-page'>
                    <Container>
                        <div className="login-container">
                            <h2>Welcome to the Data Skeptic</h2>
                            <h3>Request For Comment</h3>
                            <button onClick={this.login} className="btn btn-primary">Login</button>
                        </div>
                    </Container>
                </div>
            );
        }

    }

}

export default connect(
    state => ({
        aws_proposals_bucket: state.proposals.getIn(['aws_proposals_bucket']),
        proposal: state.proposals.getIn(['proposal']).toJS(),
        user: state.auth.getIn(['user']).toJS()
    }),
    dispatch => bindActionCreators({
        fetchCurrentProposal,
        proposalDeadlineReached,
        changePageTitle,
        authorize
    }, dispatch)
)(Proposals)
