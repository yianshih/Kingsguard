import React from 'react'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Button from '@material-ui/core/Button'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import HomeIcon from '@material-ui/icons/Home'
import TocIcon from '@material-ui/icons/Toc';
import PeopleIcon from '@material-ui/icons/People'
import { Grid } from '@material-ui/core'
import Link from '@material-ui/core/Link'
import { logout } from '../../../helpers/auth' 
import { useHistory } from 'react-router-dom'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const PersistentDrawerLeft = (props) => {
    
    const classes = useStyles()
    const theme = useTheme()
    const history = useHistory()

    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    }

    const handleDrawerClose = () => {
        setOpen(false);
    }

    const logoutHandler = () => {
        history.push("/")
        logout()
    }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={
          clsx(classes.appBar, {[classes.appBarShift]: open,})
        }
      >
        <Toolbar>
            <Grid container justify="space-between" alignItems="center">
                <Grid item>
                    <Grid container justify="center" alignItems="center">
                        <Grid item>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                className={clsx(classes.menuButton, open && classes.hide)}
                                ><MenuIcon />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">
                                Kingsguard
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={logoutHandler}>
                        Logout
                    </Button>
                </Grid>
            </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
            <Link underline='none' href="/">
                <ListItem button>
                    <ListItemIcon><HomeIcon color={props.currentPage === 'home' ? 'primary' :'disabled'}/></ListItemIcon>
                    {/* <ListItemText primary="Home"/> */}
                    <ListItemText primary={<Typography style={{color: props.currentPage === 'home' ? '' :'#868686'}} color={props.currentPage === 'home' ? 'primary' :'textPrimary'}>Home</Typography>}/>
                </ListItem>
            </Link>
            <Link underline='none' href="/instruction">
                <ListItem button >
                    <ListItemIcon><TocIcon color={props.currentPage === 'instruction' ? 'primary' :'disabled'} /></ListItemIcon>
                    <ListItemText primary={<Typography style={{color: props.currentPage === 'instruction' ? '' :'#868686'}} color={props.currentPage === 'instruction' ? 'primary' :'textPrimary'}>Instruction</Typography>}/>
                </ListItem>
            </Link>
            <Link underline='none' href="/guardsInfo">
                <ListItem button>
                    <ListItemIcon><PeopleIcon color={props.currentPage === 'guardsInfo' ? 'primary' :'disabled'} /></ListItemIcon>
                    <ListItemText primary={<Typography style={{color: props.currentPage === 'guardsInfo' ? '' :'#868686'}} color={props.currentPage === 'guardsInfo' ? 'primary' :'textPrimary'}>Guards Info</Typography>}/>
                </ListItem>
            </Link>
          {/* {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))} */}
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
      </main>
    </div>
  );
}

export default PersistentDrawerLeft
