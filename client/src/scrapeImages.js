import React from 'react'
import ScrapeRoutesByArea from "./ScrapeRoutesByArea"
import ImportExportIcon from '@material-ui/icons/ImportExport'
import CheckIcon from '@material-ui/icons/Check'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import SettingsIcon from '@material-ui/icons/Settings';
import {useState} from "react"
/*
	 

    filter sport/trad/boulder using images on a toolbar.
    onclick for a few components inside the toggleGroup

		Timeout on requests without results can be faster

	if you conditionally render, it will not play the animation.
	if you don't conditionally render, the transparent buttons can still be clicked.
	so you need to set the display property to none default then display block onclick.

*/
const styles = {
	transition: 'all 0.6s ease-out',
	position: 'fixed',
	top: 10,
	zIndex: 2,
	maxWidth: '325px',
}

/*margin: "0.6rem", position: "fixed", top: 4, right: "2.5rem", zIndex: "2"*/
const offsetX = window.innerWidth - 400
//the offset is larger the smaller the windowheight is.
//not really sure how it makes sense since it should be absolute and not proportional
//

class Scraper extends React.Component {



	constructor(props) {
		super(props)
		this.state = {
			str:"", 
			flag: false, 
			gearClass: "gear", 
			sort: 1, 
			categories: ["Trad", "Sport", "Boulder"],
			opacity: 0,
			moveX: offsetX,
			display: 'hidden',

		}

		//ugly / bad style. React is ridiculous in this way, or I am.
		this.setFlag.bind(this)
		this.setStr.bind(this)
		this.handleChange.bind(this)
		this.handleSubmit.bind(this)
		this.render.bind(this)
		this.setState.bind(this)
		this.setFlag.bind(this.delay)
		this.sleep.bind(this)

		this.setSort.bind(this)
		this.setCategories.bind(this)
		this.handleSort.bind(this)
		this.handleCat.bind(this)
		this.handleClick.bind(this)
	}



 	sleep(milliseconds) {
  	const date = Date.now();
  	let currentDate = null;
  		do {
    		currentDate = Date.now();
  		} while (currentDate - date < milliseconds);
	}

	setFlag(bool) {
		//update state of flag
		this.setState({
			flag: bool
		})
	}
	setStr(input) {
		this.setState({
			str: input
		})
	}

	handleChange(e) {
		this.setStr(e.target.value)
		if(this.state.str == "")
			this.setFlag(false)
	}
	async handleSubmit(e) {
		e.preventDefault()
		this.setFlag(true)
	}


	//need to make the flag false first when you click something.

	setSort(newSort) {
		this.setFlag(false)
		this.setState({sort: newSort}, () => {this.setFlag(true)})
	}

	setCategories(newCategories) {
		this.setFlag(false)
		this.setState({categories: newCategories}, () => {this.setFlag(true)})
	}

	handleSort (e, newSort) {
		if(this.state.display === 'hidden') {
			return
		}
		this.setSort(!this.state.sort)
	}

	handleCat(e, newCats) {
		if(this.state.display === 'hidden') {
			return
		}
		this.setCategories(newCats)
	}
	handleClick(e) {
		e.preventDefault()
		this.setState({
			display: this.state.display === 'hidden' ? 'block' : 'hidden',
			//this doesn't work.
			opacity: this.state.opacity > 0 ? 0 : 1,
			moveX: this.state.moveX > offsetX - 20 ? offsetX - 20 : offsetX,
			gearClass: this.state.gearClass === "gear" ?  "gear " + "gearClicked" : "gear",
		});

		//these offsets need to be a function of window.innerwidth?
		//or html.clientwidth
		//OR Can mess round with making .in a flex div
		//shouldn't take longer than 30 min
		// Need to account for closing it here as well then right?
		// animation doesn't play
		//

		//initiate an animation here by toggling a class, I guess.
		//ok and you also want to conditionally render a div with .gear class?
	}

	render() {
		return (
			<div className="in">
				<form onSubmit={this.handleSubmit.bind(this)}>
      	  <input
      	  	id="search" 
      	  	type="text"
      	  	autoComplete="off" 
      	  	value={this.state.str}
      	  	onChange={this.handleChange.bind(this)}
      	  	placeholder="Enter a climbing area to explore..."
      	  />
      	  </form>
      	  <SettingsIcon className={this.state.gearClass} fontSize="large"onClick={this.handleClick.bind(this)}/>
      	  <div id="tg-wrapper" style={{...styles, opacity: this.state.opacity, transform: 'translateX(' + this.state.moveX + 'px)', display: this.state.display }}>
						<ToggleButton value="Order" selected={this.state.sort} onChange={this.handleSort.bind(this)} aria-label="sort">
							<ImportExportIcon style={{color: "white"}} />
						</ToggleButton>
								<ToggleButtonGroup
								value={this.state.categories}
								onChange={this.handleCat.bind(this)}
							>
							<ToggleButton value="Trad" aria-label="Trad">
								<Typography>Trad</Typography>
							</ToggleButton>
							<ToggleButton value="Sport" aria-label="Sport">
								<Typography>Sport</Typography>
							</ToggleButton>
							<ToggleButton value="Boulder" aria-label="Boulder">
								<Typography>Boulder</Typography>
							</ToggleButton>
							</ToggleButtonGroup>
					</div>
      	
				{this.state.flag ? <ScrapeRoutesByArea searchStr={this.state.str} sort={this.state.sort} categories={this.state.categories}  /> : ""}
			{/*put the above in its own div so we can have a header here*/}
			</div>
		)
	}
}

//


export default Scraper

/*

	Need to put the information back inside the image map function.


*/