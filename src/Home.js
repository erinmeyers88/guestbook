import React, {Component} from 'react';
import List from './List';
import Location from './Location';
import IdbApi from './idb';

import muiThemeable from 'material-ui/styles/muiThemeable';
class Home extends Component {

    componentWillMount() {
        this.setState({
            guestList: [],
            message: '',
            name: '',
            imageUploading: false,
            drawer: false
        });
    }

    componentDidMount() {

        let self = this;
        let tempList = [];

        if (this.props.firebaseConnected) {
            this.props.guests.on('value', snap => {
                this.setState({guestList: []}, function () {
                    snap.forEach(function (newPerson) {
                        let person = {
                            message: newPerson.val().message,
                            name: newPerson.val().name,
                            image: newPerson.val().image,
                            time: newPerson.val().time,
                            lat: newPerson.val().lat,
                            lng: newPerson.val().lng,
                            key: newPerson.key,
                        };
                        tempList.push(person);
                    });
                    this.setState({guestList: tempList.reverse()}, function () {
                        // save latest 3 adds to idb
                        IdbApi.saveGuests(this.state.guestList);
                        tempList = [];
                    });

                });

            });
        }
        else {
            IdbApi.getGuests().then(function (guests) {
                self.setState({guestList: guests.reverse()});
            });
        }
    }

    deleteGuest(key, name) {
        if (this.props.firebaseConnected) {
            this.props.guests.child(key).remove();
            this.props.images.child(name).delete().then(function () {
                console.log('file deleted');
            });
        }
        IdbApi.deleteGuest(key);
    }

    setMap(map) {
        this.setState({
            map: map
        });
    }

    zoomMap(item) {
        this.state.map.panTo({lat: item.lat, lng: item.lng});
    }


    render() {
        return (
                <div className="pure-g">
                    <Location list={this.state.guestList} setMapOnParent={this.setMap.bind(this)}/>
                    <List list={this.state.guestList} images={this.props.images}
                          deleteGuest={this.deleteGuest.bind(this)}
                          zoomMap={this.zoomMap.bind(this)}/>
                </div>
        );
    }
}

export default muiThemeable()(Home);