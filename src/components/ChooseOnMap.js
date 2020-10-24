import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../App.css';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import { setRTLTextPlugin } from 'react-map-gl';
import { getRhumbLineBearing } from 'geolib';
import Geocoder from 'react-map-gl-geocoder'
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import marker from '../images/marker.png';
import vpool from '../images/VPoolLogo.png';
import {
    Accordion,
    Button,
    Collapse
} from 'react-bootstrap';

// setRTLTextPlugin(
//     // find out the latest version at https://www.npmjs.com/package/@mapbox/mapbox-gl-rtl-text
//     'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
//     null,
//     // lazy: only load when the map first encounters Hebrew or Arabic text
// true
// );


function ChooseOnMap(props) {
    const [viewport, setViewport] = useState({
        latitude: 25.3271054,
        longitude: 51.1966577,
        width: '100vw',
        height: '100vh',
        zoom: 9
    });
    const [location, setLocation] = useState("");
    const [locationInfo, setLocationInfo] = useState("");
    const [currentLatLng, setCurrentLatLng] = useState("");
    const [fromOrTo, setFromOrTo] = useState("");

    const geocoderContainerRef = useRef();
    const mapRef = useRef();
    const handleViewportChange = useCallback(
        (newViewport) => setViewport(newViewport),
        []
    );


    useEffect(() => {

        if (localStorage.getItem("logged") !== "true") {
            props.history.push("/Login");
        } else {
            setFromOrTo(props.history.location.state)
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {


        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let getAddress = (lng, lat) => {
        let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/asia.json?proximity=${lng},${lat}&access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`;
        fetch(url, {
            method: 'GET',
            // headers: {
            //   'Content-Type': 'application/json',
            // },
        }).then((response) => response.json())
            .then((responseJson) => {
                setLocationInfo(responseJson.features[0].place_name);
                console.log(responseJson);
            }).catch((error) => {
                console.log(error);
                alert('Failed to Save.');
            });
    }

    let mapMarker = null;
    if (currentLatLng !== "") {
        mapMarker =
            <Marker longitude={currentLatLng.lng} latitude={currentLatLng.lat}>
                <button className="marker-btn" onClick={(e) => {
                    e.preventDefault();
                    // setSelectedLocation(item);
                }}>
                    <img style={{
                        width: "40px",
                    }}
                        src={marker} alt="Marker" />
                </button>
            </Marker>
    }



    return (
        <div className="">
            <div className="dashboard" style={{ minHeight: "200px" }}>
                <div style={{ marginLeft: "10px", marginRight: "10px" }}>
                    <h3 style={{ marginTop: "10px" }}>Dashboard</h3>
                    <h4 style={{ marginTop: "10px" }}>Location:  <span style={{ color: "grey" }}>{locationInfo}</span></h4>

                    <button style={{ marginTop: "60px", textAlign: "center", marginBottom: "10px" }} className="btn btn-primary"
                        onClick={(e) => {
                            if (currentLatLng === "" && locationInfo === "") {
                                alert("Select Location")
                            } else {
                                props.history.push("/AssignTrip", {
                                    "lngLat": currentLatLng,
                                    "locationInfo": locationInfo,
                                    "fromOrTo": fromOrTo
                                })
                            }
                        }}>SELECT</button>
                </div>

            </div>
            {/* <div ref={geocoderContainerRef} > */}
            <ReactMapGL {...viewport}
                ref={mapRef}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                onViewportChange={nextViewport => setViewport(nextViewport)}
                mapStyle="mapbox://styles/companyapi/ckg3rjrn10b8h19mm033e5srj"
                onClick={(e) => {
                    console.log(e);
                    if (e.target.className !== "mapboxgl-ctrl-geocoder--input") {
                        setCurrentLatLng({ lng: e.lngLat[0], lat: e.lngLat[1] })
                        getAddress(e.lngLat[0], e.lngLat[1])
                    }
                }}>
                {mapMarker}
                {/* {markers}
                {selectedLocation ? (
                    <Popup longitude={selectedLocation.DetailRequest[0].lats}
                        latitude={selectedLocation.DetailRequest[0].longs}
                        onClose={() => {
                            setSelectedLocation(null);
                        }}>
                        <div>
                            <h4 style={{ display: "inline" }}>{selectedLocation.DetailRequest[0].Driver}</h4>
                            <h4 style={{ marginLeft: "4px", display: "inline", fontStyle: "italic" }}>{selectedLocation.VEHICLE_NO}</h4>
                            <div>
                                <p style={{ display: "inline" }}>From: </p><p style={{ display: "inline" }}>{selectedLocation.DetailRequest[0].FromLocation}</p>
                            </div>
                            <div>
                                <p style={{ display: "inline" }}>To: </p><p style={{ display: "inline" }}>{selectedLocation.DetailRequest[0].ToLocation}</p>
                            </div>
                            <div>
                                <p style={{ display: "inline" }}>Distance: </p><p style={{ display: "inline" }}>{`${selectedLocation.DetailRequest[0].KM} KM`}</p>
                            </div>
                            <div>
                                <p style={{ display: "inline" }}>Speed: </p><p style={{ display: "inline" }}>{`${selectedLocation.DetailRequest[0].speed}`}</p>
                            </div>
                        </div>
                    </Popup>) : null} */}

                <Geocoder
                    mapRef={mapRef}
                    containerRef={geocoderContainerRef}
                    onViewportChange={handleViewportChange}

                    onResult={(result) => {
                        setCurrentLatLng({ lng: result.result.center[0], lat: result.result.center[1] })
                        setLocationInfo(result.result.place_name)
                    }}
                    // inputValue={search}
                    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                    // position="top-left"
                    // onResult={(result) => {
                    //     setSearch(result.text)
                    //     console.log("hello", result.text);
                    // }}
                    style={{ position: "absolute", top: 20, left: 20, zIndex: 1 }}
                />
            </ReactMapGL>


            <div className="bottomLogo">
                <img src={vpool} width="50px" className="mb-4" />
                <span style={{
                    fontWeight: "bolder", color: "white", outline: "1px", outlineColor: "grey",
                    textShadow: "0 0 2px grey, 0 0 2px grey, 0 0 2px grey, 0 0 2px grey"
                }}>VPOOL</span>
            </div>
            {/* </div> */}
        </div >
    );
}

export default ChooseOnMap;
