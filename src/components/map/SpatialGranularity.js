import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet'
import '../../App.css'
import shp from 'shpjs'
import { polygon } from 'leaflet';

class SpatialGranularity extends React.Component {

    constructor() {
        super();
        this.state = {
            features: [],
            geomType: []
        }
    }

    TextFile = (data) => {
        const element = document.createElement("a");
        const file = new Blob(data, { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "myFile.txt";
        document.body.appendChild(element);
        element.click();
    }

    retriveData = (shapefile) => {
        console.log("Heree comp")
        shapefile.arrayBuffer().then(buffer => {
            shp(buffer).then(function (data, err) {
                if (data) {
                    console.log(data)
                    return data
                } else {
                    console.log(err)
                }

            }).then(features => {
                this.setState(prevState => ({ features: features['features'] }))
            })
        })
    }

    componentDidMount() {
        var shapefile = this.props.shapefile
        this.retriveData(shapefile)
    }

    render() {
        let featureCollection = this.state.features.length > 0 ? this.state.features.map((feature, idx) => {

            let positions = []
            if (feature['geometry']['type'] == "Polygon") {
                feature['geometry']['coordinates'][0].forEach(record => {
                    let temp = []
                    temp.push(record[1])
                    temp.push(record[0])
                    positions.push(temp)
                })
            } else if (feature['geometry']['type'] == "MultiPolygon") {
                positions = feature['geometry']['coordinates'].map((polygon) => {
                    if (polygon.length == 1) {
                        let coords = polygon[0].map(record => {
                            let temp = []
                            temp.push(record[1])
                            temp.push(record[0])
                            return temp
                        })
                        return coords
                    } else {
                        let coords = polygon.map(subpoly => {
                            let coords = subpoly.map(record => {
                                let temp = []
                                temp.push(record[1])
                                temp.push(record[0])
                                return temp
                            })
                            return coords
                        })
                        return coords
                    }

                })
            }

            return (
                feature['geometry']['type'] === "Point" ? <Marker
                    key={idx}
                    position={
                        [
                            feature['geometry']['coordinates'][1],
                            feature['geometry']['coordinates'][0]
                        ]}
                >
                    <Popup>
                        <ul style={{
                            "listStyleType": "none",
                            "padding": 0
                        }}>
                            {Object.keys(feature['properties']).map(function (key, index) {
                                return (
                                    <li>{key + ": " + feature['properties'][key]}</li>
                                )
                            })}
                        </ul>
                    </Popup>
                </Marker> :
                    <Polygon
                        color="red"
                        positions={positions}
                    >
                        <Popup>
                            <ul style={{
                                "listStyleType": "none",
                                "padding": 0
                            }}>
                                {Object.keys(feature['properties']).map(function (key, index) {
                                    return (
                                        <li>{key + ": " + feature['properties'][key]}</li>
                                    )
                                })}
                            </ul>
                        </Popup>
                    </Polygon>
            )
        }) : ""

        return (
            <MapContainer center={[7.8731, 80.7718]} zoom={1} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {featureCollection}
            </MapContainer>
        )
    }
}

export default SpatialGranularity;