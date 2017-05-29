import axios from 'axios';

import {changePageTitle} from '../../Layout/Actions/LayoutActions';
import {DEFAULT_APP_TITLE} from '../../Layout/Reducers/LayoutReducer';
import {get_related_content} from '../../utils/redux_loader'

export const LOAD_BLOGS_REQUEST = 'LOAD_BLOGS_REQUEST';
export const LOAD_BLOGS_SUCCESS = 'LOAD_BLOGS_SUCCESS';
export const LOAD_BLOGS_FAILED = 'LOAD_BLOGS_FAILED';

export const LOAD_BLOG_POST_REQUEST = 'LOAD_BLOG_POST_REQUEST';
export const LOAD_BLOG_POST_SUCCESS = 'LOAD_BLOG_POST_SUCCESS';
export const LOAD_BLOG_POST_FAILED = 'LOAD_BLOG_POST_FAILED';

export const ADD_BLOG_CONTENT = 'ADD_BLOG_CONTENT';

export const STOP_BLOG_LOADING = 'STOP_BLOG_LOADING';

export const REMOVE_FOCUS_POST = 'REMOVE_FOCUS_POST';

export function loadBlogs(pathname) {
    return (dispatch) => {
        const url = "/api/v1" + pathname;

        dispatch(loadBlogsRequest());
        return axios.get(url)
            .then(({data}) => { dispatch(loadBlogsSuccess(data)) })
            .catch((err) => { dispatch(loadBlogsFailed(err)) })
    }
}

export function loadBlogsRequest() {
    return {
        type: LOAD_BLOGS_REQUEST
    }
}

export function loadBlogsFailed(error) {
    return {
        type: LOAD_BLOGS_FAILED,
        error
    }
}

export function loadBlogsSuccess(data) {
    return {
        type: LOAD_BLOGS_SUCCESS,
        payload: data
    }
}

export function loadBlogPost(pathname) {
    return (dispatch, getState) => {
        const url = "/api/v1" + pathname;
        const env = getState().blogs.getIn(['env']);

        dispatch(loadBlogPostRequest());
        return axios.get(url)
            .then(({data}) => {
                const post = data || {};
                dispatch(changePageTitle(`${post.title} | ${DEFAULT_APP_TITLE}`));
                dispatch(loadBlogPostSuccess(post));

                get_related_content(dispatch, pathname);
            })
            .catch((err) => { dispatch(loadBlogPostFailed(err)) })
    }
}

export function loadBlogPostRequest() {
    return {
        type: LOAD_BLOG_POST_REQUEST
    }
}

export function loadBlogPostFailed(error) {
    return {
        type: LOAD_BLOG_POST_FAILED,
        error
    }
}

export function loadBlogPostSuccess(post) {
    return {
        type: LOAD_BLOG_POST_SUCCESS,
        payload: {
            post
        }
    }
}

export function stopBlogLoading() {
    return {
        type: STOP_BLOG_LOADING,
    }
}
export function removeFocusPost() {
    return {
        type: REMOVE_FOCUS_POST,
    }
}

export default function getPostContent(post, env) {
    if (env === "prod" || env === "master") {
        env = ""
    } else if (!env) {
        env = ""
    } else {
        env = env + "."
    }
    const renderedPath = post['rendered'];
    const uri = "https://s3.amazonaws.com/" + env + 'dataskeptic.com/' + renderedPath
    return axios.get(uri)
}