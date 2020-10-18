import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../App.css';
import vpool from '../images/VPoolLogo.png';
import history from "../history";

function RegisterVehicle(props) {
    const [route, setRoute] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [type, setType] = useState("");
    const [model, setModel] = useState("");
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState([]);

    useEffect(() => {
        if (localStorage.getItem("logged") !== "true") {
            history.push("/Login");
            history.go(0);
        } else {
            console.log(props.location);
            getVehicles();
        }
    }, []);

    let sendVehicle = () => {
        let url = `http://192.34.109.55/BlaseExtra/Api/Vehicules?code=${vehicleNumber};${type};${model};${""};${route}`;
        console.log(JSON.stringify({
            vehno: vehicleNumber,
            vehmod: model,
            vehtype: type,
            vehdept: "",
            Route: route,
            driver: "",
            mode: ""
        }));
        fetch(url, {
            method: 'GET',
            // headers: {
            //     'Accept': 'application/json',
            //     'Content-Type': 'application/json',
            //     'Access-Control-Allow-Origin': '*'
            // },
            // body: JSON.stringify({
            //     vehno: vehicleNumber,
            //     vehmod: model,
            //     vehtype: type,
            //     vehdept: "",
            //     Route: route,
            //     driver: "",
            //     mode: ""
            // })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                alert('Update Successful');
            }).catch((error) => {
                alert('Failed to Save.');
            });
    }


    let onVehicleChange = (e) => {
        setSelectedVehicle(e.target.value);
        let selectedV;
        for (var i = 0; i < vehicles.length; i++) {
            console.log(vehicles[i], selectedVehicle)
            if (vehicles[i].VEHICLE_NO === e.target.value) {
                selectedV = vehicles[i];
            }
        }

        setVehicleNumber(selectedV.VEHICLE_NO);
        setType(selectedV.VEHICLE_TYPE);
        setModel(selectedV.VEHICLE_MODEL);
        setRoute(selectedV.ROUTE);
        // selectedV
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
                if (props.location.state !== undefined) {
                    console.log(props.location.state.vehicleNb)
                    setSelectedVehicle(props.location.state.vehicleNb)
                    let selectedV;
                    for (var i = 0; i < responseJson.length; i++) {
                        // if (responseJson[i].VEHICLE_NO !== null) {
                        console.log(responseJson[i], selectedVehicle)
                        if (responseJson[i].VEHICLE_NO === props.location.state.vehicleNb) {
                            selectedV = responseJson[i];
                        }
                        // }

                    }

                    setVehicleNumber(selectedV.VEHICLE_NO);
                    setType(selectedV.VEHICLE_TYPE);
                    setModel(selectedV.VEHICLE_MODEL);
                    setRoute(selectedV.ROUTE);
                }
            }).catch((error) => {
                console.log(error);
                alert('Failed to Save.');
            });
    }

    let onRouteChange = (e) => {
        setRoute(e.target.value);
        // Or (you can use below method to access component in another method)
        // setDateOfBirth(this.dateRef.value);
    }

    let submitFunction = (e) => {
        e.preventDefault();
        sendVehicle();
        //setDateOfBirth(e.target.value);
        // Or (you can use below method to access component in another method)
        // setDateOfBirth(this.dateRef.value);
    }

    let options = [];

    const contents1 = vehicles.forEach((item, key) => {
        options.push(
            <option value={item.VEHICLE_NO}>{item.VEHICLE_NO}</option>
        );
    });

    let logout = (e) => {
        e.preventDefault();
        localStorage.clear();
        history.push("/Login");
        history.go(0);
    }

    return (
        <div className="" >
            <div className="sidebar">
                <li style={{ padding: "10px", backgroundColor: "lightgrey", fontWeight: "bolder", fontSize: "20px" }}>
                    <img src={vpool} width="50px" style={{ marginRight: "10px" }}></img>
                VPOOL</li>
                <li><Link to="/RegisterDriver" className="link-button">Driver Settings</Link></li>
                <li><Link to="/RegisterVehicle" className="active link-button">Vehicle Settings</Link></li>
                <li><Link to="/Reports" className="link-button">Reports</Link></li>
                <li><Link to="/" className="link-button">Dashboard</Link></li>
                <li onClick={logout}><Link className="logout-button">Logout</Link></li>
            </div>


            <div className="content" style={{ paddingTop: "10px" }}>
                <div className="toCenterPills">
                    <ul class="nav nav-pills" style={{ marginBottom: "60px", borderColor: "black", borderStyle: "solid", borderRadius: "8px" }}>
                        <li className="nav-item" style={{ display: "inline-block", width: "150px", textAlign: "center" }}>
                            <Link to="/RegisterVehicle" style={{ color: "white", background: "black" }} className="active nav-link">Register Vehicle</Link>
                        </li>
                        <li class="nav-item" style={{ display: "inline-block", width: "150px", textAlign: "center" }}>
                            <Link style={{ color: "black" }} to="/VehicleList" className=" nav-link">Vehicle List</Link>
                        </li>
                    </ul>
                </div>
                <form onSubmit={submitFunction} method="POST" className="">

                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label for="inputCity" style={{ fontWeight: "bold" }} >Select A Vehicle To Update</label>
                            <select for="inputAddress" className="form-control" value={selectedVehicle} onChange={onVehicleChange} >
                                <option hidden selected="selected" value="">Select Vehicle</option>
                                {options}
                            </select>
                        </div>
                    </div>


                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label style={{ fontWeight: "bold" }} for="inputEmail4">Vehicle Number</label>
                            <input value={vehicleNumber} type="number" required onChange={(e => {
                                setVehicleNumber(e.target.value);
                            })}
                                className="form-control" id="inputEmail4" placeholder="Vehicle Number" />
                        </div>
                        <div className="form-group col-md-6" >
                            <label style={{ fontWeight: "bold" }} for="inputPassword4">Type</label>
                            <input value={type} required
                                onChange={(e => {
                                    setType(e.target.value);
                                })}
                                type="text" className={"form-control"} id="inputPassword4" placeholder="Type" />
                        </div>
                    </div>


                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label for="inputAddress" style={{ fontWeight: "bold" }} >Model</label>
                            <input value={model} required
                                onChange={(e => {
                                    setModel(e.target.value)
                                })}
                                type="text" className="form-control" id="inputAddress" placeholder="Model" />
                        </div>
                        <div className="form-group col-md-6">
                            <label for="inputCity" style={{ fontWeight: "bold" }} >Route</label>
                            <select for="inputAddress" required className="form-control" value={route} onChange={onRouteChange} >
                                <option hidden selected="selected" value="">Select Route</option>
                                <option value="RMX">RMX</option>
                                <option value="NORMAL">NORMAL</option>
                            </select>
                        </div>

                    </div>

                    <input type="submit" className="btn btn-primary " value="Submit" />
                </form>
            </div>
        </div >
    );
}

export default RegisterVehicle;
