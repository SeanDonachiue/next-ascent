import React from 'react'
import ScrapeRoutesByArea from "./ScrapeRoutesByArea"
import ToggleGroup from "./toggleGroup"
/*
	 

    filter sport/trad/boulder using images on a toolbar.
    onclick for a few components inside the toggleGroup
	
		Timeout on requests without results can be faster


*/


class Scraper extends React.Component {



	constructor(props) {
		super(props)
		this.state = {str:"", flag: false, sort: 1, categories: ""}

		this.toggleRef = React.createRef()
		//ugly / bad style. React is ridiculous in this way, or I am.
		this.setFlag.bind(this)
		this.setStr.bind(this)
		this.handleChange.bind(this)
		this.handleSubmit.bind(this)
		this.handleClick.bind(this)
		this.render.bind(this)
		this.setState.bind(this)
		this.setFlag.bind(this.delay)
		this.sleep.bind(this)
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
		const refSort = this.toggleRef.current.state.sort
		const refCat = this.toggleRef.current.state.categories
		this.setState({sort: refSort, categories: refCat}, () => {this.setFlag(true)})
		
		//doesn't re render the fucking component when I update this.
	}

 //you click but state hasn't changed yet. 
	handleClick(e) {
		e.preventDefault()
		this.setFlag(false)
		this.sleep(100)
		console.log("clicked!") //it doesn't update because the click event needs to be deeper somehow. This function executes too early, basically.
		//set a flag in the togglegroup component when something is clicked? how do you do an alert pattern?
		/*
			set a flag when something is clicked, and you check it up here when?
			doesn't seem like it will work, its literally the same mechanism and issue.

			OK the other option is to just put that code in here and change the local state instead of checking state down in the tree.
		*/
		const refSort = this.toggleRef.current.state.sort
		const refCat = this.toggleRef.current.state.categories
		console.log(refCat)
		this.setState({sort: refSort, categories: refCat}, () => {this.setFlag(true)})
		
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
      	  <div id="tg-wrapper" onClick={this.handleClick.bind(this)} >
      	  	<ToggleGroup id="toggleGroup" ref={this.toggleRef} />
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