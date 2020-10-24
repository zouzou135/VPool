import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../App.css';
import vpool from '../images/VPoolLogo.png';

function DriverList({ history }) {
    const [drivers, setDrivers] = useState([]);
    useEffect(() => {
        if (localStorage.getItem("logged") !== "true") {
            history.push("/Login");
        } else {
            // getReport(selectedReport);
            getDrivers();
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

    let update = (e) => {
        e.preventDefault();
        history.push("/RegisterDriver", { name: e.target.value });
    }


    let rows = [];
    const contents1 = drivers.forEach((item, key) => {
        let date = item.DOB.slice(6, 8) + "/" + item.DOB.slice(4, 6) + "/" + item.DOB.slice(0, 4);
        rows.push(
            <tr>
                <td>{item.Name}</td>
                <td>{item.Nationality}</td>
                <td>{date}</td>
                <td>{item.information}</td>
                <td><button value={item.Name} onClick={update} className="btn btn-primary">Update</button></td>
            </tr>
        );
    });

    let logout = (e) => {
        e.preventDefault();
        localStorage.clear();
        history.push("/Login");
    }


    return (
        <div className="" >
            <div className="sidebar">
                <li style={{ padding: "10px", backgroundColor: "lightgrey", fontWeight: "bolder", fontSize: "20px" }}>
                    <img src={vpool} width="50px" style={{ marginRight: "10px" }}></img>
                VPOOL</li>
                <li><Link to="/RegisterDriver" className="active link-button">Driver Settings</Link></li>
                <li><Link to="/RegisterVehicle" className="link-button">Vehicle Settings</Link></li>
                <li><Link to="/Settings" className="link-button">Settings</Link></li>
                <li><Link to="/Reports" className="link-button">Reports</Link></li>
                <li><Link to="/AssignTrip" className="link-button">Assign Trip</Link></li>
                <li><Link to="/" className="link-button">Dashboard</Link></li>
                <li onClick={logout}><Link className="logout-button">Logout</Link></li>
            </div>


            <div className="content" style={{ paddingTop: "10px" }}>
                <div className="toCenterPills">
                    <ul class="nav nav-pills" style={{ marginBottom: "60px", borderColor: "black", borderStyle: "solid", borderRadius: "8px" }}>
                        <li className="nav-item" style={{ display: "inline-block", width: "150px", textAlign: "center" }}>
                            <Link to="/RegisterDriver" style={{ color: "black" }} className="nav-link">Register Driver</Link>
                        </li>
                        <li class="nav-item" style={{ display: "inline-block", width: "150px", textAlign: "center" }}>
                            <Link to="/DriverList" style={{ color: "white", background: "black" }} className="active nav-link">Driver List</Link>
                        </li>
                    </ul>
                </div>
                <table class="table">
                    <thead class="thead-dark">
                        <tr>
                            <th>Name</th>
                            <th>Nationality</th>
                            <th>Date of Birth</th>
                            <th>Information</th>
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

export default DriverList;