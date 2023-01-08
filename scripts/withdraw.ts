import {getCurrentProject, getDeployedProject} from '@app/helpers';
import type {InfinityMintDeployedProject, InfinityMintScript, InfinityMintScriptParameters} from '@app/interfaces';
import {getDefaultSigner, getSignedContract} from '@app/web3';
import {InfinityMint} from '../typechain-types/InfinityMint';
import {Royalty} from '../typechain-types/royalty';


const Withdraw: InfinityMintScript = {
	name: 'Withdraw',
	description:
		'Withdraw the balance from your project\'s current minter.',

	async execute(script: InfinityMintScriptParameters) {
		let project: InfinityMintDeployedProject;
		if (script.args.project) {
			let projectName = script.args.project.value;
			project = getDeployedProject(projectName);
		} else {
			project = getDeployedProject(getCurrentProject().name);
		}

		let currentSigner = await getDefaultSigner();
		let royalty = await getSignedContract(project.deployments.royalty, currentSigner) as Royalty;
		let withdrawTotal = await royalty.values(currentSigner.address);

		if (withdrawTotal.isZero())
			throw new Error('you currently have no balance to withdraw');

		let erc721 = await getSignedContract(project.deployments.erc721, currentSigner) as InfinityMint;
		await erc721.withdraw();
	},
};

export default Withdraw;
