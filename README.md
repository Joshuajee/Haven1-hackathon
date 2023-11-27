# Haven1 - Proof of Identity Hackathon Submission

This is my submission for the Haven1 Hackathon, I cloned the starter repo and inputed my code.

You can find my contract and test here

- [AirDrop.sol](./contracts/Airdrop.sol)
- [airdrop.test.ts](./test/airdrop.test.ts)

Run the test with the command below

```bash

 npx hardhat test test/airdrop.test.ts

```

For this Hackathon I built a simple airdrop smart contract that only send tokens to people who have been issued identification, to combat spam.

There are two methods `doAirDrop` and `doAirDropByCountry`

-  The `doAirDrop(address _token, address[] calldata _receipient, uint256 _amount)`, accept the ERC20 token address, the receipient addresses, and the amount, it sends the underlying token to only people who have a valid Id i.e not supended.
-  The `doAirDropByCountry(address _token, address[] calldata _receipient, uint256 _amount, string memory countryCode)`, accept the ERC20 token address, and the receipient addresses and the amount, and the country. it sends the underlying token to only people who are from the specified country and have a valid Id i.e not supended.  
