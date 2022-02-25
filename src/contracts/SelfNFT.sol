pragma solidity ^0.5.2;

import "./ERC721Full.sol";

contract SelfNFT is ERC721Full{
  
  constructor() ERC721Full('SelfNFT', 'sNFT') public {}

  function mint(address _to, string memory _tokenURI) public returns(bool){
    uint _tokenID = totalSupply().add(1);
    _mint(_to, _tokenID);
    _setTokenURI(_tokenID, _tokenURI);

    return true;
  }

}
