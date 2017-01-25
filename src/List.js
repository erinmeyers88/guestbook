import React, {Component} from 'react';
import {Card, CardActions, CardText, CardMedia, CardTitle} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Masonry from 'react-masonry-component';

class List extends Component {
    //
    // remove(key, name) {
    //     this.props.guests.child(key).remove();
    //     this.props.images.child(name).delete().then(function () {
    //         console.log('file deleted');
    //     })
    //
    //     this.props.deleteGuest(key, name);
    // }

    handleDeleteGuest(key, name) {
        this.props.deleteGuest(key, name);
    }

    render() {
        let self = this;
        return (
            <div className="pure-g" style={{padding: 20, backgroundColor: 'red', minHeight: 'calc(100vh - 487px)'}}>
                    <Masonry elementType="div" options={{transitionDuration: '.5s'}}>
                        {this.props.list.map(function (item, key) {
                            return (
                                <div key={key} style={{padding: 10, boxSizing: 'border-box'}}
                                     className="pure-u-1 pure-u-sm-1 pure-u-md-1-2 pure-u-lg-1-2 pure-u-xl-1-3">
                                    <Card key={key} style={{margin: 20}}>
                                        <CardMedia
                                            overlay={<CardTitle title={item.name}/>}
                                        >
                                            <img src={item.image} role="presentation"/>
                                        </CardMedia>
                                        <CardText>
                                            {item.message}
                                        </CardText>
                                        <CardActions>
                                            <FlatButton label="Delete"
                                                        onTouchTap={self.handleDeleteGuest.bind(self, item.key, item.name)}/>
                                        </CardActions>
                                    </Card>
                                </div>
                            )
                        })}
                    </Masonry>
            </div>
        );
    }
}

export default List;
