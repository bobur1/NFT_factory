import { task } from 'hardhat/config';
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { Address } from 'cluster';

task('mint', 'Mint new nft')
    .addParam('nft', 'Token address')
    .addParam('uri', 'Token uri')
	.setAction(async ({ nft, uri, reciever }, { ethers }) => {
        const [sender] = await ethers.getSigners();
    
        const NFT = await ethers.getContractFactory('NFT');
        const contract = NFT.attach(nft);

        // event listener from https://stackoverflow.com/questions/68432609/contract-event-listener-is-not-firing-when-running-hardhat-tests-with-ethers-js
        const contractTx: ContractTransaction = await contract.mint(sender.address, uri);
        const contractReceipt: ContractReceipt = await contractTx.wait();
        const event = contractReceipt.events?.find(event => event.event === 'TokenMinted');
        const collectionAddress: Address = event?.args!['collection'];
        const recipientAddress: Address = event?.args!['recipient'];
        const tokenId: BigNumber = event?.args!['tokenId']; 
        const tokenUri: String = event?.args!['tokenUri']; 
        console.log(`Collection address: ${collectionAddress}`);
        console.log(`Recipient address: ${recipientAddress}`);
        console.log(`Token Id: ${tokenId}`);
        console.log(`Token Uri: ${tokenUri}`);
    });
