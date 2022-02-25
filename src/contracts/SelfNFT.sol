pragma solidity ^0.5.16;
// pragma solidity ^0.7.6;


//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.4/contracts/token/ERC721/ERC721.sol";
import "./ERC721Full.sol";

contract SelfNFT is ERC721Full{
  
  constructor() ERC721Full('SelfNFT', 'sNFT') public {}

  function mint(address _to, string memory _tokenURI) public returns(bool){
    uint _tokenID = totalSupply() + 1;
    _mint(_to, _tokenID);
    _setTokenURI(_tokenID, _tokenURI);

    return true;
  }

}
