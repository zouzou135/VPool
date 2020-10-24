import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../App.css';
import vpool from '../images/VPoolLogo.png';


function VehicleList({ history }) {
    const [vehicles, setVehicles] = useState([]);
    useEffect(() => {
        if (localStorage.getItem("logged") !== "true") {
            history.push("/Login");
            history.go(0);
        } else {
            // getReport(selectedReport);
            getVehicles();
        }
    }, []);

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
        history.push("/RegisterVehicle", { vehicleNb: e.target.value });
    }

    let rows = [];
    const contents1 = vehicles.forEach((item, key) => {
        rows.push(
            <tr>
                <td>{item.VEHICLE_NO}</td>
                <td>{item.VEHICLE_TYPE}</td>
                <td>{item.VEHICLE_MODEL}</td>
                <td>{item.ROUTE}</td>
                <td><button value={item.VEHICLE_NO} onClick={update} className="btn btn-primary">Update</button></td>
            </tr>
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
                <li><Link to="/Settings" className="active link-button">Settings</Link></li>
                <li><Link to="/Reports" className="link-button">Reports</Link></li>
                <li><Link to="/AssignTrip" className="link-button">Assign Trip</Link></li>
                <li><Link to="/" className="link-button">Dashboard</Link></li>
                <li onClick={logout}><Link className="logout-button">Logout</Link></li>
            </div>


            <div className="content" style={{ paddingTop: "10px" }}>
                <div className="toCenterPills">
                    <ul class="nav nav-pills toCenterPills" style={{ marginBottom: "60px", borderColor: "black", borderStyle: "solid", borderRadius: "8px" }}>
                        <li className="nav-item" style={{ width: "150px", textAlign: "center" }}>
                            <Link to="/RegisterVehicle" style={{ color: "black" }} className="nav-link">Register Vehicle</Link>
                        </li>
                        <li class="nav-item" style={{ width: "150px", textAlign: "center" }}>
                            <Link to="/VehicleList" style={{ color: "white", background: "black" }} className="active nav-link">Vehicle List</Link>
                        </li>
                    </ul>
                </div>
                <table class="table">
                    <thead class="thead-dark">
                        <tr>
                            <th>Vehicle Number</th>
                            <th>Type</th>
                            <th>Model</th>
                            <th>Route</th>
                            <th>Settings</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        </div >
    );
}

export default VehicleList;