import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux';

import Loading from "./Loading"

class LatestBlogCard extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		var oblogs = this.props.blogs.toJS()
		var blogs = oblogs.blogs
		var blog_focus   = oblogs.blog_focus || {loaded: 0}
		var blogs_loaded = oblogs.blogs_loaded
		if (blogs_loaded == 0) {
			return <Loading />
		}
		if (blogs.length == 0) {
			return <Error />
		}
		var blog = undefined
		if (blog_focus.loaded == 1) {
			console.log("Using blog_focus")
			blog = blog_focus.blog
		}
		else if (blogs.length > 0) {
			console.log("Using top of cache")
			var i=0
			while (i < blogs.length) {
				var b = blogs[i]
				var pn = b.prettyname
				if (pn.indexOf("/episodes/") == -1 && pn.indexOf("/transcripts/") == -1) {
					blog = b
					i = blogs.length
				}
				i++
			}
			blog = blogs[0]
		}
		if (blog == undefined) {
			return <Error />
		}
		var pn = blog.prettyname
		if (pn[0] == "/") {
			pn = pn.substring(1, pn.length)
		}
		pn = "/blog/" + pn
		var date = blog["publish_date"]
		return (
			<div className="home-latest-blog-card">
				<div className="home-latest-blog-top"><p>From the blog:</p></div>
				<div className="home-latest-blog-card-container">
					<Link className="blog-title" to={pn}>{blog.title}</Link>
					<span className="blog-date">{date}</span>
					<p>{blog.desc}</p>
					<p> ...<Link to={pn}>[more]</Link></p>
				</div>
			</div>
		)
	}
}

export default connect(state => ({ blogs: state.blogs }))(LatestBlogCard)
