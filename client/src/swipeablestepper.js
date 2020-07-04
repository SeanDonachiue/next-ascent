import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import uuid from 'react-uuid'

//TODOS FOR TODAY:
  /*



    styling:
    search bar starts in middle of page, then animates/translates upward when you search.
    sticky search bar so you can make a new search any time.
    move photo credit onto the photo. Full darkmode (light grey dark grey.)

    bulk scrape

    hosting

  */
  //make it the size of the smallest one I guess.

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
    maxHeight: '100%',
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 30,
    paddingLeft: theme.spacing(1),
    backgroundColor: 'none',
  },
  img: {
    maxHeight: window.innerHeight - window.innerHeight*0.02, 
    display: 'block',
    overflow: 'hidden',
    height: 'auto',
    width: '100%',
    objectFit: 'cover',
    objectPosition:'50% 50%'
  },
}));

function SwipeableStepper(props) {
  const Steps = []
  for(let i = 0; i < props.links.length; i++) {
    Steps.push({label: props.authors[i], imgPath: props.links[i]})
  }
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = Steps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <div className={classes.root}>
      <Paper square elevation={0} className={classes.header}>
        <Typography>{Steps[activeStep].label}</Typography> {/*Steps[activeStep].label is undefined*/}
      </Paper>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
        {Steps.map((step, index) => (
          <div style={{display: 'flex', alignItems: 'center',}} key={step.label}>
            {Math.abs(activeStep - index) <= 2 ? (
             <img className={classes.img} src={step.imgPath} alt={step.label} />
            ) : null}
          </div>
        ))}
      </SwipeableViews>
      <MobileStepper
        steps={maxSteps}
        style={{background: 'none', textColor: 'white', marginTop: -props.bodyHeight / 2 + 100 + 'px', paddingBottom: props.bodyHeight / 2 - 100 + 'px'}}
        position="static"
        variant="text"
        activeStep={activeStep}
        nextButton={
          <Button size="large" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
            {theme.direction === 'rtl' ? <KeyboardArrowLeft fontSize="large"/> : <KeyboardArrowRight fontSize="large"/>}
          </Button>
        }
        backButton={
          <Button size="large" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? <KeyboardArrowRight fontSize="large"/> : <KeyboardArrowLeft fontSize="large"/>}
          </Button>
        }
      />
    </div>
  );
}

export default SwipeableStepper;