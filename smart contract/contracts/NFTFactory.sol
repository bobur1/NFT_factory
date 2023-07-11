// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./NFT.sol";

contract NFTFactory {
    event CollectionCreated(address indexed collection, string name, string symbol);

    /**
     * @notice Create a new NFT collection.
     *
     * @param _name The name of the NFT collection.
     * @param _symbol The symbol of the NFT collection.
     */
    function createCollection (
        string memory _name,
        string memory _symbol
    ) public {
        NFT newCollection = new NFT(_name, _symbol, msg.sender);
        
        emit CollectionCreated(address(newCollection), _name, _symbol);
    }
}