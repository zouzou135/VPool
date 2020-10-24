import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../App.css';
import vpool from '../images/VPoolLogo.png';
import {
    Dropdown,
    DropdownButton,
} from 'react-bootstrap';
import { Rfdd, RfddOption } from 'react-free-dropdown';

function AssignTrip(props) {
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState("Select A Driver");
    const [selectedVehicle, setSelectedVehicle] = useState("Select A Vehicle");
    const [driverToken, setDriverToken] = useState("");
    const [vehicles, setVehicles] = useState([]);
    const [fromLocation, setFromLocation] = useState("");
    const [toLocation, setToLocation] = useState("");
    const [fromInfo, setFromInfo] = useState("");
    const [toInfo, setToInfo] = useState("");
    const [tripType, setTripType] = useState("");
    const [instructions, setInstructions] = useState("");
    const [preassignedLocations, setPreassignedLocations] = useState([]);
    const [fromOrTo, setFromOrTo] = useState("from");
    useEffect(() => {
        if (localStorage.getItem("logged") !== "true") {
            props.history.push("/Login");
        } else {
            // getReport(selectedReport);
            getDrivers();
            getVehicles();
            getPreassignedLocations();

            if (props.location.state !== undefined) {
                if (props.location.state.fromOrTo === "from") {
                    setFromInfo(props.location.state.lngLat)
                    setFromLocation(props.location.state.locationInfo)
                } else {
                    setToInfo(props.location.state.lngLat)
                    setToLocation(props.location.state.locationInfo)
                }
            }
            if ("serviceWorker" in navigator) {
                navigator.serviceWorker
                    .register("./firebase-messaging-sw.js")
                    .then(function (registration) {
                        console.log("Registration successful, scope is:", registration.scope);
                    })
                    .catch(function (err) {
                        console.log("Service worker registration failed, error:", err);
                    });
            }
        }
    }, []);

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

    let getVehicles = () => {
        let url = 'http://192.34.109.55/BlaseExtra/Api/Vehicules?code=0';
        fetch(url, {
            method: 'GET',
            // headers: {
            //   'Content-Type': 'application/json',
            // },
        }).then((response) => response.json())
            .then((responseJson) => {
                setVehicles(responseJson);
                console.log(responseJson);
            }).catch((error) => {
                console.log(error);
                alert('Failed to Save.');
            });
    }

    let update = (e) => {
        e.preventDefault();
        props.history.push("/RegisterDriver", { name: e.target.value });
    }


    let logout = (e) => {
        e.preventDefault();
        localStorage.clear();
        props.history.push("/Login");
    }

    let submitFunction = (e) => {
        e.preventDefault();
        postTrip()
    }

    let sendNotification = () => {
        console.log(process.env.REACT_APP_FIREBASE_SEVER_ID, driverToken)
        const fetchOptions = {
            "mode": "cors",
            "method": "POST",
            "headers": {
                "authorization": `key=${process.env.REACT_APP_FIREBASE_SEVER_ID}`,
                "content-type": "application/json"
            },

            "body": JSON.stringify({
                // "collapse_key": "type_a",
                data: {
                    body: `{From: ${fromLocation}\nTo: ${toLocation}}`,
                    title: "RMQ VPOOL",
                },
                to: driverToken
            })

        }

        fetch("https://fcm.googleapis.com/fcm/send", fetchOptions)
            .then(response => response.json())
            .then(data => console.log(data));
    }

    let postTrip = () => {
        // let url = `http://192.34.109.55/BlaseExtra/Api/Tripassig`;
        // console.log(JSON.stringify({
        //     vehno: vehicleNumber,
        //     vehmod: model,
        //     vehtype: type,
        //     vehdept: "",
        //     Route: route,
        //     driver: "",
        //     mode: ""
        // }));
        // fetch(url, {
        //     method: 'GET',
        // }).then((response) => response.json())
        //     .then((responseJson) => {
        //         console.log(responseJson)
        //         alert('Update Successful');
        //     }).catch((error) => {
        //         alert('Failed to Save.');
        //     });
        sendNotification()
    }

    let handleInstructionChange = (e) => {
        e.preventDefault();

    }

    let onTripTypeChange = (e) => {
        e.preventDefault();
        setTripType(e.target.value)
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

    let options = [];

    const contents = drivers.forEach((item, key) => {
        let background = "green"
        if (item.status === 1) {
            background = "red"
        }
        options.push(
            <Dropdown.Item onClick={() => {
                setSelectedDriver(item.Name)
                setDriverToken(item.Tokenid)
            }} style={{ width: "400px" }}>{item.Name}<span style={{ backgroundColor: background }} className="dot"></span></Dropdown.Item>
        );
    });

    let optionsV = [];

    console.log(vehicles.length);
    if (vehicles.length !== 0) {
        const contents1 = vehicles.forEach((item, key) => {
            let backgroundV = "green"
            if (item.status === 1) {
                backgroundV = "red"
            }
            optionsV.push(
                <Dropdown.Item onClick={() => {
                    setSelectedVehicle(item.VEHICLE_NO)
                }} style={{ width: "400px" }}>{item.VEHICLE_NO}<span style={{ backgroundColor: backgroundV }} className="dot"></span></Dropdown.Item>
            );
        });
    }

    let table = [];
    for (let i = 0; i < preassignedLocations.length / 3; i++) {
        let row = [];
        {
            for (let j = 0; j < 4; j++) {

                if (preassignedLocations[j] !== undefined) {

                    row.push(<td className="locationD" style={{ width: "25%" }} onClick={
                        (e) => {
                            if (fromOrTo === "from") {
                                setFromLocation(preassignedLocations[j].descriptions)
                                setFromInfo(preassignedLocations[j])
                            } else {
                                setToLocation(preassignedLocations[j].descriptions)
                                setToInfo(preassignedLocations[j])
                            }
                        }
                    }>{preassignedLocations[j].location1}</td>)
                } else {
                    row.push(<td className="locationD " style={{ cursor: "initial", width: "25%" }}></td>)
                }
            }
        }
        table.push(
            <tr>
                {row}
            </tr>
        );
    }

    return (
        <div className="" >
            < div className="sidebar" >
                <li style={{ padding: "10px", backgroundColor: "lightgrey", fontWeight: "bolder", fontSize: "20px" }}>
                    <img src={vpool} width="50px" style={{ marginRight: "10px" }}></img>
                VPOOL</li>
                <li><Link to="/RegisterDriver" className="link-button">Driver Settings</Link></li>
                <li><Link to="/RegisterVehicle" className="link-button">Vehicle Settings</Link></li>
                <li><Link to="/Settings" className="link-button">Settings</Link></li>
                <li><Link to="/Reports" className="link-button">Reports</Link></li>
                <li><Link to="/AssignTrip" className="active link-button">Assign Trip</Link></li>
                <li><Link to="/" className="link-button">Dashboard</Link></li>
                <li onClick={logout}><Link className="logout-button">Logout</Link></li>
            </div >


            <div className="content" style={{ paddingTop: "10px" }}>

                <form onSubmit={submitFunction} method="POST" className="">

                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label for="inputCity" style={{ fontWeight: "bold" }} >Select A Driver</label>
                            <Dropdown className="form-control" style={{ paddingBottom: "0px", paddingRight: "0px", paddingLeft: "0px" }} >
                                <Dropdown.Toggle className="form-control" style={{ marginTop: "-7px", textAlign: "start" }} variant="Secondary" id="dropdown-basic">
                                    {selectedDriver}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {options}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="form-group col-md-6">
                            <label for="inputCity" style={{ fontWeight: "bold" }} >Select A Vehicle</label>
                            <Dropdown className="form-control" style={{ paddingBottom: "0px", paddingRight: "0px", paddingLeft: "0px" }} >
                                <Dropdown.Toggle className="form-control" style={{ marginTop: "-7px", textAlign: "start" }} variant="Secondary" id="dropdown">
                                    {selectedVehicle}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {optionsV}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                    </div>

                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label for="inputAddress" style={{ fontWeight: "bold" }} >From Location</label>
                            <div className="row">
                                <div className="col-1" style={{ marginTop: "7px" }}>
                                    <input checked={fromOrTo === "from"} type="radio" name="optradio"
                                        onClick={(e) => {
                                            setFromOrTo("from")
                                        }}></input>
                                </div>
                                <div className="col-11" >
                                    <input readOnly value={fromLocation} required
                                        type="text" class="form-control" id="inputAddress" placeholder="From Location" />
                                </div>
                            </div>
                        </div>
                        <div className="form-group col-6">
                            <label for="inputAddress" style={{ fontWeight: "bold" }} >To Location</label>
                            <div className="row">
                                <div className=" col-1" style={{ marginTop: "7px" }}>
                                    <input checked={fromOrTo === "to"}
                                        onClick={(e) => {
                                            setFromOrTo("to")
                                        }} type="radio" name="optradio"></input>
                                </div>
                                <div className="col" >
                                    <input readOnly value={toLocation} required
                                        type="text" class="form-control" id="inputAddress" placeholder="To Location" />
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <button onClick={(e) => {
                                props.history.push("/ChooseOnMap", fromOrTo)
                            }} class="btn btn-primary form-control">Choose On Map</button>
                        </div>
                        <div className="form-group col-6">
                            {/* <table class="locationTable" style={{ textAlign: "center", borderColor: "grey", width: "1650%" }}>
                                {table}
                            </table> */}
                            <table class="table table-bordered">
                                <thead class="thead-dark">

                                </thead>
                                <tbody>
                                    {table}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label for="inputCity" style={{ fontWeight: "bold" }} >Select Trip Type</label>
                            <select for="inputAddress" className="form-control" value={tripType} onChange={onTripTypeChange} >
                                <option hidden selected="selected" value="">Select Trip Type</option>
                                <option selected="selected" value="Food Delivery">Food Delivery</option>
                                <option selected="selected" value="Electronics Delivery">Electronics Delivery</option>
                            </select>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" style={{ fontWeight: "bold" }} htmlFor="fcDescription">Instructions</label>
                            <textarea value={instructions} className="form-control" type="text" id="FPRating" name="FPRating" onChange={handleInstructionChange} placeholder={'Instructions...'} size="10" />
                        </div>
                    </div>
                    <input type="submit" class="btn btn-primary" value="Submit" />
                </form>
            </div >
        </div >
    );
}

export default AssignTrip;