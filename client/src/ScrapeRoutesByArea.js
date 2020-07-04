import React from 'react'
import { useState, useEffect } from "react"
import InfiniteScroll from 'react-infinite-scroll-component'
import axios from "axios"
import {LadderLoading} from "react-loadingg"
import uuid from "react-uuid"
import RouteCard from './routecard'
import cheerio from 'cheerio'
//props.categories
//props.sort
//should change endpoint for each of these

function ScrapeRoutesByArea(props) {

	const sorted = parseInt(props.sort*1)
	var order = 1
	if(sorted == 0) order = -1

	const [routes, setRoutes] = useState([])
	const [images, setImages] = useState([])
	const [locs, setLocs] = useState([])
	const [descriptions, setDesc] = useState([])
	//const [resIndex, setResIndex] = React.useState(0)
	const [loaded, setIsLoaded] = useState(false)
	const [isFirstFetch, setIsFirst] = useState(true)
	const [currPage, setCurrPage] = useState(1)
	const [numPages, setNumPages] = useState(1)
	const [hasMore, setHasMore] = useState(true)
	const [noRes, setNoRes] = useState(false)
	//when anything changes, fetchImages?
	//no way....
	useEffect(() => {
		console.log("fetching images")
    fetchImages()
	}, []);

	var routeBatch;

	var resIndex = 0


	const fetchImages = () => {
			//props.searchStr is our query string
			if(currPage == numPages && numPages > 1 ) {
				setHasMore(false)
			}
			axios({
			method: 'get',
			url: 'http://localhost:3000/api/climbs/' + props.searchStr + '/' + parseInt(currPage) + '/' + order + '/' + props.categories.toString(),
			responseType: 'json',
			timeout: '3000'
			}) //query the backend DB
			//need error handling for 404 here.
			.then(res => {
				//split info into arrays of objects
				console.log(res)
				setNumPages(parseInt(res.numPages))
				//Conditional for EMPTY RESPONSE here.
				let info = res.data

				var infoArr = []
				var tempImages = []
				var tempLocs = []
				var tempDesc = []
				//get the same thing you had before.
				for(let i = 0; i < info.length; i++) {
						infoArr.push(info[i].name, info[i].grade, info[i].mplink, info[i].style, info[i].FA)
						tempImages.push(info[i].images) //push an array of images for each i.
						tempLocs.push(info[i].location)
						tempDesc.push(info[i].description)
				}
				setLocs ([
					...locs,
					...tempLocs
				])
				setImages ([
					...images,
					...tempImages
				])
				setDesc ([
					...descriptions,
					...tempDesc
					])
				setRoutes([
					...routes,
					...infoArr
				])
				setIsLoaded(true)
			})
  		.catch(function (err) {
    		console.log(err)
    		setNoRes(true)
    		//tried to do a state change here to trigger rerender, then check the condition in the render function and render an
    		//error message.
    		//Problem: the state is stale, when you check it, 
  		})
  		setCurrPage(currPage + 1)
		}

	function loadCardComponents() {

  				let j = 0
  				var newArray = []
  				console.log(images.length)
  				for(let i = 0; i < images.length; i++) {
  					var imgs = []
  					var authors = []
  					for(let k = 0; k < images[i].length; k++) {
  						imgs.push(images[i][k].link)
  						authors.push(images[i][k].author)
  					}
  					var temploc = []
  					var stringMatched = false
  					for(let k = 0; k < locs[i].length; k++) {
  						if(locs[i][k].toLowerCase() == props.searchStr.toLowerCase()) {
  							stringMatched = true
  						}
  						if(stringMatched) {
  							temploc.push(locs[i][k])
  						}
							
  						//push the whole location string for this route.
  					}
  					//Truncate the string to whatever comes after the location searched.
  					const piece = (<div className="wrap-wrapper1" id={j.toString()}>
  					<RouteCard name={routes[j]} grade={routes[j+1]} mplink={routes[j+2]} rstyle={routes[j+3]} fa={routes[j+4]} key={uuid()} keyid={uuid()} images={imgs} authors={authors} locs={temploc}/>
  					</div>)
  					j+=5;
  					newArray.push(piece)
  				
  				}
  				return newArray.map((brick) => (
  					<div className="wrap-wrapper" key={uuid()}>{brick}</div>
  				));
 	}

 	 			/*attach text data to a div for each route we have data on
				
				Name
				Location
				Grade - Routestyle
				Description
				FA
				
				THis function doesn't work but the one above does.
 			*/
 	function loadTextComponents() {

		const $ = cheerio.load(document)
 		let j = 0
 		var newArr = []
 		for(let i = 0; i < descriptions.length; i++) {
 			var temploc = []
  					var stringMatched = false
  					for(let k = 0; k < locs[i].length; k++) {
  						if(locs[i][k].toLowerCase() == props.searchStr.toLowerCase()) {
  							stringMatched = true
  						}
  						if(stringMatched) {
  							temploc.push(locs[i][k])
  						}
							
  						//push the whole location string for this route.
  					}
 			const piece = (<div 
 			className="text-inner" 
 			style={{
 							display: 'flex',
 							alignItems: 'center',
 							textAlign: 'left',
 							marginTop: '120px',
 							padding: '0 1rem 0 1rem',
   						minHeight: window.innerHeight,
   						width: '100%',

   					}} 
    	key={uuid()}>
    	<div>
 				<h2>{routes[j]}</h2>
 				<h4>{temploc.join(' > ')}</h4>
 				<p>{descriptions[i]}</p>
 				<h6>FA: {routes[j+4]}</h6>
 			</div>
 			</div>)
 			j+=5
 			newArr.push(piece)
 			}

 			return newArr.map((textDiv) => (
 				<div className="text-wrapper" key={uuid()}>{textDiv}</div>
 			));
 	}

 	//cant just check the images.length here because it starts off as 0.
 	if(noRes || (loaded && images.length === 0)) return (<h3 style={{marginTop: "300px"}}>There are no photos of routes for that area/filter combination.</h3>)

  return (
			<InfiniteScroll
  			dataLength={images} //This is the important field to render the next data
  			next={() => fetchImages()}
  			hasMore={hasMore}
  			loader={<LadderLoading/>} //TODO make a rad loading animation, like of a girl climbing, or a figure-8 being tied.
  			endMessage={
    			<p style={{textAlign: 'center'}}>
      			<b>That's all the routes with images in {props.searchStr}!</b>
    			</p>
  			} >
  			<div id="flex-outer">
  			<div id="grade-links">
  			A
  		{/* Function creating grade links */}
  			</div>
  			<div className="image-grid">
  				{loadCardComponents()}
				</div>
				<div id="info-col">
				{loadTextComponents()}
			{/* function creating route descriptions and protection, similar to the above */}
				</div>
				</div>
			{/*an additional div for descriptions right? how will you make sure the size of them is the same as their neighbour div.
				and a div for the grade sidebar. then wrap all of them in a horizontal flexbox.

				nest these in another set of divs that are each flex.

			*/}
			</InfiniteScroll>
			)

//name={image.name} grade={image.grade} routeLink={image.link}
/*
	Load data, use a callback to set state with this data, show the state with a returned component.
	two lists render below each other.
	{loaded ? images.map((image, index) => (
  					<Image url={image} key={index} keyid={index} />)) : ""}
  				{loaded ? routes.map((name, grade, link) => (
  					<Info name={name} grade={grade} routeLink={link} />)) : ""}
		
*/
}
export default ScrapeRoutesByArea