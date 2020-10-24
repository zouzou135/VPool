import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../App.css';
import vpool from '../images/VPoolLogo.png';

function Settings({ props, history }) {
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (localStorage.getItem("logged") !== "true") {
            history.push("/Login");
        } else {
            if (localStorage.getItem("timeInterval") !== undefined &&
                localStorage.getItem("timeInterval") !== null) {
                let mil = parseInt(localStorage.getItem("timeInterval"));
                console.log(localStorage.getItem("timeInterval"))
                setMinutes(Math.floor(mil / 60000))
                setSeconds(Math.floor((mil % 60000) / (1000)))
            }
        }
    }, []);

    let submitFunction = (e) => {
        e.preventDefault();

        if (parseInt(minutes) === 0 && parseInt(seconds) === 0) {
            alert("The time interval can't be 0")
        } else if (parseInt(minutes) < 0 || parseInt(seconds) < 0) {
            alert("The time interval can't be negative")
        } else {
            localStorage.setItem("timeInterval", (parseInt(minutes) * 60 * 1000) + (parseInt(seconds) * 1000))
        }
    }

    let options = [];

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
                <li><Link to="/RegisterDriver" className="link-button">Driver Settings</Link></li>
                <li><Link to="/RegisterVehicle" className="link-button">Vehicle Settings</Link></li>
                <li><Link to="/Settings" className="active link-button">Settings</Link></li>
                <li><Link to="/Reports" className="link-button">Reports</Link></li>
                <li><Link to="/AssignTrip" className="link-button">Assign Trip</Link></li>
                <li><Link to="/" className="link-button">Dashboard</Link></li>
                <li onClick={logout}><Link className="logout-button">Logout</Link></li>
            </div>


            <div className="content" style={{ paddingTop: "10px" }}>
                <form onSubmit={submitFunction} method="POST" className="" style={{ width: "50%" }}>
                    <h3 style={{ fontWeight: "bold" }}>Map Refresh Interval</h3>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label style={{ fontWeight: "bold" }} for="inputEmail4">Minutes</label>
                            <input value={minutes} type="number" required onChange={(e => {
                                setMinutes(e.target.value);
                            })}
                                className="form-control" id="inputEmail4" placeholder="Minutes" />
                        </div>
                        <div className="form-group col-md-6" >
                            <label style={{ fontWeight: "bold" }} for="inputPassword4">Seconds</label>
                            <input value={seconds} required
                                onChange={(e => {
                                    setSeconds(e.target.value);
                                })}
                                type="number" className={"form-control"} id="inputPassword4" placeholder="Seconds" />
                        </div>
                    </div>
                    <input type="submit" className="btn btn-primary" value="Save" style={{ float: "right" }} />
                </form>
            </div>
        </div>
    );
}

export default Settings;
