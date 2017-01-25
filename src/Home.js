import React, {Component} from 'react';
import List from './List';
import Form from './Form';
import Divider from 'material-ui/Divider';
import IdbApi from './idb';

class Home extends Component {

    componentWillMount() {
        this.setState({
            guestList: [],
            message: '',
            name: '',
            imageUploading: false
        });
    }


    componentDidMount() {

        let self = this;
        let tempList = [];

        if (this.props.connectedStatus) {
            console.log(' connected');
            this.props.guests.on('value', snap => {
                this.setState({guestList: []}, function () {
                    snap.forEach(function (newPerson) {
                        let person = {
                            message: newPerson.val().message,
                            name: newPerson.val().name,
                            image: newPerson.val().image,
                            time: newPerson.val().time,
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
            console.log('disconnected');
            IdbApi.getGuests().then(function (guests) {
                console.log('getting guests: ', guests);
                self.setState({guestList: guests.reverse()});
            });
        }
    }

    addGuest(name, message, image) {

        let self = this;
            let upload = this.props.images.child(name).put(image);
            upload.on('state_changed', function (snap) {
            }, function (error) {
            }, function () {
                let newGuest = {
                    message: message,
                    name: name,
                    image: upload.snapshot.downloadURL,
                    time: new Date().toISOString()
                };

                if (self.props.connectedStatus) {
                    self.props.guests.push(newGuest);
                } else {
                    IdbApi.saveGuest(newGuest);
                }

            });
    }

    deleteGuest(key, name) {
        if (this.props.connectedStatus) {
            this.props.guests.child(key).remove();
            this.props.images.child(name).delete().then(function () {
                console.log('file deleted');
            });
        }
        IdbApi.deleteGuest(key);
    }

    render() {
        return (
            <div>
                <div>Guestbook</div>
                <Form guests={this.props.guests} images={this.props.images} addGuest={this.addGuest.bind(this)}/>
                <Divider/>
                <List list={this.state.guestList} guests={this.props.guests} images={this.props.images} deleteGuest={this.deleteGuest.bind(this)}/>
            </div>

        );
    }
}

export default Home;