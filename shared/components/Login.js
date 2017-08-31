import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import LoginForm from './LoginForm'
import {login} from "../Admin/Actions/AdminActions"
import {bindActionCreators} from 'redux'

import {changePageTitle} from '../Layout/Actions/LayoutActions';

class Login extends Component {
    constructor() {
        super();
        this.submit = this.submit.bind(this)
    }

    componentWillMount() {
        const {title} = Login.getPageMeta();
        this.props.changePageTitle(title);
    }

    componentDidMount() {

    }

    static getPageMeta() {
        return {
            title: 'Login | Data Skeptic'
        }
    }

    checkUser() {
        let isAdmin = sessionStorage.getItem('isAdmin');
        if (isAdmin) {
            this.props.history.push('/admin')
        }
    }

    submit() {

    }

    render() {
        return (
            <div className="center">
                <div className="admin-auth-container">
                    <h3>Please log in</h3>
                    <button className="btn btn-primary">Log in</button>
                </div>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        isAdmin: state.admin.isAdmin
    }),
    (dispatch) => bindActionCreators({
        login,
        changePageTitle
    }, dispatch)
)(Login);
