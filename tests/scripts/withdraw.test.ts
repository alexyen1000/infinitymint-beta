import { ethers } from 'hardhat';
import { expect } from 'chai';
//import Withdraw from '../../scripts/withdraw';
import {
    InfinityMintScript,
    InfinityMintScriptParameters,
} from '../../app/interfaces';

/** 
describe('InfinityMint withdraw script', () => {
	it('Function runs as normal', async () => {
		let script = Withdraw as InfinityMintScript;
		await script.execute({} as InfinityMintScriptParameters);
	});

	it('Should return the current owner address', async () => {
		const [owner] = await ethers.getSigners();
		const Token = await ethers.getContractFactory('Token');

		const hardhatToken = await Token.deploy();

		const ownerBalance = await hardhatToken.balanceOf(owner.address);
		expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
	});

	it('Returns current project name correctly', () => {});

	it('Fails when current minter balance is 0', () => {});
});
**/
