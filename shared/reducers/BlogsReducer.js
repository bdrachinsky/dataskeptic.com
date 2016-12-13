import Immutable from 'immutable';

import getBlog from 'daos/getBlog';
import getBlogContent from 'daos/getBlogContent'

const init = {
  blogs: [],
  folders: [],
  blogs_loaded: 0,
  blog_focus: {blog: undefined, loaded: 0, content: ""},
  env: "prod"
}

const defaultState = Immutable.fromJS(init);

export default function blogsReducer(state = defaultState, action) {
  var nstate = state.toJS()
  switch(action.type) {
    case 'ADD_BLOG':
      console.log("TODO: add this to cache if not already there")
      var blog = action.payload.blog
      var dispatch = action.payload.dispatch
      var loaded = true
      nstate.blog_focus = {blog, loaded}
      var env = nstate.env
      getBlogContent(dispatch, blog.rendered, env)
      break
    case 'SET_FOCUS_BLOG':
      var blog = action.payload.blog
      var fburi = ""
      if (nstate.blog_focus.blog != undefined) {
        fburi = nstate.blog_focus.blog.uri
      }
      if (blog.uri != fburi) {
        nstate.blog_focus.blog = blog
        nstate.blog_focus.loaded = 1
        nstate.blog_focus.content = ""
      }
      break
    case 'ADD_BLOG_CONTENT':
      nstate.blog_focus.content = action.payload.content
      break
    case 'LOAD_BLOG':
      console.log("TODO: get from cache if its there")
      var dispatch = action.payload.dispatch
      var prettyname = action.payload.pathname
      var b = nstate.blog_focus.blog
      var pn = ""
      if (b != undefined) {
        pn = b.prettyname
      }
      if (prettyname != pn) {
        getBlog(dispatch, nstate.env, prettyname)
        nstate.blog_focus = {blog: undefined, loaded: 0, content: ""}
      }
      break
    case 'ADD_BLOGS':
  	  nstate.blogs = action.payload
      break
    case 'SET_BLOGS_LOADED':
  	  nstate.blogs_loaded = action.payload
      break
    case 'FETCH_BLOGS_ERROR':
      nstate.blogs_loaded = -1
      nstate.blog_focus.loaded = -1
      break
    case 'SET_FOLDERS':
      nstate.folders = action.payload
      break
  }
  return Immutable.fromJS(nstate)
}

