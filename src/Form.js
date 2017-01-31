import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Divider from 'material-ui/Divider';
import AddPhoto from 'material-ui/svg-icons/image/add-a-photo';
import EXIF from 'exif-js';
import * as _ from 'underscore';
import muiThemeable from 'material-ui/styles/muiThemeable';

class Form extends Component {

    constructor(props, context) {
        super(props, context);
        this.setImage = this.setImage.bind(this);
        this.state = {
            location: null,
            guestList: [],
            message: '',
            name: '',
            time: '',
        }
    }

    componentWillMount() {
        let self = this;
        navigator.geolocation.getCurrentPosition(function (location) {
            self.setState({
                location: location,
                guestList: [],
                message: '',
                name: '',
                time: '',
            });
        });
    }

    componentDidMount() {
        let tempList = [];
        this.props.guests.on('value', snap => {
            this.setState({guestList: []}, function () {
                snap.forEach(function (newPerson) {
                    tempList.push({
                        message: newPerson.val().message,
                        name: newPerson.val().name,
                        image: newPerson.val().image,
                        time: newPerson.val().time,
                        location: newPerson.val().location,
                        key: newPerson.key,
                    });
                });
                this.setState({guestList: tempList}, function () {
                    tempList = [];
                });

            });

        });


    }

    setName(e) {
        this.setState({
            name: e.target.value
        });
    }

    setMessage(e) {
        this.setState({
            message: e.target.value
        });
    }

    setImage(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                image: file,
                imagePreviewUrl: reader.result
            });
        };

        let tags = [];

        EXIF.getData(file, function () {
            // console.log('data: ', EXIF.getAllTags(this));
            let stuff = EXIF.getAllTags(this);

            _.mapObject(stuff, function (val, key) {
                tags.push({key: key, value: val});
            })
        });

        this.setState({tags: tags});

        reader.readAsDataURL(file)
    }

    handleAddGuest() {
        this.props.addGuest(this.state.name, this.state.message, this.state.image, this.state.location);
        this.setState({
            message: '',
            name: '',
            time: '',
            image: null,
            imagePreviewUrl: null,
        });
    }

    render() {
        return (
            <div className="pure-g" style={{padding: 20}}>
                <div className="pure-u-1">
                    <div className="pure-u-1 pure-u-sm-1 pure-u-md-1-3 pure-u-lg-1-3 pure-u-xl-1-3"
                         style={{boxSizing: 'border-box', height: '100%'}}>
                        <div style={{
                                 border: '1px dashed',
                                 boxSizing: 'border-box',
                                 backgroundImage: 'url(' + this.state.imagePreviewUrl + ')',
                                 backgroundSize: 'cover',
                            height: '100%'
                             }}>
                            <FloatingActionButton secondary containerElement="label" label="Choose Image">
                                <input style={{display: 'none', imageOrientation: 'from-image'}}
                                       onChange={(e)=>this.setImage(e)} type="file"
                                       id="image"
                                       name="image" accept="image/*" capture="camera"/>
                                <AddPhoto/>
                            </FloatingActionButton>
                        </div>

                    </div>

                    <div className="pure-u-1 pure-u-sm-1 pure-u-md-2-3 pure-u-lg-2-3 pure-u-xl-2-3"
                         style={{boxSizing: 'border-box'}}>
                        <div className="pure-u-1" style={{backgroundColor: this.props.muiTheme.palette.accent1Color}}>
                            <div className="pure-u-1" style={{marginBottom: 20, padding: 30, boxSizing: 'border-box'}}>
                                <TextField fullWidth name="name" floatingLabelText="Name"
                                           onChange={this.setName.bind(this)} value={this.state.name}/>
                            </div>
                            <div className="pure-u-1" style={{marginBottom: 20, padding: 30, boxSizing: 'border-box'}}>
                                <TextField fullWidth multiLine rows={5} name="message" floatingLabelText="Message"
                                           onChange={this.setMessage.bind(this)} value={this.state.message}/>
                            </div>
                        </div>

                    </div>





                </div>

                <div className="pure-u-1">
                    <div style={{padding: 20, display: 'flex', justifyContent: 'center'}}>
                        <RaisedButton label="Add" style={{width: '70%'}} disabled={this.state.name == '' || this.state.message == '' || !this.state.image}
                                      onTouchTap={this.handleAddGuest.bind(this)}/>
                    </div>

                </div>

                {
                    this.state.tags && this.state.tags.map(function (item) {
                        return <div>{item.key + ' - ' + item.value}</div>
                    })
                }

            </div>
        );
    }
}

export default muiThemeable()(Form);
