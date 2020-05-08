import React from 'react'
import ScrapeRoutesByArea from "./ScrapeRoutesByArea"
import ImportExportIcon from '@material-ui/icons/ImportExport'
import CheckIcon from '@material-ui/icons/Check'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import {useState} from "react"
/*
	 

    filter sport/trad/boulder using images on a toolbar.
    onclick for a few components inside the toggleGroup
	
		Timeout on requests without results can be faster


*/


class Scraper extends React.Component {



	constructor(props) {
		super(props)
		this.state = {str:"", flag: false, sort: 1, categories: ""}

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
		
		//doesn't re render the fucking component when I update this.
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
		this.setSort(!this.state.sort)
	}

	handleCat(e, newCats) {
		this.setCategories(newCats)
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
      	  	<div id="tg-wrapper" style={{margin: "0.6rem", position: "fixed", top: 4, right: "6rem", zIndex: "2"}}>
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
      	</form>
				{this.state.flag ? <ScrapeRoutesByArea searchStr={this.state.str} sort={this.state.sort} categories={this.state.categories}  /> : ""}
			</div>
		)
	}
}

//


export default Scraper

/*

	Need to put the information back inside the image map function.


*/