import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import Main from './Main';
import Home from './Home';
import * as firebase from 'firebase';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();


const config = {
    apiKey: "AIzaSyBZMyUStWE4bTgWGCueL8H1cAJ36c_-N5g",
    authDomain: "guestbook-be612.firebaseapp.com",
    databaseURL: "https://guestbook-be612.firebaseio.com",
    storageBucket: "guestbook-be612.appspot.com",
    messagingSenderId: "385301875545"
};

firebase.initializeApp(config);

const storage = firebase.storage();

const images = storage.ref().child('images');

const guests = firebase.database().ref().child('guests');

const connectedStatus = firebase.database().ref('.info/connected');

class App extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            connectedStatus: true
        }
    }

    componentDidMount() {
        let self = this;
        connectedStatus.on("value", function(snap) {
            if (snap.val() === true) {
                self.setState({connectedStatus: true});
            } else {
                self.setState({connectedStatus: false});
            }
        });
    }

    render() {
        return (
            <div style={{width: '100%'}}>
                <MuiThemeProvider>
                    <Home connectedStatus={this.state.connectedStatus} guests={guests} images={images}/>
                </MuiThemeProvider>
            </div>

        );
    }
}

export default App;