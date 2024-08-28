// contracts/Reporting.sol
pragma solidity ^0.8.0;

contract Reporting {
    struct Report {
        uint id;
        string description;
        string location;
        uint timestamp;
        address reporter;
    }

    uint public reportCount = 0;
    mapping(uint => Report) public reports;

    function createReport(string memory _description, string memory _location) public {
        reportCount++;
        reports[reportCount] = Report(reportCount, _description, _location, block.timestamp, msg.sender);
    }

    function getReport(uint _id) public view returns (Report memory) {
        return reports[_id];
    }
}