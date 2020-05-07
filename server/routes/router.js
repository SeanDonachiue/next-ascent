const express = require('express')
const Scraper = require('../controllers/scraper')
const router = express.Router()

//router.get('', undefined object)
//TODO feed an array of strings into this endpoint
router.get('/route/:str', Scraper.scrapeArea)
router.get('/climb/:str', Scraper.getRouteByName)
router.get('/climbs/:str/:page/:order/:categories', Scraper.getRoutesInArea)


module.exports = router