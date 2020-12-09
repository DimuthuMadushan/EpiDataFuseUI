import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import firebase from "../../firebase/firebase";



const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexdirection: 'column',
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
    marginRight: theme.spacing(0.01),
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
  toolbar: {
    minHeight: 10,
  },
  menu: {
    minHeight: 30
  },
  topic: {
    fontSize: 12,
    fontFamily: 'Courier New',
    fontWeight: 'bolder'
  },
  menuBarOption: {
    fontSize: 10,
    marginTop: 10,
    fontFamily: 'Courier New',
    color: 'grey',
    fontWeight: 'bolder'
  }

}));

export default function Home() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState(null);

  const getUserName = () => {
    var uid = firebase.auth().currentUser.uid;
    let name;
    firebase.database().ref('users/' + uid).on("value", snapshot => {
      name = snapshot.val().userName
      setUserName(name)
      console.log(name)
    });
  }

  return (
    <div
      className={clsx(classes.content, {
        [classes.contentShift]: open,
      })}
      style={{ "width": "100%", padding: 5, marginLeft: 30, marginTop: 70 }}
    >

    </div>
  )
}
