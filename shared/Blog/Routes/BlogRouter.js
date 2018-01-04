import React from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux'
import isUndefined from 'lodash/isUndefined';
import { redirects_map } from '../../../redirects';
import {get_podcasts_by_guid} from '../../utils/redux_loader'

import NotFound from '../../NotFound/Components/NotFound'
import BlogTopNav from "../Components/BlogTopNav"
import BlogItem from "../Components/BlogItem"
import BlogList from "../Components/BlogList"
import BlogBreadCrumbs from '../Components/BlogBreadCrumbs'
import NoBlogs from "../Components/NoBlogs"
import Loading from "../../Common/Components/Loading"
import transform_pathname from "../../utils/transform_pathname"

class BlogRouter extends React.Component {

	constructor(props) {
		super(props)
	}

	handle_reload(pathname) {
        const dispatch = this.props.dispatch
		var pname = pathname.substring(5, pathname.length)
    	var ocms = this.props.cms.toJS()
		var blogs = ocms['recent_blogs']
		var exact = undefined
		for (var blog of blogs) {
			var pn = blog['prettyname']
			if (pname == pn) {
				exact = blog
			}
		}
		if (exact) {
			// This means the current state contains the single page requested, so it need not be reloaded
		} else {
	        var payload = {limit: 10, offset: 0, prefix: pname, dispatch}
	        var loaded_prettyname = ocms.loaded_prettyname
	        console.log("Asking blogs to reload")
	        console.log(payload)
	        dispatch({type: "CMS_LOAD_RECENT_BLOGS", payload })
		}
	}

	componentWillReceiveProps(nextProps) {
		var opathname = this.props.location.pathname
		var npathname = nextProps.location.pathname
		if (opathname != npathname) {
			console.log("Going to reload")
			this.handle_reload(npathname)
		} else {
			console.log("Not reloading since " + opathname + "=" + npathname)
		}
	}

    componentDidMount() {
    	console.log("BR did mount")
		var pathname = this.props.location.pathname
    	this.handle_reload(pathname)
    }

    static getPageMeta(state) {
        var ocms = state.cms.toJS()
        var blogs = ocms['recent_blogs']

		let meta = {}

        if (blogs.length === 0) {
            return {
                title: 'Blog Not Found'
            }
        }

        if (blogs.length === 1) {
        	const post = blogs[0]
        	const isEpisode = !isUndefined(post.guid)

			meta.title = `Data Skeptic`
			meta.description = post.desc

			if (isEpisode) {
                meta.image = post.preview;
			}
		}

        return meta;
    }

	filter_blogs(allblogs, pathname) {

	    // ???? 
	    //var redirect = redirects_map[pathname]
	    //if (redirect) {
	    //  pathname = redirect
	    //}
	    var k = '/blog'
	    var path = pathname.substring(k.length, pathname.length)
	    console.log("inject_blog router path=" + path)
	    var limit = 100
	    var count = 0
	    var i = 0
	    var l = allblogs.length
	    console.log("l="+l)
	    var blogs = []
	    while (i < l && count < limit) {
	        var blog = allblogs[i]
	        var pn = blog['prettyname']
	        if (pn.indexOf(path) == 0) {
                blogs.push(blog)
                count += 1
	        }
	        i += 1
	    }
	    return blogs
	}

	render() {
		var pathname = this.props.location.pathname
		console.log("BlogRouter render " + pathname)
		var pname = pathname.substring(5, pathname.length)
		var ocms = this.props.cms.toJS()
		var blogs = ocms['recent_blogs']
		var exact = undefined
		for (var blog of blogs) {
			var pn = blog['prettyname']
			if (pname == pn) {
				exact = blog
			}
		}
		if (exact != undefined) {
			blogs = [exact]
		}
		var blog_state = ocms.blog_state
		if (blog_state == "" || blog_state == "loading" && blogs.length == 0) {
			return <Loading />
		}
		if (blogs.length == 0) {
			console.log("NO BLOGS IN MEMORY!")
			return <NoBlogs />
		}
	    if (blogs.length == 1) {
			return <BlogItem blog={blogs[0]} />
		} else {
			return (
				<div className="center">
					<BlogTopNav pathname={pathname} blogs={blogs} />
					<div className="center">
						<BlogList blogs={blogs} />
					</div>
				</div>
			)
		}
	}
}

export default connect(
	(state, ownProps) => ({
		player: state.player,
		blogs: state.blogs,
		cms: state.cms,
		episodes: state.episodes,
		site: state.site
	}))
(BlogRouter)
