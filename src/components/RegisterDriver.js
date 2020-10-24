import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../App.css';
import vpool from '../images/VPoolLogo.png';
import $ from "jquery";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import history from "../history";


function RegisterDriver(props) {
    const [dateOfBirth, setDateOfBirth] = useState(new Date().getFullYear().toString()
        + (new Date().getMonth().toString() >= 10 ? "0" + new Date().getMonth().toString() : new Date().getMonth().toString())
        + (new Date().getDay().toString() >= 10 ? "0" + new Date().getDay().toString() : new Date().getDay().toString()));
    // const [inputPassword, setInputPassword] = useState(null);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [phoneNB, setPhoneNB] = useState("");
    const [nationality, setNationality] = useState("");
    // const [password, setPassword] = useState("");
    const [information, setInformation] = useState("");
    const [selectedDriver, setSelectedDriver] = useState("");
    const [drivers, setDrivers] = useState([]);

    useEffect(() => {

        if (localStorage.getItem("logged") !== "true") {
            history.push("/Login");
            history.go(0);
        } else {
            getDrivers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let onDateChange = (e) => {
        // $('#datepicker').datepicker({
        //     format: 'dd/mm/yyyy'
        // });
        setDateOfBirth(e.target.value);
        // Or (you can use below method to access component in another method)
        // setDateOfBirth(this.dateRef.value);
    }

    let onDriverChange = (e) => {
        setSelectedDriver(e.target.value);
        let selectedD;
        for (var i = 0; i < drivers.length; i++) {
            console.log(drivers[i], selectedDriver)
            if (drivers[i].Name === e.target.value) {
                selectedD = drivers[i];
            }
        }

        console.log(selectedD.Name, selectedD.Nationality, selectedD.DOB, selectedD.phonenumber, selectedD.information);
        setName(selectedD.Name);
        // setUsername(drivers[i].NAME);
        let date = selectedD.DOB.slice(0, 4) + "-" + selectedD.DOB.slice(4, 6) + "-" + selectedD.DOB.slice(6, 8);

        setUsername(selectedD.USERID)
        setNationality(selectedD.Nationality);
        setDateOfBirth(date);
        setPhoneNB(selectedD.phonenumber);
        setInformation(selectedD.information);
    }

    let submitFunction = (e) => {
        e.preventDefault();
        console.log(name, username, nationality, dateOfBirth, phoneNB, information);
        sendDriver();
        // if (password.length < 5) {
        //     console.log(dateOfBirth);
        //     setInputPassword(false);
        // }

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

                if (props.location.state !== undefined) {
                    setSelectedDriver(props.location.state.name);
                    let selectedD;
                    for (var i = 0; i < responseJson.length; i++) {
                        console.log(responseJson[i], selectedDriver)
                        if (responseJson[i].Name === props.location.state.name) {
                            selectedD = responseJson[i];
                        }
                    }

                    console.log(selectedD.Name, selectedD.Nationality, selectedD.DOB, selectedD.phonenumber, selectedD.information);
                    setName(selectedD.Name);
                    // setUsername(drivers[i].NAME);
                    let date = selectedD.DOB.slice(0, 4) + "-" + selectedD.DOB.slice(4, 6) + "-" + selectedD.DOB.slice(6, 8);

                    setUsername(selectedD.USERID)
                    setNationality(selectedD.Nationality);
                    setDateOfBirth(date);
                    setPhoneNB(selectedD.phonenumber);
                    setInformation(selectedD.information);
                }
            }).catch((error) => {
                console.log(error);
                alert('Failed to Save.');
            });
    }

    let sendDriver = () => {
        let url = `http://192.34.109.55/BlaseExtra/Api/Drivers?code=${username};${name};${nationality};${dateOfBirth.replace(/-/g, "")};${phoneNB};${information}`;
        console.log(JSON.stringify({
            NAME: name,
            username: username,
            Natio: nationality,
            DOB: dateOfBirth,
            phonenb: phoneNB,
            info: information,
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
            //     NAME: name,
            //     username: username,
            //     Natio: nationality,
            //     DOB: dateOfBirth,
            //     phonenb: phoneNB,
            //     info: information,
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




    let handleInformationChange = (e) => {
        setInformation(e.target.value);
        //setDateOfBirth(e.target.value);
        // Or (you can use below method to access component in another method)
        // setDateOfBirth(this.dateRef.value);
    }

    let options = [];

    const contents1 = drivers.forEach((item, key) => {
        options.push(
            <option value={item.Name}>{item.Name}</option>
        );
    });

    console.log(name, username, nationality, dateOfBirth, phoneNB, information);

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
                        <li class="nav-item" style={{ display: "inline-block", textAlign: "center" }}>
                            <Link to="/RegisterDriver" style={{ color: "white", background: "black" }} className="active nav-link" >Register Driver</Link>
                        </li>
                        <li class="nav-item" style={{ display: "inline-block", width: "150px", textAlign: "center" }}>
                            <Link to="/DriverList" style={{ color: "black" }} className="nav-link">Driver List</Link>
                        </li>
                    </ul>
                </div>

                <form onSubmit={submitFunction} method="POST" className="">

                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label for="inputCity" style={{ fontWeight: "bold" }} >Select A Driver To Update</label>
                            <select for="inputAddress" className="form-control" value={selectedDriver} onChange={onDriverChange} >
                                <option hidden selected="selected" value="">Select Driver</option>
                                {options}
                            </select>
                        </div>

                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label style={{ fontWeight: "bold" }} for="name">Name</label>
                            <input value={name} required onChange={(e => {
                                setName(e.target.value);
                            })}
                                type="text" className="form-control" id="name" placeholder="Name" />
                        </div>
                        <div className="form-group col-md-6" >
                            <label style={{ fontWeight: "bold" }} for="username">Username</label>
                            <input value={username} required id="username" class="form-control" type="text" placeholder="username"
                                onChange={(e => {
                                    setUsername(e.target.value);
                                })}></input>
                            {/* <input required
                                onChange={(e => {
                                    setPassword(e.target.value);
                                    if (e.target.value.length >= 5) {
                                        setInputPassword(true);
                                    }
                                })}
                                type="password" class={inputPassword == null ||
                                    inputPassword ? "form-control" : "form-control is-invalid"} id="inputPassword4" placeholder="Password" />
                            {
                                inputPassword == null ||
                                    inputPassword ? null :
                                    <div className="invalid-feedback">
                                        The password has to be over at least 5 characters
                           </div>
                            } */}
                        </div>
                    </div>


                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label for="inputAddress" style={{ fontWeight: "bold" }} >Nationality</label>
                            <input value={nationality} required
                                onChange={(e => {
                                    setNationality(e.target.value)
                                })}
                                type="text" class="form-control" id="inputAddress" placeholder="Nationality" />
                        </div>
                        <div className="form-group col-md-6">
                            <label for="inputCity" style={{ fontWeight: "bold" }} >Date Of Birth</label>
                            <input required type="date" id="datepicker" className="form-control" value={dateOfBirth} onChange={onDateChange} />
                        </div>

                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6" >
                            <label style={{ fontWeight: "bold" }} for="phone">Phone Number</label>
                            <PhoneInput
                                required
                                inputProps={{
                                    required: true,
                                }}
                                value={phoneNB}
                                // isValid={(value, country) => {
                                //     if (value.match(value.length <= 6)) {
                                //         console.log('dsfadf')
                                //         return 'Invalid value: ' + value + ', ' + country.name;
                                //     } else {
                                //         return true;
                                //     }
                                // }}
                                inputClass="form-control"
                                inputStyle={{ width: '100%' }}
                                containerStyle={{ width: '100%' }}
                                buttonStyle={{}}
                                id="phone"
                                country={'qa'}
                                value={phoneNB}
                                onChange={phone => setPhoneNB(phone)}
                            />
                            {/* <input required id="phone" class="form-control" type="tel" placeholder="1-(555)-555-5555" id="example-tel-input"></input> */}
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" style={{ fontWeight: "bold" }} htmlFor="fcDescription">Information</label>
                            <textarea value={information} className="form-control" type="text" id="FPRating" name="FPRating" onChange={handleInformationChange} placeholder={'Information...'} required size="10" />
                        </div>
                    </div>
                    <input type="submit" class="btn btn-primary" value="Submit" />
                </form>
            </div>
        </div >
    );
}

export default RegisterDriver;
