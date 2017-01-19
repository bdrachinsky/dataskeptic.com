import aws                       from 'aws-sdk'
import axios                     from 'axios';
import {get_contributors}        from 'backend/get_contributors'
import {join_slack}              from 'backend/join_slack'
import {send_email}              from 'backend/send_email'
import {order_create}            from 'backend/order_create'
import {order_fulfill}           from 'backend/order_fulfill'
import {order_list}              from 'backend/order_list'
import {related_content}         from 'backend/related_content'
import bodyParser                from 'body-parser'
import compression               from 'compression';
import getBlogs                  from 'daos/blogs';
import { feed_uri }              from 'daos/episodes'
import { loadBlogs,
         loadEpisodes }          from 'daos/serverInit'
import express                   from 'express';
import FileStreamRotator         from 'file-stream-rotator'
import fs                        from 'fs'
import createLocation            from 'history/lib/createLocation';
import promiseMiddleware         from 'lib/promiseMiddleware';
import fetchComponentData        from 'lib/fetchComponentData';
import morgan                    from 'morgan'
import path                      from 'path';
import React                     from 'react';
import { renderToString }        from 'react-dom/server';
import { Provider }              from 'react-redux';
import { RoutingContext, match } from 'react-router';
import routes                    from 'routes';
import * as reducers             from 'reducers';
import { createStore,
         combineReducers,
         applyMiddleware }       from 'redux';
import getContentWrapper         from 'utils/content_wrapper';
import redirects_map             from './redirects';

const app = express()

var logDirectory = path.join(__dirname, 'log')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false
})
app.use(morgan('combined', {stream: accessLogStream}))


var env = "prod"

aws.config.loadFromPath('awsconfig.json');

if (process.env.NODE_ENV !== 'production') {
  require('./webpack.dev').default(app);
  env = "dev"
}
console.log("Environment: ", env)

var title_map = {}         // `uri`             -> <title>
var content_map = {}       // `uri`             -? {s3 blog content}
var blogmetadata_map = {}  // `uri`             -> {blog}
var episodes_map = {}      // `guid` | 'latest' -> {episode}


loadBlogs(env, blogmetadata_map, title_map, content_map)
loadEpisodes(env, feed_uri, episodes_map)

setInterval(function() {
  console.log("---[Refreshing cache]------------------")
  console.log(process.memoryUsage())
  var env = global.env
  var title_map = global.title_map
  var blogmetadata_map = global.blogmetadata_map
  var episodes_map = global.episodes_map
  var content_map = global.content_map
  loadBlogs(env, blogmetadata_map, title_map, content_map)
  loadEpisodes(env, feed_uri, episodes_map)
}, 5 * 60 * 1000)

global.env              = env
global.title_map        = title_map
global.content_map      = content_map
global.blogmetadata_map = blogmetadata_map
global.episodes_map     = episodes_map

if (process.env.NODE_ENV == 'production') {
  function shouldCompress (req, res) {
    if (req.headers['x-no-compression']) {
      // don't compress responses with this request header
      return false
    }
    // fallback to standard filter function
    return compression.filter(req, res)
  }
  app.use(compression({filter: shouldCompress}))
}

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

var stripe_key = "sk_test_81PZIV6UfHDlapSAkn18bmQi"
var sp_key = "test_Z_gOWbE8iwjhXf4y4vqizQ"
var slack_key = ""

fs.open("config.json", "r", function(error, fd) {
  var buffer = new Buffer(10000)
  fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
    var data = buffer.toString("utf8", 0, bytesRead)
    var c = JSON.parse(data)
    var env2 = env
    env2 = "prod"
    stripe_key = c[env2]['stripe']
    sp_key = c[env2]['sp']
    slack_key = c[env2]['slack']
    fs.close(fd)
  })
})

function api_router(req, res) {
  if (req.url.indexOf('/api/slack/join') == 0) {
    var req = req.body
    join_slack(req, res, slack_key)
    return true
  }
  else if (req.url.indexOf('/api/email/send') == 0) {
    send_email(req, res)
    return true
  }
  else if (req.url.indexOf('/api/order/create') == 0) {
    order_create(req, res, sp_key)
    return true
  }
  else if (req.url.indexOf('/api/order/fulfill') == 0) {
    order_fulfill(req, res, stripe_key)
    return true
  }
  else if (req.url.indexOf('/api/order/list') == 0) {
    order_list(req, res, stripe_key)
    return true
  }
  else if (req.url.indexOf('/api/contributors/list') == 0) {
    var req = req.body
    get_contributors(req, res)
    return true
  }
  else if (req.url.indexOf('/api/related') == 0) {
    var params = req['params']
    console.log(req.query)
    console.log(['p', params])
    related_content(req, res)
    return true
  }
  return false
}

app.use( (req, res) => {
  if (req.url.indexOf('/src-') > 0) {
    var u = req.url
    var i = u.indexOf('/blog/') + '/blog'.length
    if (i > 0) {
      var hostname = 's3.amazonaws.com/dataskeptic.com'
      if (env != 'prod') {
        hostname = 's3.amazonaws.com/' + env + '.dataskeptic.com'
      }
      var redir = u.substring(i, u.length)
      return res.redirect(301, 'https://' + hostname + redir)
    }
  }
  if (req.url.indexOf('/api') == 0) {
    var routed = api_router(req, res)
    if (routed) {
      return
    }
  }
  var redir = redirects_map['redirects_map'][req.url]
  var hostname = req.headers.host
  if (redir != undefined) {
    console.log("Redirecting to " + hostname + redir)
    return res.redirect(301, 'http://' + hostname + redir)
  }
  if (req.url == '/feed.rss') {
    return res.redirect(307, 'http://dataskeptic.libsyn.com/rss')
  }

  const location = createLocation(req.url);
  const reducer  = combineReducers(reducers);
  const store    = applyMiddleware(promiseMiddleware)(createStore)(reducer);

  const initialState = store.getState()

  var oepisodes = initialState.episodes.toJS()
  var oblogs    = initialState.blogs.toJS()
  var osite     = initialState.site.toJS()

  match({ routes, location }, (err, redirectLocation, renderProps) => {
    if(err) {
      console.error(err);
      return res.status(500).end('Internal server error');
    }

    if(!renderProps) {
      var title = "Page not found"
      var componentHTML = "<div><h1>Not Found</h1><p>You've encountered a bogus link, deprecated link, or bug in our site.  Either way, please nagivate to <a href=\"http://dataskeptic.com\">dataskeptic.com</a> to get back on course.</p></div>"

      var injects = {
        "react-view" : componentHTML
      }

      var HTML = getContentWrapper(title, initialState, injects)
      var pathname = location.pathname
      console.log("page not found:" + pathname)
      return res.status(404).end(componentHTML);
    }

    function renderView() {
      var pathname = location.pathname.substring('/blog'.length, location.pathname.length)
      console.log("render: " + location.pathname)
      var content = content_map[pathname]
      var dispatch = store.dispatch
      if (content == undefined) {
        content = ""
        //console.log(pathname + ": did not pull content from cache")
      } else {
        //console.log(pathname + ": pulled content from cache")
      }

      var blog_page = pathname
      if (pathname == "" || pathname == "/") {
        blog_page = "latest"
      }
      var blog_metadata = blogmetadata_map[blog_page]
      var guid = ""
      if (blog_metadata == undefined) {
        blog_metadata = {}
        //console.log(pathname + ": did not pull blog metadata from cache")
      } else {
        //console.log(pathname + ": pulled blog metadata from cache")
        guid = blog_metadata.guid
      }

      if (pathname == "" || pathname == "/") {
        guid = "latest"
      }
      var episode_metadata = episodes_map[guid]
      if (episode_metadata == undefined) {
        episode_metadata = {}
        //console.log(pathname + ": did not pull episode metadata from cache")
      } else {
        //console.log(pathname + ": pulled episode metadata from cache")
      }

      const InitialView = (
        <Provider store={store}>
          <RoutingContext {...renderProps} />
        </Provider>
      );

      var title = osite.title + ":" + location.pathname
      var alt_title = title_map[pathname]
      if (alt_title != undefined) {
        title = alt_title
      }

      const componentHTML = renderToString(InitialView)

      var injects = {
        "react-view"                : componentHTML,
        "content-prefetch"          : content,
        "blog-metadata-prefetch"    : JSON.stringify(blog_metadata),
        "episode-metadata-prefetch" : JSON.stringify(episode_metadata)
      }

      const HTML = getContentWrapper(title, initialState, injects)
      return HTML;
    }

    fetchComponentData(store.dispatch, renderProps.components, renderProps.params)
      .then(renderView)
      .then(html => res.status(200).end(html))
      .catch(err => res.end(err.message));
  });
});

export default app;
