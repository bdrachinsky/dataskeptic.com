import xml2js from 'xml2js'
import axios  from 'axios'
import { convert_items_to_json } from 'daos/episodes'
import { extractFolders } from '../utils/blog_utils'

function generate_content_map(env, blog, my_cache) {
  var pn = blog['prettyname']
  var envv = env + "."
  if (env == "prod") {
    envv = ""
  }
  var key = blog["rendered"]
  var pn = blog["prettyname"]
  var uri = "https://s3.amazonaws.com/" + envv + 'dataskeptic.com/' + key
  axios.get(uri).then(function(result) {
    var content = result.data
    my_cache.content_map[pn] = content
  })
  .catch((err) => {
    console.log("Content cache error trying to store blog content")
    console.log(err)
  })
}

export function loadProducts(env, my_cache) {
  var uri = "https://obbec1jy5l.execute-api.us-east-1.amazonaws.com/" + env + "/products"
  axios
    .get(uri)
    .then(function(result) {
      var items = result.data.Items
      my_cache.products['items'] = items
    })
    .catch((err) => {
      console.log("Could not load prodcuts")
    })      

}
export function loadBlogs(store, env, my_cache) {
  var uri = "https://obbec1jy5l.execute-api.us-east-1.amazonaws.com/" + env + "/blogs?env=" + env
  axios
  .get(uri)
  .then(function(result) {
    var blogs = result.data
    var folders = extractFolders(blogs)
    my_cache.folders = folders
    store.dispatch({type: "ADD_FOLDERS", payload: folders })
    store.dispatch({type: "ADD_BLOGS", payload: blogs })
    for (var i=0; i < blogs.length; i++) {
      var blog = blogs[i]
      var pn = blog['prettyname']
      my_cache.blogmetadata_map[pn] = blog
      if (i == 0) {
        my_cache.blogmetadata_map["latest"] = blog
      }
      var title = blog['title']
      my_cache.title_map[pn] = title
      generate_content_map(env, blog, my_cache)
    }
    console.log("Loaded all blogs into content_map")
  })
  .catch((err) => {
    console.log("loadBlogs error: " + err)
  })
}

export function loadEpisodes(env, feed_uri, my_cache) {
  axios
    .get(feed_uri)
    .then(function(result) {
      var xml = result["data"]
      var parser = new xml2js.Parser()

      parser.parseString(xml, function(err,rss) {
        var items = rss["rss"]["channel"][0]["item"]
        var episodes = convert_items_to_json(items)
        var list = []
        for (var i=0; i < episodes.length; i++) {
          var episode = episodes[i]
          my_cache.episodes_map[episode.guid] = episode
          if (i == 0) {
            my_cache.episodes_map["latest"] = episode
          }
          list.push(episode.guid)
        }
        my_cache.episodes_list.splice(0, my_cache.episodes_list.length)
        for (var i=0; i < list.length; i++) {
          my_cache.episodes_list.push(list[i])
        }
        console.log("Loaded all episodes into map")
    })
  })
  .catch((err) => {
    console.log("loadEpisodes error: " + err)
    console.log(err)
  })
}

