import React from 'react'
import { useState, useEffect } from "react"
import InfiniteScroll from 'react-infinite-scroll-component'
import axios from "axios"
import {LadderLoading} from "react-loadingg"
import uuid from "react-uuid"
import RouteCard from './routecard'

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
			setNoRes(false)
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
				//get the same thing you had before.
				for(let i = 0; i < info.length; i++) {
						infoArr.push(info[i].name, info[i].grade, info[i].mplink, info[i].style)
						tempImages.push(info[i].images) //push an array of images for each i.
						tempLocs.push(info[i].location)
						/*
							I want to assign an array of objects, called images to my images state hook
							when I do tempImages.push(info[i].images)
						*/


						//console.log(info[i].location)
				}
				setLocs ([
					...locs,
					...tempLocs
				])
				setImages ([
					...images,
					...tempImages
				])
				setRoutes([
					...routes,
					...infoArr
				])
				setIsLoaded(true)
			})
  		.catch(function (err) {
    		console.log(err)
    		if (err.response.status == 404) {
    			setNoRes(true)
    			console.log(noRes)
    		}
  		})
  		setCurrPage(currPage + 1)
		}

  const Image = (props) => (
    <div className="image-item" key={props.keyid}>
      <img src={props.url} key={props.keyid} style={{maxWidth: '100%', marginRight: 'auto', marginLeft: 'auto'}}/>
    </div>
  )
  const Info = (props) => (
  	<div className="route-info" key={props.keyid}>
  		<a href={props.url} ><h3> {props.name} - {props.grade}</h3> </a>
  	</div>
  )


  const err404 = () => (
  		<h3>There are no results.</h3>
  	)

	function loadCardComponents() {
  				let j = 0
  				var newArray = []
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
  					const piece = (<div className="wrap-wrapper">
  					<RouteCard name={routes[j]} grade={routes[j+1]} mplink={routes[j+2]} rstyle={routes[j+3]} key={uuid()} keyid={uuid()} images={imgs} authors={authors} locs={temploc}/>
  					</div>)
  					j+=4;
  					newArray.push(piece)
  				

  				return newArray.map((brick) => (
  					<div className="wrap-wrapper" key={uuid()}>{brick}</div>
  				));
  			}
	}

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
  			<div className="image-grid">
  				{noRes ? <err404/> : loadCardComponents()}
				</div>
			{/*used to just say map(image, index) => (<Image>)*/}
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