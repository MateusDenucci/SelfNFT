const SelfNFT = artifacts.require("SelfNFT");

module.exports = function(deployer) {
  deployer.deploy(SelfNFT);
};