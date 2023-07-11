# NFT Factory and NFT contract

## Install the dependencies
```
npm i
```

## Deployment

Fill in all the required environment variables(copy .env-example to .env and fill it). 

Deploy contract to the chain (mumbai testnet):
```
npx hardhat run scripts/deploy.ts --network polygon-mumbai
```

## Tasks
Create new task(s) ans save it(them) in the folder "tasks". Add a new task name in the file "tasks/index.ts".

Running a task(examples):

CreateCollection:
```
npx hardhat createNFT --network polygon-mumbai --factory 0x467Db24669200A2E54398316b9CdbC2Cf3E3D468 --name "Custom Token1" --symbol "CST"
```

Mint:
```
npx hardhat mint --network polygon-mumbai --nft 0xbcD372fe82C147c2A0cD33f7B340F6F25DbE2B27 --uri "https://ipfs.io/ipfs/QmSgsMgakC143p9PfNuagHkp9dULJKJ9v4ULqDEwCZojzx"
```

## Verification
Verify the installation by running the following command:
```
npx hardhat verify --network polygon-mumbai {CONTRACT_ADDRESS}
```
Note: Replace {CONTRACT_ADDRESS} with the address of the contract