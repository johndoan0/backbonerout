// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')

var $ = require('jquery'),
	Backbone = require('backbone')

console.log('loaded dist file')

// other stuff that we don't really use in our own code
// var Pace = require("../bower_components/pace/pace.js")

// require your own libraries, too!
// var Router = require('./app.js')

// window.addEventListener('load', app)

// function app() {
    // start app
    // new Router()
// }

window.onload = function(){

	var inputEl = $('input')[0]
	var apiKeyParams = '?access_token=9fcb95fdc1f1c66b092d944297ca0deff9a4d722'
	var urlProfile = 'https://api.github.com/users/'

//store input value
	var inputKeyEvent = function(event){
		if(event.keyCode === 13){ 
			var query = inputEl.value
			inputEl.value = ''
			console.log('input ' + query)
			location.hash = query
		}	
	}
	
//ajax pull profile and repo	
	var doAjaxProfileRepo = function(q){

	//ajax profile
		var ajaxProfile = {
			//parameters for pulling profile info
			url: urlProfile + q.slice(1) + apiKeyParams,
			success: headerInfo,
			success: listprofileInfo
		}
		$.ajax(ajaxProfile)

	//ajax repo		
		var ajaxRepo = {
		//parameters for pulling repo info
			url: urlProfile + q.slice(1) + '/repos' + apiKeyParams,
			success: listRepos
		}
		$.ajax(ajaxRepo)
	}

//HTML profile info
	var headerInfo = function(headMeta){
	//get metadata name and username of repo for h1
		var headInfo = $("h1")[0];
		// console.log(headInfo)
		headInfo.innerHTML = "Repos of " + headMeta.name + " "
			+ "(" + headMeta.login + ")"
	}

	var listprofileInfo =function(proObj){
	//profile info {pI1, pI2, pI3...} --> <li> pI </li>
		var listofpInfo = $("#profileInfo")[0];
		// console.log(listofpInfo)
		listofpInfo.innerHTML =
			"<img src=" + proObj.avatar_url + ">" 
			+ "<li>" + proObj.name + "</li>"
			+ "<li>" + proObj.login + "</li>"
			+ "<hr>"
			+ "<li>" + proObj.location + "</li>"
			+ "<li>" + proObj.email + "</li>"
			+ "<li>" + proObj.html_url + "</li>"
			+ "<li>" + proObj.blog + "</li>"
	}

//HTML repos	
	var listRepos = function(repoArr){
	//[repObj1, repObj2, repObj3...] --> <a>repObj</a>
		var listElement = $("#repos")[0];
		listElement.innerHTML = ''
		repoArr.forEach(function(repObj){
			listElement.innerHTML += "<a href=" + repObj.html_url + ">" + repObj.name + "</a><br>"	
		})	
	}
	
//change page when hash changes	
	window.onhashchange = function(){
		var query = location.hash
		console.log('hash ' + query)
		doAjaxProfileRepo(query)
	}

//backbone router
	var ghRouter = Backbone.Router.extend({
		'routes': {
			'users/:query': 'searchResults',
			'*anyroute': 'defaultPage'
		},

		searchResults: (query) => {doAjaxProfileRepo(query)},

		defaultPage: () => {
			$('#title')[0].innerHTML = "Enter a GitHub username"
		}
	})

	new ghRouter()
	Backbone.history.start();

//event listener --> event handler
inputEl.onkeypress = inputKeyEvent
}