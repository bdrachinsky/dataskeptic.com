import React, { PropTypes } from "react"
import ReactDOM from "react-dom"
import { connect } from 'react-redux'
import { Link } from 'react-router'

class BlogBreadCrumbs extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		var prettyname = this.props.prettyname
		var arr = prettyname.split('/')
		var items = []
		var url = ""
		for (var i=0; i < arr.length - 1; i++) {
			var name = arr[i]
			if (i == 0) {
				name = "root"
				url = "/blog/"
			} else {
				url += name + '/'
			}
			var item = {"name": name, "url": url}
			items.push(item)
		}
		arr[0] = "home"
		return (
			<div className="blog-bread-crumbs">
			{
				items.map((item) => {
					var name = item['name']
					var url = item['url']
					if (name=="root") {
						console.log(url)
					}
					return <div className="blog-bread-crumbs-item"><Link to={url}>{name}</Link> / </div>
				})
			}
			<br/>
			</div>
		)
	}
};

export default connect(state => ({ }))(BlogBreadCrumbs)
