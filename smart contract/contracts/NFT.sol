// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721URIStorage, Ownable {
    uint256 public currentTokenId;

    event TokenMinted(address indexed collection, address indexed recipient, uint256 tokenId, string tokenUri);

    /**
     * @notice NFT contract.
     *
     * @param _name The name of the NFT contract.
     * @param _symbol The symbol of the NFT contract.
     * @param _owner The initial owner of the NFT contract.
     */
    constructor(string memory _name, string memory _symbol, address _owner) ERC721(_name, _symbol) {
        super._transferOwnership(_owner);
    }

    /**
     * @dev Mint a new NFT token.
     *
     * @param _to The address to receive the minted token.
     * @param _uri The URI for the token metadata.
     */
    function mint(address _to, string memory _uri)
        public
        onlyOwner
    {
        uint256 tokenId = currentTokenId;
        currentTokenId++;
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _uri);

        emit TokenMinted(address(this), _to, tokenId, _uri);
    }
}