import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../App.css';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import { setRTLTextPlugin } from 'react-map-gl';
import { getRhumbLineBearing } from 'geolib';
import Geocoder from 'react-map-gl-geocoder'
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import car from '../images/car_red.png';
import plus from '../images/plus.png';
import minus from '../images/minus.png';
import history from "../history";
import vpool from '../images/VPoolLogo.png';
import {
    Accordion,
    Button,
    Collapse
} from 'react-bootstrap';

setRTLTextPlugin(
    // find out the latest version at https://www.npmjs.com/package/@mapbox/mapbox-gl-rtl-text
    'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
    null,
    // lazy: only load when the map first encounters Hebrew or Arabic text
    true
);
const myHistory = history;

function Dashboard() {
    const [viewport, setViewport] = useState({
        latitude: 25.3271054,
        longitude: 51.1966577,
        width: '100vw',
        height: '100vh',
        zoom: 9
    });
    const [locations, setLocations] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [search, setSearch] = useState("");
    const [preassignedLocations, setPreassignedLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [driverToggle, setDriverToggle] = useState(false);

    const geocoderContainerRef = useRef();
    const mapRef = useRef();
    const handleViewportChange = useCallback(
        (newViewport) => setViewport(newViewport),
        []
    );


    let getLocations = () => {
        let url = 'http://192.34.109.55/BlaseExtra/Api/Locations?code=0';
        fetch(url, {
            method: 'GET',
            // headers: {
            //   'Content-Type': 'application/json',
            // },
        }).then((response) => response.json())
            .then((responseJson) => {
                setLocations(responseJson);
                console.log(locations);
            }).catch((error) => {
                alert('Failed to Save.');
            });
    }

    let handleDriverChange = event => {
        event.preventDefault();
        setSelectedDriver(event.target.value);
        let selectedL;
        for (var i = 0; i < locations.length; i++) {
            console.log(locations[i].DetailRequest[0].Driver, selectedDriver)
            if (locations[i].DetailRequest[0].Driver === event.target.value) {
                selectedL = locations[i];
            }
        }
        setViewport({
            latitude: selectedL.DetailRequest[0].longs,
            longitude: selectedL.DetailRequest[0].lats,
            width: '100vw',
            height: '100vh',
            zoom: 10
        })
        console.log(event.target.value);
    }

    let getDrivers = () => {
        let url = 'http://192.34.109.55/BlaseExtra/Api/Drivers?code=0';
        fetch(url, {
            method: 'GET',
            // headers: {
            //   'Content-Type': 'application/json',
            // },
        }).then((response) => response.json())
            .then((responseJson) => {
                setDrivers(responseJson);
                console.log(responseJson);
            }).catch((error) => {
                console.log(error);
                alert('Failed to Save.');
            });
    }

    let getPreassignedLocations = () => {
        let url = 'http://192.34.109.55/BlaseExtra/Api/Locations?code=ALL';
        fetch(url, {
            method: 'GET',
            // headers: {
            //   'Content-Type': 'application/json',
            // },
        }).then((response) => response.json())
            .then((responseJson) => {
                setPreassignedLocations(responseJson);
                console.log(responseJson);
            }).catch((error) => {
                console.log(error);
                alert('Failed to Save.');
            });
    }

    useEffect(() => {

        if (localStorage.getItem("logged") !== "true") {
            myHistory.push("/Login");
            myHistory.go(0);
        } else {
            getLocations();
            getDrivers();

            let intervalM = 30000
            if (localStorage.getItem("timeInterval") !== undefined &&
                localStorage.getItem("timeInterval") !== null) {
                intervalM = parseInt(localStorage.getItem("timeInterval"))
            }
            console.log(intervalM)
            const interval = setInterval(() => {
                getLocations();
                getDrivers();
            }, intervalM);
            return () => clearInterval(interval);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {

        getPreassignedLocations();

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let dToggleClick = (e) => {
        e.preventDefault();
        if (driverToggle) {
            setDriverToggle(false);
        } else {
            setDriverToggle(true);
        }
    }

    let markers = [];
    console.log("marker")
    const contents = locations.forEach((item, key) => {
        console.log(item);
        if (item.DetailRequest.length !== 0) {
            markers.push(
                <Marker key={item.VEHICLE_NO} longitude={item.DetailRequest[0].lats} latitude={item.DetailRequest[0].longs}>
                    <button className="marker-btn" onClick={(e) => {
                        e.preventDefault();
                        setSelectedLocation(item);
                    }}>
                        <img style={{
                            width: "40px", WebkitTransform: `otate(${getRhumbLineBearing(
                                { latitude: item.DetailRequest[1].longs, longitude: item.DetailRequest[1].lats },
                                { latitude: item.DetailRequest[0].longs, longitude: item.DetailRequest[0].lats }
                            )}deg)`,
                            transform: `rotate(${getRhumbLineBearing(
                                { latitude: item.DetailRequest[1].longs, longitude: item.DetailRequest[1].lats },
                                { latitude: item.DetailRequest[0].longs, longitude: item.DetailRequest[0].lats }
                            )}deg)`,
                            marginRight: "40px"
                        }}
                            src={car} alt="Driver" />
                    </button>
                </Marker>
            );
        }
    });
    let options = [];
    let available = 0;
    let inATrip = 0;
    const contents1 = drivers.forEach((item, key) => {
        if (item.status === 1) {
            inATrip += 1;
            options.push(
                <option value={item.Name}>{item.Name}</option>
            );
        }
    });

    let table = [];
    for (let i = 0; i < preassignedLocations.length / 3; i++) {
        let row = [];
        {
            for (let j = 0; j < 4; j++) {

                if (preassignedLocations[j] !== undefined) {

                    row.push(<td className="locationD" onClick={
                        (e) => {
                            setViewport({
                                latitude: preassignedLocations[j].lat,
                                longitude: preassignedLocations[j].long,
                                width: '100vw',
                                height: '100vh',
                                zoom: 9
                            })
                        }
                    }>{preassignedLocations[j].location1}</td>)
                } else {
                    row.push(<td className="locationD" style={{ cursor: "initial", minWidth: "30px" }}></td>)
                }
            }
        }
        table.push(
            <tr>
                {row}
            </tr>
        );
    }

    let logout = (e) => {
        e.preventDefault();
        localStorage.clear();
        history.push("/Login");
        history.go(0);
    }

    return (
        <div className="">
            <div className="dashboard">
                <div style={{ marginLeft: "10px", marginRight: "10px" }}>
                    <h3 style={{ marginTop: "10px" }}>Dashboard</h3>
                    <select style={{ width: "150px", fontSize: "11px", marginBottom: "10px" }} className="form-control" value={selectedDriver} onChange={handleDriverChange} >
                        <option hidden selected="selected">Select Driver</option>
                        {options}
                    </select>
                    <table class="locationTable" style={{ maxWidth: "60px", textAlign: "center", borderColor: "grey" }}>
                        <tbody>
                            {table}
                        </tbody>
                    </table>
                    <span style={{ display: "inline-block", color: "#808080", marginTop: "5px", marginBottom: "5px" }}>Drivers</span>
                    <Accordion.Toggle className="plus-button" as={Button} aria-controls="example-collapse-text"
                        aria-expanded={driverToggle}
                        onClick={dToggleClick}
                        style={{ background: `url(${driverToggle ? minus : plus}) no-repeat` }}></Accordion.Toggle>
                    <Collapse in={driverToggle}>
                        <div id="example-collapse-text">
                            <div style={{ background: "white", padding: "10px", borderRadius: "3px" }}>
                                <span style={{ fontSize: "11px", display: "block", marginBottom: "3px" }}>All ({drivers.length})</span>
                                <span style={{ fontSize: "11px", display: "block", marginBottom: "3px" }}>Available ({available})</span>
                                <span style={{ fontSize: "11px", display: "block" }}>In A Trip ({inATrip})</span>
                            </div>
                        </div>
                    </Collapse>

                </div>
                <div className="links">
                    <li><Link className="link" to="/RegisterDriver">Driver Settings</Link></li>
                    <li><Link className="link" to="/RegisterVehicle">Vehicle Settings</Link></li>
                    <li><Link className="link" to="/Settings">Settings</Link></li>
                    <li><Link className="link" to="/Reports">Reports</Link></li>
                    <li><Link to="/AssignTrip" className="link">Assign Trip</Link></li>
                    <li onClick={logout}><Link className="logout-button">Logout</Link></li>
                </div>
            </div>
            {/* <div ref={geocoderContainerRef} > */}
            <ReactMapGL {...viewport}
                ref={mapRef}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                onViewportChange={nextViewport => setViewport(nextViewport)}
                mapStyle="mapbox://styles/companyapi/ckg3rjrn10b8h19mm033e5srj">
                {markers}
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
                    </Popup>) : null}

                <Geocoder
                    mapRef={mapRef}
                    containerRef={geocoderContainerRef}
                    onViewportChange={handleViewportChange}
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

export default Dashboard;
