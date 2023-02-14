import { warning } from '../../app/helpers';
import { InfinityMintDeploymentScript } from '../../app/interfaces';
import { logTransaction } from '../../app/web3';
import { InfinityMintValues } from '../../typechain-types';

const DefaultValues = {
    maxSupply: 10,
    linkWalletIndex: 0,
    //add random stuf
    linkStickersIndex: 1,
};

const Values: InfinityMintDeploymentScript = {
    setup: async ({ project, debugLog, deployment }) => {
        if (project.settings === undefined) {
            project.settings = {};
        }

        let variables = {
            ...DefaultValues,
            ...(project.settings?.assets || {}),
            ...(project.settings?.minter || {}),
            ...(project.settings?.erc721 || {}),
            ...(project.settings?.values || {}),
        };

        let cleanedVariables = {} as any;
        let values = Object.values(variables);
        let keys = Object.keys(variables);
        let singleLevelObjects = keys.filter(
            (key) => typeof values[key] === 'object'
        );
        //only select numbers or booleans to be added
        keys.filter(
            (key) =>
                typeof values[key] === 'number' ||
                typeof values[key] === 'boolean'
        ).forEach((key) => (cleanedVariables[key] = values[key]));

        //add values from objects into the variables list
        singleLevelObjects
            .map((object) => {
                return { keys: Object.keys(values[object]), value: object };
            })
            .forEach((object) => {
                object.keys
                    .filter(
                        (key) =>
                            typeof values[object.value][key] === 'number' ||
                            typeof values[object.value][key] === 'boolean'
                    )
                    .forEach((key) => {
                        cleanedVariables[key] = values[object.value][key];
                    });
            });

        debugLog(
            'found ' +
                Object.values(cleanedVariables).length +
                ' values to set on chain'
        );
        Object.values(cleanedVariables).forEach((value, index) =>
            debugLog(`[${index}] => {${value}}`)
        );

        let booleans = Object.keys(cleanedVariables).filter(
            (key) => typeof cleanedVariables[key] === 'boolean'
        );

        let numbers = Object.keys(cleanedVariables).filter(
            (key) => typeof cleanedVariables[key] === 'number'
        );
        let contract =
            (await deployment.getSignedContract()) as InfinityMintValues;

        await logTransaction(
            await contract.setupValues(
                Object.values(numbers),
                Object.values(numbers).map((key) => cleanedVariables[key]),
                Object.values(booleans),
                Object.values(booleans).map((key) => cleanedVariables[key])
            ),
            'setting values on chain'
        );
    },
    static: true,
    //going to give
    instantlySetup: true, //will run the set up for this contract instantly and not after everything else has deployed
    unique: true,
    important: true,
    module: 'values',
    index: 1, //nothing should be before values
    solidityFolder: 'alpha',
    permissions: ['approved'],
};
export default Values;
