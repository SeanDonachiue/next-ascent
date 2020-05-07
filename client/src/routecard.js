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
//css
const useStyles = makeStyles(() => ({
  root: {
    maxWidth: '100%',
    margin: '0.4rem',
    borderRadius: 12,
    padding: 6,
  },
  heading: {
    color: 'cyan',
    textDecoration: 'none',
    textAlign: 'center',
    fontSize: 32,
    lineHeight: 2,
    fontWeight: 300,
    fontFamily:
    // eslint-disable-next-line max-len
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    marginBottom: '0.72em',
  }, 
  // media: {
  //   borderRadius: 6,
  //   minWidth: 368,
  //   maxHeight: 480,
  // },
}));

//props will be a routeInfo object
/*
  image = props.images
*/
const RouteCard = (props) => {
  const styles = useStyles();
  const mediaStyles = useFourThreeCardMediaStyles();
  const textCardContentStyles = useN04TextInfoContentStyles();
  const shadowStyles = useOverShadowStyles({ inactive: true });
  return (
    <Card className={cx(styles.root, shadowStyles.root)}>
      
      <SwipeableStepper 
        links={props.images} 
        authors={props.authors}
      />
      <CardContent className={styles.content}>
        {/*<CardMedia
        className={cx(styles.media, mediaStyles.root)}
        component= 
      />*/}
        <TextInfoContent
          classes={textCardContentStyles}
          overline={props.locs.join(' > ')}
          heading={<a className={styles.heading} href={props.mplink}>{props.name}</a>}
          body={props.grade + ', ' + props.rstyle}
        />
      </CardContent>
    </Card>
  );
};

export default RouteCard;