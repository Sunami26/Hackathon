import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Reporting from './contracts/Reporting.json';

function App() {
    const [account, setAccount] = useState('');
    const [reportingContract, setReportingContract] = useState(null);
    const [reports, setReports] = useState([]);
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        async function loadBlockchainData() {
            const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);

            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Reporting.networks[networkId];
            const instance = new web3.eth.Contract(
                Reporting.abi,
                deployedNetwork && deployedNetwork.address
            );
            setReportingContract(instance);
        }
        loadBlockchainData();
    }, []);

    const submitReport = async () => {
        await reportingContract.methods
            .createReport(description, location)
            .send({ from: account });
        loadReports();
    };

    const loadReports = async () => {
        const reportCount = await reportingContract.methods.reportCount().call();
        const loadedReports = [];
        for (let i = 1; i <= reportCount; i++) {
            const report = await reportingContract.methods.getReport(i).call();
            loadedReports.push(report);
        }
        setReports(loadedReports);
    };

    return (
        <div>
            <h1>Decentralized Reporting</h1>
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
            />
            <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
            />
            <button onClick={submitReport}>Submit Report</button>
            <h2>Reports</h2>
            <ul>
                {reports.map((report, index) => (
                    <li key={index}>
                        <p>{report.description}</p>
                        <p>{report.location}</p>
                        <p>{new Date(report.timestamp * 1000).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
