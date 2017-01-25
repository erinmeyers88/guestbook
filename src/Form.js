import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import EXIF from 'exif-js';
import * as _ from 'underscore';


class Form extends Component {

    constructor(props, context) {
        super(props, context);
        this.setImage = this.setImage.bind(this);
    }

    componentWillMount() {
        this.setState({
            guestList: [],
            message: '',
            name: '',
            time: '',
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
                        key: newPerson.key,
                    });
                });
                this.setState({guestList: tempList}, function () {
                    tempList = [];
                    // this.getImages(this.state.guestList);
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
        this.props.addGuest(this.state.name, this.state.message, this.state.image);
        this.setState({
            message: '',
            name: '',
            time: '',
            image: null,
            imagePreviewUrl: null,
        });
    }


    // remove(key, name) {
    //     this.props.guests.child(key).remove();
    //     this.props.images.child(name).delete().then(function () {
    //         console.log('file deleted');
    //     })
    // }

    render() {
        return (
            <div className="pure-g" style={{padding: 20}}>
                <div className="pure-u-1">
                    <div className="pure-u-1 pure-u-sm-1 pure-u-md-1-2 pure-u-lg-1-2 pure-u-xl-1-2"
                         style={{marginBottom: 30, boxSizing: 'border-box', height: 280}}>
                        <div className="pure-u-1">
                            <div className="pure-u-1" style={{marginBottom: 20}}>
                                <TextField name="name" floatingLabelText="Name"
                                           onChange={this.setName.bind(this)} value={this.state.name}/>
                            </div>
                            <div className="pure-u-1" style={{marginBottom: 20}}>
                                <TextField multiLine rows={5} name="message" floatingLabelText="Message"
                                           onChange={this.setMessage.bind(this)} value={this.state.message}/>
                            </div>
                        </div>

                    </div>

                    <div className="pure-u-1 pure-u-sm-1 pure-u-md-1-2 pure-u-lg-1-2 pure-u-xl-1-2"
                         style={{boxSizing: 'border-box', height: 280}}>
                        <div className="pure-u-1" style={{marginBottom: 28, marginTop: 15}}>
                            <RaisedButton containerElement="label" label="Add Image">
                                <input style={{display: 'none', imageOrientation: 'from-image'}}
                                       onChange={(e)=>this.setImage(e)} type="file"
                                       id="image"
                                       name="image" accept="image/*" capture="camera"/>
                            </RaisedButton>

                        </div>
                        <div className="pure-u-1"
                             style={{
                                 border: '1px solid',
                                 boxSizing: 'border-box',
                                 height: 200,
                                 width: 200
                             }}>
                            <img src={this.state.imagePreviewUrl} style={{maxHeight: '100%'}} role="presentation"/>
                        </div>

                    </div>

                    <div className="pure-u-1-3">
                        <div style={{padding: 20, display: 'flex', justifyContent: 'center'}}>
                            <RaisedButton label="Add" style={{width: '70%'}}
                                          onTouchTap={this.handleAddGuest.bind(this)}/>
                        </div>

                    </div>

                </div>

                <Divider className="pure-u-1" style={{marginTop: 10, marginBottom: 10}}/>
                {
                    this.state.tags && this.state.tags.map(function (item) {
                        return <div>{item.key + ' - ' + item.value}</div>
                    })
                }

            </div>
        );
    }
}

export default Form;
