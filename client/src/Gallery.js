import React from 'react'
import { useState, useEffect } from "react"
import axios from "axios"
import InfiniteScroll from 'react-infinite-scroll-component'

axios.defaults.headers.common['header1'] = ('origin', 'http://localhost')

function Gallery() {
	const [images, setImages] = React.useState([])
	const [loaded, setIsLoaded] = React.useState(false)
	React.useEffect(() => {
    fetchImages()
	}, []);

  //Supposed to do this on server side so nobody can see your access key but fine on local
  //'https://cors-anywhere.herokuapp.com/' +
  const fetchImages = (count = 10) => {
    const apiRoot = "https://api.unsplash.com";
    const accessKey = "02e46627754e68533d5b3117081610d2dd0bb91050c57cf0977f55dd6f3252a3";

    axios({
      method: 'get',
      url: apiRoot + '/photos/random?client_id=' + accessKey + '&count=' + count,
      responseType: 'json'
       })
      .then (res => {
        setImages([...images, ...res.data])
        setIsLoaded(true)
      })
  }

  const Image = (props) => (
    <div className="image-item" key={props.keyid}>
      <img src={props.url} key={props.keyid}/>
    </div>
  )

	return (
			<InfiniteScroll
  			dataLength={images} //This is important field to render the next data
  			next={() => fetchImages(5)}
  			hasMore={true}
  			loader={<h4>Loading...</h4>}
  			endMessage={
    			<p style={{textAlign: 'center'}}>
      			<b>Yay! You have seen it all</b>
    			</p>
  			}

        >
  			<div className="image-grid">
  				{loaded ? 
  					images.map((image, index) => (
  							<Image url={image.urls.regular} key={index} keyid={index}/>
  							)): "" }
				</div>
			</InfiniteScroll>
	)
}


export default Gallery


        // below props only if you need pull down functionality
        /*refreshFunction={this.refresh}
        pullDownToRefresh
        pullDownToRefreshContent={
          <h3 style={{textAlign: 'center'}}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{textAlign: 'center'}}>&#8593; Release to refresh</h3>
        }>*/

        /*      <InfiniteScroll
        dataLength={images} //This is important field to render the next data
        next={() => fetchImages(5)}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{textAlign: 'center'}}>
            <b>Yay! You have seen it all</b>
          </p>
        } >
        <div className="image-grid">
          {loaded ? :
            images.map((image, index) => (
                <Image url={image} key={index} keyid={index}/>
                )): ""}
          }
        </div>
      </InfiniteScroll>*/