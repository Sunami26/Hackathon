// migrations/2_deploy_contracts.js
const Reporting = artifacts.require("Reporting");

module.exports = function(deployer) {
  deployer.deploy(Reporting);
};
