import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
//import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { red } from '@material-ui/core/colors'
import FavoriteIcon from '@material-ui/icons/Favorite'
import Tooltip from '@material-ui/core/Tooltip'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
//import DirectionsRunIcon from '@material-ui/icons/DirectionsRun'
import Button from '@material-ui/core/Button'
import Fade from '@material-ui/core/Fade';
import GpsFixedRoundedIcon from '@material-ui/icons/GpsFixedRounded'
import EmojiObjectsOutlinedIcon from '@material-ui/icons/EmojiObjectsOutlined';

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}))

const GuardCard = (props) => {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)
  const [ability, setAbility] = React.useState('none')
  const [abilityClicked, setAbilityClicked] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  const abilityClickHandler = () => {
    setAbilityClicked(!abilityClicked)
    if (ability === 'none') setAbility('')
    else setAbility('none')
  }
  //const unitName = 'King'

  return (
    <Card className={classes.root}>
      <CardHeader
        title={props.name}
      />
      <CardMedia
        className={classes.media}
        image={require(`../../../assets/images/medium/${props.name}.png`)}        
        title={props.name}
      />
      <CardContent>
        <Button
          variant="outlined"
          color="primary"
          onClick={abilityClickHandler}
          className={classes.button}
          startIcon={<GpsFixedRoundedIcon />}
        >
          Ability
        </Button>
        {/* <Typography variant="body2" color="primary" component="p">  
          <Tooltip title="Ability" aria-label="Ability">
              <GpsFixedRoundedIcon />
          </Tooltip>
        </Typography> */}
        <Fade in={abilityClicked}>
          <Typography style={{display:ability,marginTop:'10px'}} variant="subtitle1" color="textSecondary">  
            {props.description}
          </Typography>
        </Fade>
      </CardContent>
      <CardActions disableSpacing={false}>
        <Tooltip title="HP" aria-label="HP">
          <IconButton aria-label="add to favorites">
            <FavoriteIcon color="secondary"/>
          </IconButton>
        </Tooltip>
        {props.hp}
        <Tooltip title="Damage" aria-label="Damage">
          <img alt="" src={require(`../../../assets/images/icon/attack.png`)}></img>
        </Tooltip>
        {props.dmg}
        <Tooltip title="Range" aria-label="Range">
          <img alt="" src={require(`../../../assets/images/icon/range.png`)}></img>
        </Tooltip>
        {props.range}
        <Tooltip title="Step" aria-label="Step">
          <img alt="" src={require(`../../../assets/images/icon/step.png`)}></img>
        </Tooltip>
        {props.step}
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography color='secondary' paragraph>
            <Tooltip title="Tips" aria-label="Tips">
              <EmojiObjectsOutlinedIcon color='secondary' />
            </Tooltip>
          </Typography>
          <Typography paragraph>
            {props.tips}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default GuardCard