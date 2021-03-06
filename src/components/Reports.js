import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../App.css';
import vpool from '../images/VPoolLogo.png';
import history from "../history";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';


function Reports() {
    const [selectedReport, setSelectedReport] = useState(1);
    const [selectedReportName, setSelectedReportName] = useState("Vehicles");
    const [reports, setReports] = useState([]);
    const [fixedReports, setFixedReports] = useState([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const columns = React.useMemo(
        () => [
            {
                columns: [
                    {
                        Header: 'Age',
                        accessor: 'age',
                    },
                    {
                        Header: 'Visits',
                        accessor: 'visits',
                    },
                    {
                        Header: 'Status',
                        accessor: 'status',
                    },
                    {
                        Header: 'Profile Progress',
                        accessor: 'progress',
                    },
                ],
            },
        ],
        []
    )

    useEffect(() => {
        if (localStorage.getItem("logged") !== "true") {
            history.push("/Login");
            history.go(0);
        } else {
            // getReport(selectedReport);
        }
    }, []);

    let getReport = (reportNB) => {
        let url = `http://192.34.109.55/BlaseExtra/Api/ReportVIO?code=${fromDate.replace(/-/g, "")};${toDate.replace(/-/g, "")};${reportNB}`;
        fetch(url, {
            method: 'GET',
            // headers: {
            //   'Content-Type': 'application/json',
            // },
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                setReports(responseJson);
            }).catch((error) => {
                console.log(error);
                alert('Failed to Save.');
            });
    }

    let getTripsReport = () => {
        let url = `http://192.34.109.55/BlaseExtra/Api/ReportVpooldetail?code=${fromDate.replace(/-/g, "")};${toDate.replace(/-/g, "")}`;
        fetch(url, {
            method: 'GET',
            // headers: {
            //   'Content-Type': 'application/json',
            // },
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                setReports(responseJson);
                setFixedReports(responseJson);
            }).catch((error) => {
                console.log(error);
                alert('Failed to Save.');
            });
    }

    let onReportChange = (e) => {
        setSelectedReportName(e.target.value);
        if (e.target.value === "Vehicles") {
            setSelectedReport(1);
            getReport(1);
        } else if (e.target.value === "Drivers") {
            setSelectedReport(2);
            getReport(2);
        } else if (e.target.value === "Driver, Vehicle") {
            setSelectedReport(3);
            getReport(3);
        }
        else if (e.target.value === "Common Trips") {
            setSelectedReport(4);
            getReport(4);
        }
        else if (e.target.value === "Declined Trips") {
            setSelectedReport(5);
            getReport(5);
        }
        else if (e.target.value === "Trips Details") {
            setSelectedReport(6);
            getTripsReport();
        }
    }

    let rows = [];
    console.log(reports);
    let excelRows = []
    if (selectedReport === 6) {
        const contents1 = reports.forEach((item, key) => {
            let status = "";
            let type = "";
            let bgColor = "";
            if (item.Type === "N") {
                type = "Normal";
            } else {
                type = "Common";
            }
            if (item.status === 0) {
                status = "CREATED"
                bgColor = "black"
            } else if (item.status === 1) {
                status = "ACCEPTED"
                bgColor = "#FFCC00"
            } else if (item.status === 2) {
                status = "STARTED"
                bgColor = "orange"
            } else if (item.status === 3) {
                status = "ENDED"
                bgColor = "green"
            } else {
                status = "DECLINED"
                bgColor = "red"
            }
            rows.push(
                <tr>
                    <td>{item.Trucks}</td>
                    <td>{item.driver}</td>
                    <td>{type}</td>
                    <td>{item.datesc}</td>
                    <td>{item.fromlocation}</td>
                    <td>{item.tolocation}</td>
                    <td><span style={{ backgroundColor: bgColor, borderRadius: "3px", color: "white", padding: "3px" }}>{status}</span></td>
                    <td>{item.Startdate}</td>
                    <td>{item.enddate}</td>
                    <td>{item.noteassistant}</td>
                    <td>{item.notedriver}</td>
                    <td>{item.KM}</td>
                    <td>{item.DURATION}</td>
                    <td>{item.Speed}</td>
                </tr>
            );
            excelRows.push(
                <tr>
                    <td>{item.Trucks}</td>
                    <td>{item.driver}</td>
                    <td>{type}</td>
                    <td>{item.datesc}</td>
                    <td>{item.fromlocation}</td>
                    <td>{item.tolocation}</td>
                    <td >{status}</td>
                    <td>{item.Startdate}</td>
                    <td>{item.enddate}</td>
                    <td>{item.noteassistant}</td>
                    <td>{item.notedriver}</td>
                    <td>{item.KM}</td>
                    <td>{item.DURATION}</td>
                    <td>{item.Speed}</td>
                </tr>
            );
        });
    } else {
        const contents1 = reports.forEach((item, key) => {
            rows.push(
                <tr>
                    <td>{item.Head1}</td>
                    {selectedReport === 3 ? <td>{item.Head2}</td> : null}
                    <td>{item.nbtrips}</td>
                    <td>{item.KM}</td>
                </tr>
            );
        });
    }

    let tableHeader = [];
    let header1 = "";
    let header2 = "";
    if (selectedReport === 6) {
        tableHeader.push(
            <th>Vehicle</th>,
            <th>Driver</th>,
            <th>Type</th>,
            <th>Date Created</th>,
            <th>From</th>,
            <th>To</th>,
            <th>Status</th>,
            <th>Start Date</th>,
            <th>End Date</th>,
            <th>Assistant Note</th>,
            <th>Driver Note</th>,
            <th>Distance (KM)</th>,
            <th>Duration</th>,
            <th>Speed (KM/H)</th>
        )
    } else {
        if (selectedReport === 1 || selectedReport === 3) {
            header1 = <th>Vehicle Number</th>
        } else {
            header1 = <th>Name</th>
        }

        if (selectedReport === 3) {
            header2 = <th>Name</th>
        } else {
            header2 = null
        }
        tableHeader.push(
            header1,
            header2,
            <th>Number of Trips</th>,
            <th>Distance Traveled (KM)</th>
        )
    }

    let submitFunction = (e) => {
        e.preventDefault();
        if (selectedReport !== 6) {
            getReport(selectedReport);
        } else {
            getTripsReport();
        }

    }

    let onFromDateChange = (e) => {
        setFromDate(e.target.value);
    }

    let onToDateChange = (e) => {
        setToDate(e.target.value);
    }

    let logout = (e) => {
        e.preventDefault();
        localStorage.clear();
        history.push("/Login");
        history.go(0);
    }

    let statusFilter = (e) => {
        e.preventDefault();
        console.log(fixedReports)
        let tempReport = []
        if (parseInt(e.target.id) === 4) {
            setReports(fixedReports)
        } else {
            for (var i = 0; i < fixedReports.length; i++) {
                console.log(fixedReports[i].status, parseInt(e.target.id))
                if (fixedReports[i].status === parseInt(e.target.id)) {
                    tempReport.push(fixedReports[i])
                }
            }
            setReports(tempReport)
        }

    }

    return (
        <div className="" >
            <div className="sidebar">
                <li style={{ padding: "10px", backgroundColor: "lightgrey", fontWeight: "bolder", fontSize: "20px" }}>
                    <img src={vpool} width="50px" style={{ marginRight: "10px" }}></img>
                VPOOL</li>
                <li><Link to="/RegisterDriver" className="link-button">Driver Settings</Link></li>
                <li><Link to="/RegisterVehicle" className="link-button">Vehicle Settings</Link></li>
                <li><Link to="/Settings" className="link-button">Settings</Link></li>
                <li><Link to="/Reports" className="active link-button">Reports</Link></li>
                <li><Link to="/AssignTrip" className="link-button">Assign Trip</Link></li>
                <li><Link to="/" className="link-button">Dashboard</Link></li>
                <li onClick={logout}><Link className="logout-button">Logout</Link></li>
            </div>


            <div className="content">

                <label for="inputCity" style={{ fontWeight: "bold" }} >Select a Report</label>
                <select for="inputAddress" className="form-control" style={{ marginBottom: "10px", width: "200px" }}
                    value={selectedReportName} onChange={onReportChange} >
                    <option selected="selected">Vehicles</option>
                    <option>Drivers</option>
                    <option>Driver, Vehicle</option>
                    <option>Common Trips</option>
                    <option>Declined Trips</option>
                    <option>Trips Details</option>
                </select>
                <form onSubmit={submitFunction} method="POST" className="" style={{ marginBottom: "10px", width: "60%", position: "relative" }}>
                    <div className="form-row">
                        <div className="form-group col">
                            <label for="inputCity" style={{ fontWeight: "bold" }} >From Date</label>
                            <input required type="date" id="datepicker" className="form-control" value={fromDate} onChange={onFromDateChange} />
                        </div>
                        <div className="form-group col">
                            <label for="inputCity" style={{ fontWeight: "bold" }} >To Date</label>
                            <input required type="date" id="datepicker" className="form-control" value={toDate} onChange={onToDateChange} />
                        </div>
                        <div className="form-group col">
                            <input type="submit" class="btn btn-primary" style={{ bottom: "0px", position: "absolute" }} value="Select" />
                        </div>

                    </div>
                </form>
                {selectedReport === 6 ?
                    <span>
                        <span id={4} onClick={statusFilter} style={{ backgroundColor: "grey", borderRadius: "3px", color: "white", padding: "3px", cursor: "pointer" }}>ALL</span>
                        <span id={0} onClick={statusFilter} style={{ backgroundColor: "black", borderRadius: "3px", color: "white", padding: "3px", cursor: "pointer", marginLeft: "10px" }}>CREATED</span>
                        <span id={1} onClick={statusFilter} style={{ backgroundColor: "#FFCC00", borderRadius: "3px", color: "white", padding: "3px", cursor: "pointer", marginLeft: "10px" }}>ACCEPTED</span>
                        <span id={2} onClick={statusFilter} style={{ backgroundColor: "orange", borderRadius: "3px", color: "white", padding: "3px", cursor: "pointer", marginLeft: "10px" }}>STARTED</span>
                        <span id={3} onClick={statusFilter} style={{ backgroundColor: "green", borderRadius: "3px", color: "white", padding: "3px", cursor: "pointer", marginLeft: "10px" }}>ENDED</span>
                        <span id={-1} onClick={statusFilter} style={{ backgroundColor: "red", borderRadius: "3px", color: "white", padding: "3px", cursor: "pointer", marginLeft: "10px" }}>DECLINED</span> </span> : null}

                <div style={{ float: "right", marginBottom: "5px" }}>
                    <ReactHTMLTableToExcel
                        className="btn btn-info"
                        table={selectedReport === 6 ? "emp1" : "emp"}
                        filename={`${selectedReportName} ${fromDate} ${selectedReportName}`}
                        sheet="Sheet"
                        buttonText="Export to Excel" />
                </div>
                <table class="table" id="emp">
                    <thead class="thead-dark">
                        <tr>
                            {tableHeader}
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <table class="table" id="emp1" style={{ visibility: "hidden" }} >
                    <thead class="thead-dark">
                        <tr>
                            {tableHeader}
                        </tr>
                    </thead>
                    <tbody>
                        {excelRows}
                    </tbody>
                </table>
            </div>
        </div >
    );
}

export default Reports;
