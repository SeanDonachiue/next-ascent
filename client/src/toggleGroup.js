import React from "react"
import ImportExportIcon from '@material-ui/icons/ImportExport'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import {useState} from "react"
//maybe don't need Grid
import Grid from '@material-ui/core/Grid'

//Grid + translate up css for positioning.

class ToggleGroup extends React.Component {

	constructor(props) {
		super(props)
		this.state = {sort: true, categories: ["Trad", "Sport", "Boulder"]}

		this.setSort.bind(this)
		this.setCategories.bind(this)

		this.handleSort.bind(this)
		this.handleCat.bind(this)
	}

	setSort(newSort) {
		this.setState({sort: newSort})
	}

	setCategories(newCategories) {
		this.setState({categories: newCategories})
	}

	handleSort (e, newSort) {
		this.setSort(!this.state.sort)
	}

	handleCat(e, newCats) {
		this.setCategories(newCats)
	}

	//when we call "handleCat need to do a string comparison to add/remove the toggle"
	//or we can add it i
	render() {
	return (
		<div id="toggleGroup">
			<ToggleButton value="Order" selected={this.state.sort} onChange={this.handleSort.bind(this)} aria-label="sort">
				<ImportExportIcon style={{color: "white"}} />
			</ToggleButton>
			<ToggleButtonGroup
				value={this.state.categories}
				onChange={this.handleCat.bind(this)}
			>
			<ToggleButton value="Trad" aria-label="Trad">
				{/*need icons fuk*/}
				<Typography>Trad</Typography>
			</ToggleButton>
			<ToggleButton value="Sport" aria-label="Sport">
				{/*need icons fuk*/}
				<Typography>Sport</Typography>
			</ToggleButton>
			<ToggleButton value="Boulder" aria-label="Boulder">
				{/*need icons fuk*/}
				<Typography>Boulder</Typography>
			</ToggleButton>
			</ToggleButtonGroup>
		</div>
	)
	}
}

export default ToggleGroup