import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../App.css';
import vpool from '../images/VPool.jpeg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import history from "../history";

function Login() {
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [incorrect, setIncorrect] = useState(false);

    let loginFunction = (e) => {
        e.preventDefault();
        getAuth();
    }

    let getAuth = () => {
        let url = `http://192.34.109.55/BlaseExtra/Api/USERS?code=${username},${password}`;
        console.log(url);
        fetch(url, {
            method: 'GET',
            // headers: {
            //   'Content-Type': 'application/json',
            // },
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson[0] !== undefined) {
                    if (responseJson[0].ROLE === "ASSISTANT") {
                        setIncorrect(false);
                        localStorage.setItem("logged", "true");
                        localStorage.setItem("timeInterval", "30000");
                        history.push("/");
                        history.go(0);
                    } else {
                        setIncorrect(true);
                    }
                } else {
                    setIncorrect(true);
                }
            }).catch((error) => {
                console.log(error);
                alert('Failed to Save.');
            });
    }


    return (
        <div className="loginContainer" >
            <div className="toCenter">
                <img src={vpool} width="200px" className="mb-4" />
                <h3 className="mb-2" >Please Sign In</h3>

            </div>
            <form onSubmit={loginFunction} method="POST" className="">
                {incorrect ? <span style={{ color: "red" }}>Incorrect username or password</span> : null}
                <div className="input-group mb-3">
                    <div className="input-group-prepend" >
                        <span className="input-group-text" style={{ backgroundColor: "#0275d8", color: "white" }}><FontAwesomeIcon icon={faEnvelope} /></span>
                    </div>
                    <input required
                        onChange={(e => {
                            setUsername(e.target.value);
                        })}
                        type="text" className="form-control" placeholder="Username" id="usr" name="username" />
                </div>

                <div className="input-group mb-3">
                    <div className="input-group-prepend" >
                        <span className="input-group-text" style={{ backgroundColor: "#0275d8", color: "white" }}><FontAwesomeIcon icon={faLock} /></span>
                    </div>
                    <input required
                        onChange={(e => {
                            setPassword(e.target.value);
                        })}
                        type="password" className="form-control" placeholder="Password" id="pass" name="password" />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "330px" }}>Login</button>
            </form>
            <div style={{ textAlign: "center" }} className="mt-5">
                <div style={{ color: "grey", marginBottom: "4px" }}>© 2020 LAFARGEHOLCIM</div>
                <div style={{ color: "grey" }}>Provided By NRSoftware</div>
            </div>
        </div >
    );
}

export default Login;
