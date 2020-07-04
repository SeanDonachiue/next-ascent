const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const apiPort = 3000
const db = require('../data')
const Route = require('../data/route')
//const scraper = require('./scraper')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())


const climbRouter = require('./routes/router')

/*
const axios = require('axios')
const cheerio = require ('cheerio')
const mpKey = '200630125-b97f60ae266086ee5f1643dffb18ead5'
const cors1 = 'https://still-refuge-34637.herokuapp.com/';

//axios.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest'


async function testScrape() {
	var routeInfo = null;
	try {
		axios({
			method: 'get',
			url: cors1 + 'https://www.mountainproject.com/route/106072248',
			responseType: 'document'
		})
			.then((res) => {
				const $ = cheerio.load(res.data)
				const locLength = $('.mb-half').find('a').nextUntil('#todoToggle').length
				//console.log(locLength) // this is 0, so I guess the preceding assignment doesn't work as in intended 
				const imagesLength = $('.photo-card').length
				//console.log(imagesLength)
				var routeInfo = {
					name: $('h1').text().trim(),
					grade: $('.rateYDS').text().substring(0,5),
					mplink: 'https://www.mountainproject.com/route/106072248',
					location: [],
					images: {
						authors: [],
						links: []
					} //number of photos
				}
				console.log(routeInfo)
				//Get location string
					$('.mb-half').find('a').nextUntil('#todoToggle').not('.require-user').each(function(i, elem) {
						routeInfo.location.push($(this).text())
					})
					//console.log(routeInfo.location)

					//make this async somehow so you can return the full object when it all resolves.
					//promise((resolution function, rejection function) => {}) I hate it.
					let count = 0;
					let dif = 0
					$('.photo-card').each(async function(i, elem) {
						axios({
							method: 'get',
							url: cors1 + $(this).attr('href'),
							responseType: 'document'
						}).then((res) => {
							const S = cheerio.load(res.data)

							const nextLink = S('#expand-href').attr('href')
							if(nextLink != undefined) {
								routeInfo.images.links.push(nextLink)
								routeInfo.images.authors.push(S('.float-xs-left').not('.mr-1').find('a').text())	
							}
							else {
								count--
								dif++
							}
							count++
							//console.log(routeInfo.images)
							if(count === imagesLength - dif) {
							console.log("success"); 
							return routeInfo;
							} //ok so its the stuff that uses this that doesn't work.
						})
					})
					})
			}
			catch (err) {
				console.log("************************CATCH BLOCK*************************")
				console.log(err)
			}
}
*/
//app.use(‘/’, express.static(`${__dirname}/client/build`)

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', async (req, res) => {
	try{
		res.send('hello world')
	} catch(err) {
		console.log(err)
		res.status(500)
	}
})

app.use('/api', climbRouter)


app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))