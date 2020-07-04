import React from 'react';
import cx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import TextInfoContent from '@mui-treasury/components/content/textInfo';
import { useFourThreeCardMediaStyles } from '@mui-treasury/styles/cardMedia/fourThree';
import { useN04TextInfoContentStyles } from '@mui-treasury/styles/textInfoContent/n04';
import { useOverShadowStyles } from '@mui-treasury/styles/shadow/over';
import SwipeableStepper from './swipeablestepper'
import { useRef } from 'react'
//css


//props will be a routeInfo object
/*

  Hokay, so I want to convert this function component to a class component so I can use a ref. 
  Unfortunately, useStyles doesn't work for function components, so I guess I will just move these into my stylesheet?
  what is the cx function? its just an array of multiple classNames to apply. ok.

*/
class RouteCard extends React.Component {

  constructor(props) {
    super(props)
    this.cardRef = React.createRef()
    this.state = {bodyHeight: 100}
    // const mediaStyles = useFourThreeCardMediaStyles();
    // const textCardContentStyles = useN04TextInfoContentStyles(); //wonder  if all of these will give me trouble now.
    // const shadowStyles = useOverShadowStyles({ inactive: true });
  }
  componentDidMount() {
    this.setState({ bodyHeight: this.cardRef.current.offsetHeight }); //want to pass this number over to the text document.
  }
  
  render() {
    return (

      <Card ref={this.cardRef} className='card-root'>
        <SwipeableStepper 
          links={this.props.images} 
          authors={this.props.authors}
          bodyHeight={this.state.bodyHeight}
        />
        <CardContent>
          <TextInfoContent
            classes={this.textCardContentStyles}
            overline={this.props.locs.join(' > ')}
            heading={<a className='card-heading' href={this.props.mplink}>{this.props.name}</a>}
            body={this.props.grade + ', ' + this.props.rstyle}
          />
        {/*TODO add props.fa to this routecard and also move the photo credit*/}
        </CardContent>
      </Card>
    );
  }

};
/*
  switch card for paper. no vertical padding/margin on stepper so white background only
  small horizontal margin
  keep name of route, grade, and 

  SOMETIMES FREAKING LOCATIONS DON"T LOAD WHAT

*/
export default RouteCard;