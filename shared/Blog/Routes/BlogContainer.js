import React, { Component } from "react"
import ReactDOM from "react-dom"
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import NotFound from '../../NotFound/Components/NotFound'
import BlogList from "../Components/BlogList"
import BlogNav from "../Components/BlogNav"
import BlogItem from "../Components/BlogItem"

import PaginationContainer from '../../Pagination/Containers/PaginationContainer';

import transform_pathname from "../../utils/transform_pathname"

import isNaN from 'lodash/isNaN';

import Container from '../../Layout/Components/Container/Container';
import Content from '../../Layout/Components/Content/Content';
import SideBar from '../../Layout/Components/SideBar/SideBar';
import Loading from '../../Common/Components/Loading';

import {changePageTitle} from '../../Layout/Actions/LayoutActions';
import isCtrlOrCommandKey from '../../utils/isCtrlOrCommandKey';

const DEFAULT_ACTIVE_FOLDER = 'All';
import BLOGS_NAV_MAP from '../Constants/navMap';

class BlogContainer extends Component {

    constructor(props) {
        super(props);

        this.fetchPosts = this.fetchPosts.bind(this);
        this.onPaginatorPageClick = this.onPaginatorPageClick.bind(this);
        this.onNavClick = this.onNavClick.bind(this);
    }

    static getPageMeta() {
        return {
            title: 'Blogs | Data Skeptic'
        }
    }

    fetchPosts(pageNum = 1) {
        const location = this.props.location;

        if (location) {
            const offset = ((pageNum - 1) * this.props.perPage);
            const add = ((pageNum === 1) ? 0 : 1);
            const limit = this.props.perPage;

            const pathname = `/blog?offset=${offset + add}&limit=${limit}`;
            this.props.loadBlogs(pathname);
        } else {
            console.log("location is not defined")
        }
    }

    componentWillReceiveProps(props) {
        const pageHasChanged = props.location.pathname !== this.props.location.pathname;

        if (pageHasChanged) {
            this.fetchPosts(props.pageNum);
            const {title} = BlogContainer.getPageMeta();
            this.props.changePageTitle(title);
        }
    }

    fetchAllPosts() {
        const location = this.props.location;

        if (location) {
            const pathname = `/blog?offset=0&limit=9999`;
            this.props.loadBlogs(pathname);
        } else {
            console.log("location is not defined")
        }
    }

    componentDidMount() {
        const isEmpty = this.props.blogs.toJS().blogs.length === 0;

        const folderName = this.props.folderName || '';
        if (isNaN(+folderName)) {
            this.fetchAllPosts();
        } else {
            this.fetchPosts(this.props.pageNum);
        }

        const {title} = BlogContainer.getPageMeta();
        this.props.changePageTitle(title);
    }

    onPaginatorPageClick(pageNum) {
        if (window) {
            if (!isCtrlOrCommandKey(e)) {
                this.fetchPosts(pageNum);
                window.scrollTo(0, 0);
            }
        }

    }

    remove_type(typ, arr) {
        var sub = []
        var key = "/" + typ + "/"
        for (var i = 0; i < arr.length; i++) {
            var blog = arr[i]
            var pn = blog.prettyname
            if (pn.indexOf(typ) == -1) {
                sub.push(blog)
            }
        }
        return sub
    }

    only_type(typ, arr) {
        var sub = []
        var key = "/" + typ + "/"
        for (var i = 0; i < arr.length; i++) {
            var blog = arr[i]
            var pn = blog.prettyname
            if (pn.indexOf(key) != -1) {
                sub.push(blog)
            }
        }
        return sub
    }

    onNavClick(e) {
        if (window) {
            window.scrollTo(0, 0);
        }

        if (e.target.innerText === DEFAULT_ACTIVE_FOLDER) {
            return this.fetchPosts();
        }

        this.fetchAllPosts();
    }

    static getPageTitle(props, activeFolder) {
        const {pageNum} = props;
        const activeFolderIsDefault = (activeFolder === DEFAULT_ACTIVE_FOLDER);
        const folderTranscription = BLOGS_NAV_MAP[activeFolder];

        let title = '';

        if (!activeFolderIsDefault || pageNum !== 1) {
            title = folderTranscription;
        }

        if (pageNum > 1) {

            title += ` / Page ${pageNum}`;
        }

        return title;
    }

    render() {
        let {pageNum} = this.props;
        const {total, perPage} = this.props;

        const oblogs = this.props.blogs.toJS();
        const blog_focus = oblogs.blog_focus;
        const folders = oblogs.folders || [];
        let blogs = oblogs.blogs || [];


        let opathname = this.props.pathname
        if (!opathname) {
            opathname = this.props.location.pathname
        }
        const pathname = transform_pathname(opathname);

        let activeFolder = DEFAULT_ACTIVE_FOLDER;
        for (let i = 0; i < folders.length; i++) {
            const folder = folders[i]
            const sfolder = "/" + folder
            if (pathname.indexOf(sfolder) === 0 && pathname.length === sfolder.length) {
                activeFolder = folder;
                blogs = this.only_type(folder, blogs)
            }
        }

        if (pathname === "" || pathname === "/") {
            blogs = this.remove_type("episodes", blogs);
            blogs = this.remove_type("transcripts", blogs);
        }


        const contentTitle = BlogContainer.getPageTitle(this.props, activeFolder);
        const latestBlogId = oblogs.latestId;
        const isLoading = blogs.length === 0;

        return (
            <div className="blog-page">
                <Container>
                    <Content title={contentTitle}>
                        { isLoading
                            ? <div className="loading-area"><Loading/></div>
                            : <BlogList blogs={blogs} latestId={latestBlogId}/>
                        }
                    </Content>

                    <SideBar title="Categories">
                        <BlogNav folders={folders} pathname={pathname} activeFolder={activeFolder} onClick={this.onNavClick} />
                    </SideBar>
                </Container>
                { activeFolder === DEFAULT_ACTIVE_FOLDER ?
                    <Container>
                        <div className="row">
                            <PaginationContainer
                                currentPage={pageNum}
                                total={total}
                                perPage={perPage}
                                onPageClick={this.onPaginatorPageClick}
                            />
                        </div>
                    </Container>

                : null }
            </div>
        )
    }
}

export default connect(
    (state, ownProps) => ({
        pageNum: +ownProps.params.pageNum || 1,

        folderName: ownProps.params.pageNum,

        perPage: 10,
        total: state.blogs.getIn(['total']),

        blogs: state.blogs,
    }),
    (dispatch) => (bindActionCreators({
        loadBlogs,
        changePageTitle
    }, dispatch))
)(BlogContainer)

