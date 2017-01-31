import React, {Component} from 'react';

class Location extends Component {

    constructor(props, context) {
        super(props, context);
        this.createMap = this.createMap.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.list.length !== this.props.list.length) {
            navigator.geolocation.getCurrentPosition(this.setStateLocation.bind(this), this.locationError);
        }
    }

    setStateLocation(location) {
        let self = this;
        this.setState({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            altitude: location.coords.altitude,
            altitudeAccuracy: location.coords.altitudeAccuracy,
            heading: location.coords.heading,
            speed: location.coords.speed,
            timestamp: new Date(location.timestamp).toLocaleString()
        }, function () {
            this.createMap(self.props.list);
        });
    }

    locationError(error) {
    }

    createMap(list) {
        let self = this;
        let location = {lat: this.state.latitude, lng: this.state.longitude};
        let map = new window.google.maps.Map(this.refs.map, {
            zoom: 14,
            center: location
        });
        list.map(function (guest) {
            self.addGuestToMap(guest, map);
            return guest;
        });

        this.props.setMapOnParent(map);
    }

    addGuestToMap(guest, map) {
        let margin = .002;
        let imageBounds = {
            north: guest.lat + margin,
            south: guest.lat - margin,
            east: guest.lng + margin,
            west: guest.lng - margin
        };

       new window.google.maps.GroundOverlay(guest.image, imageBounds).setMap(map);

        // this.marker = new window.google.maps.Marker({
        //    position: {lat: guest.lat, lng: guest.lng},
        //     map: map,
        //     icon: guest.image
        // });

    }


    render() {
        return (
            <div className="pure-u-1-2">
                {/*{this.state.latitude && <div>Latitude: {this.state.latitude}</div>}*/}
                {/*<div>Longitude: {this.state.longitude}</div>*/}
                {/*<div>Accuracy: {this.state.accuracy}</div>*/}
                {/*<div>Altitude: {this.state.altitude}</div>*/}
                {/*<div>Altitude Accuracy: {this.state.altitudeAccuracy}</div>*/}
                {/*<div>Heading: {this.state.heading}</div>*/}
                {/*<div>Speed: {this.state.speed}</div>*/}
                {/*<div>Timestamp: {this.state.timestamp}</div>*/}

                <div ref="map" style={{height: 600, width: '100%'}}></div>

            </div>
        );
    }
}

export default Location;
