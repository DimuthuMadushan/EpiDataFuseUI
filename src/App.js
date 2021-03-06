import React, { useState } from 'react';
import './App.css';
import './w3.css';
import './Mt.css';
import Home from './components/home/home';
import SignIn from './components/auth/signin'
import SignUp from './components/auth/signup'
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { AuthProvider } from './components/auth/authentication';
import AllPagePDFViewer from './components/docs/docs';
import Markdown from './components/docs/markdown';
import Pipeline from './components/pipeline/pipeline';
import PipelineMenu from './components/pipelines/pipelines';
import MenuBar from './components/menubar/menubar'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import Outputdataframe from './components/outputdataframe/outputdataframe';

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
    marginLeft: 0,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
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


function App() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleDrawerClose = () => {
    console.log("Here")
    setOpen(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  return (

    <BrowserRouter>
      <AuthProvider>
        <MenuBar handleDrawerClose={handleDrawerClose} handleDrawerOpen={handleDrawerOpen} />
        <div
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
          style={{ "width": "100%", padding: 5, marginTop: 70 }}
        >
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/pipelines" component={PipelineMenu} />
            <Route exact path="/pipeline" component={Pipeline} />
            <Route exact path="/docs" component={AllPagePDFViewer} />
            <Route exact path="/getdataframes" component={Outputdataframe} />
          </Switch>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
