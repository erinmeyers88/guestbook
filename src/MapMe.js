import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import EXIF from 'exif-js';
import * as _ from 'underscore';


class MapMe extends Component {

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

    render() {
        return (
            <div className="pure-g" style={{padding: 20}}>
                <div className="pure-u-1">

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
                    </div>

                </div>

            </div>
        );
    }
}

export default MapMe;
