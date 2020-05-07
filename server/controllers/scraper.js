const Route = require('../../data/route')
const axios = require('axios')
const cheerio = require ('cheerio')
const mpKey = '200630125-b97f60ae266086ee5f1643dffb18ead5'
const cors1 = 'https://still-refuge-34637.herokuapp.com/';
axios.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.get['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'

var routeSum = 0

//TODO scrape FA info

scrapeArea = (request, response) => {
	//req has the area string in it
	//res will have the routes?
	var idArr = []
	//put all this in a loop to go through an array of location strings.
	//hardcode the locations I guess.
	//it had troubles scraping everything before so maybe you go through it all twice or leave the delay or whatever.
	const searchStr = request.params.str
	var rootURL = cors1 + 'https://www.mountainproject.com/ajax/public/search/results/'
	var numRoutes = 0
	const responseSize = 50
	axios.get(rootURL + 'overview?q=' + searchStr)
	.catch((err) => {
		console.log(err)
		console.log('***************************************OVERVIEW***************************')
	}).then(function(res) {
		numRoutes = res.data.categories.Routes
		console.log(numRoutes) //undefined. fuck. why.
		var reqArray = []
		for(let routeIndex = 0; routeIndex < numRoutes; routeIndex += responseSize) {
			reqArray.push(axios.get(rootURL + 'category?q=' + searchStr + '&c=Routes&o=' + routeIndex + '&s=Default')
				.catch((err) => {
					console.log(err)
					console.log("queryforIDS!!!!!!!!!!!!!!!!!!!!!!!")
				})
			)
		}
		axios.all(reqArray)
		.catch((err) => {
			console.log('*!*!*!*!*!*!*!*!*!!*!*PROCESSING BATCHES !*!*!*!*!!*!*!*!*')
			console.log(err)
		})
		.then(axios.spread((...res) => {
			const maxBatchNum = Math.ceil(numRoutes/responseSize)
			for(let i = 0; i < maxBatchNum; i++) {

				routeBatch = res[i].data.results.Routes
				idToRouteInfo(routeBatch).then(sleep(48200))
				//wait two minute between batches even though a batch fires 50 * 12 requests potentially.
				 //8 minutes 2 seconds waiting period between routes. 
			}
			//jumps right to the return even though the async stuff hasn't resolved yet. cool.
		}))
		return response
	})
}

async function idToRouteInfo(routesIn) {
		//scrape info and images for fifty routes at a time
		for(let i = 0; i < routesIn.length; i++) {
		
			let temp = routesIn[i].substring(routesIn[i].indexOf('/route/') + 7)
			let routeID = temp.substring(0, temp.indexOf("/"))
			//have a single route ID now, we can make a non-rate limited get request to the route page, 
			//(save the url, name, and grade)
			//and parse out the images.
			
			//TODO: We can query more than one route at once if we concatenate all the IDs. This might save some performance.
			//need to do routeID assignment
			axios({
				method: 'get',
				url: cors1 + 'https://www.mountainproject.com/route/' + routeID,
				responseType: 'document'
			}).catch((err) => {
					console.log("CAUGHT 500 error in idToRouteInfo")
			})
			.then((res) => {
				
				let $ = cheerio.load(res.data)
				let locLength = $('.mb-half').find('a').nextUntil('#todoToggle').length
				let imagesLength = $('.photo-card').length

				var routeStyle;
				//boulders don't have a comma.
				//get the first ascent info
				//also get multipitch?
				
				if($('.description-details').find('td').next().text().trim().charAt(0) == 'B') {
					 routeStyle = "Boulder"
				}
				else {
					let commaIndex = $('.description-details').find('td').next().text().indexOf(',')
					routeStyle = $('.description-details').find('td').next().text().substring(0, commaIndex).trim()
				}
				
				let cut = $('.rateYDS').text().indexOf(' ')
				let grade = $('.rateYDS').text().substring(0, cut)
				//Somehow have the wrong routeID attaching to these, which makes no sense at all, since its already been used to get everything else which is correct.
				let routeInfo = {
					name: $('h1').text().trim(),
					grade: grade,
					gradePriority: grades.indexOf(grade),
					mplink: 'https://www.mountainproject.com/route/' + routeID,
					location: [],
					style: routeStyle,
					images: [] 
				}
				//console.log(routeInfo)
				//Get location string
					$('.mb-half').find('a').nextUntil('#todoToggle').not('.require-user').each(function(i, elem) {
						routeInfo.location.push($(this).text())
					})
					let count = 0;
					let dif = 0
					//what the fuck why does this return true still.
					if($('.photo-card').is('.photo-card')) {
					$('.photo-card').each(async function(i, elem) {
						axios({
							method: 'get',
							url: cors1 + $(this).attr('href'),
							responseType: 'document'
						})
						.catch((err) => {
							console.log(err)
							console.log("ERROR IN IMAGE MODAL QUERY")
						}).then((response) => {
							console.log("in the image query results")
							//OK so no error thrown, but still there is nothing being saved.
							//console.log(res.data)
							//so some of them DO load here it looks like.
							S = cheerio.load(response.data)
							const nextLink = S('#expand-href').attr('href')
							if(nextLink != undefined) {

								let newimg = {author: (S('.float-xs-left').not('.mr-1').find('a').text()), link: nextLink}
								routeInfo.images.push(newimg)

								count++	
							}
							else {
								count--
								dif++
							}
							
							//console.log(routeInfo.images)
							if((count === imagesLength - dif) && (imagesLength > 0)) {
								console.log("success");
								routeSum++
								console.log(routeSum)
								//why the fuck doesn't this work.
								//ok so that looks good right.
								const climbRoute = new Route(routeInfo)
								//might need a loop here.
								//Route.create(routeInfo)

								//cross your fingers.

								const filter = {name: routeInfo.name}

								Route.findOneAndUpdate(filter, routeInfo, {
									new: true,
									upsert: true
								}).catch((err) => {
									console.log(err)
									console.log("problem loading db")
								}).then(() => {
									console.log("loaded db")
								})
							}
						})
					})
					} //if there are no pictures, don't save anything, go to the next iteration of the loop.

					})
		}
		//this runs four times before anything else does anything. oof.
		console.log("at the end of IDTOROUTEINFO")
		//makes 0 sense.
		//can always maker a manual timer here I guess.
		return //this line is never reached it seems.
}

getRoutesInArea = (req, res) => {

	const resPerPage = 12;

	//req.params.order will be the sort order.

	//check req.params.categories for each of "Trad,Sport,Boulder"
	//Split on commas back into an array and check if its empty
	//if it has items, filter the request to the backend.

	const styleArray = req.params.categories.split(',')

	//now start by selecting all routes with matching location string

	//hardcoded right now.
	Route.find({$and: [{location: { $regex: new RegExp(req.params.str, "i") }}, {style: { $in: styleArray }}]})
		.sort({gradePriority: parseInt(req.params.order)})
		.skip((resPerPage * req.params.page) - resPerPage)
		.limit(resPerPage)
		.exec((err, docs) => {
			if(err) console.log(err)
			Route.count({location: { $regex: new RegExp(req.params.str, "i") }})
			.exec((e, num) => {
				console.log("there are: " + num + " results")
				if(e) console.log(e)
				numPages = num / resPerPage
				docs.numPages = numPages
				return res.send(JSON.stringify(docs))
			})
			//return res.send(json.... here before)
		})
}


getRouteByName = (req, res) => {
	//need to do something about case sesnsitivity.
	Route.findOne({name:  { $regex : new RegExp(req.params.str, "i") }}, {}).then((err, docs) => {
		console.log(JSON.stringify(docs))
		console.log(err)
	})
	Route.countDocuments().then((err, doc) => {
		console.log(JSON.stringify(doc))
		console.log(err)
	})
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const grades = 
					[
					 '5.1',
					 '5.2',
					 '5.3',
					 '5.4',
					 '5.5',
					 '5.6',
					 '5.7',
					 '5.7+',
					 'VB',
					 'V0-',
					 '5.8-',
					 '5.8',
					 '5.8+',
					 '5.9-',
					 '5.9',
					 'V0',
					 'V0+',
					 '5.9+',
					 '5.10-',
					 '5.10',
					 '5.10a',
					 '5.10a/b',
					 '5.10b',
					 '5.10b/c',
					 '5.10c',
					 '5.10c/d',
					 'V1',
					 'V1+',
					 '5.10d',
					 '5.10+',
					 '5.11',
					 '5.11a',
					 '5.11-',
					 '5.11a/b',
					 'V2',
					 'V2+',
					 '5.11b',
					 '5.11b/c',
					 '5.11c',
					 'V3',
					 'V3+',
					 '5.11',
					 '5.11c/d',
					 '5.11d',
					 '5.11+',
					 '5.12',
					 '5.12a',
					 '5.12-',
					 'V4',
					 'V4+',
					 '5.12a/b',
					 '5.12b',
					 '5.12b/c',
					 '5.12c',
					 'V5',
					 '5.12c/d',
					 '5.12d',
					 '5.12+',
					 'V6',
					 '5.13-',
					 '5.13',
					 '5.13a',
					 'V7',
					 '5.13a/b',
					 '5.13b',
					 '5.13b/c',
					 '5.13c',
					 'V8',
					 '5.13c/d',
					 '5.13d',
					 'V9',
					 '5.13+',
					 'V10',
					 '5.14',
					 '5.14a',
					 '5.14-',
					 '5.14a/b',
					 'V11', 
					 '5.14b',
					 '5.14b/c',
					 'V12',
					 '5.14c',
					 '5.14c/d',
					 '5.14d',
					 'V13',
					 '5.14+',
					 '5.15',
					 '5.15-',
					 'V14',
					 '5.15-',
					 '5.15a',
					 'V14-15',
					 '5.15a/b',
					 '5.15b',
					 'V15',
					 '5.15b/c',
					 '5.15c',
					 'V16',
					 '5.15c/d',
					 '5.15d',
					 '5.15+',
					 'V17'
					]

module.exports = {
	scrapeArea,
	getRouteByName,
	getRoutesInArea
}