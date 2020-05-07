import React from 'react';
import './App.scss';
import Scraper from './scrapeImages.js'
function App() {

	//make the searchstring global state that you update out here I guess idk.
	//pass the function modifying this into inputbar as props

	//data is passed down from parent to child, so you make scrapeImages the child here.
	//Or you just put it inside of the search class.

//how to enter a new search in and redo the scrapeRoutes call?
  return (
    <div className="App">
      <header className="App-header">
     	<Scraper/>
      </header>
    </div>
  );
}

export default App;
