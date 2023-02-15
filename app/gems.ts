import { getConfigFile, cwd, isInfinityMint, log, Dictionary } from './helpers';
import { Gem } from './interfaces';
import glob from 'glob';
import path from 'path';
import fs from 'fs';

export let requiredGems = {};

//requires gems in the config file, used when a gem is a node module
export const requireGems = async () => {
    let config = getConfigFile();
    if (config.gems)
        Promise.all(
            config.gems.map(async (gem) => {
                requiredGems[gem] = require.resolve(gem);
            })
        );
};

/**
 *
 * @returns
 */
export const includeGems = async () => {
    let gems = [...(await findGems()), ...Object.values(requiredGems)];
    let includedGems: Dictionary<Gem> = {};
    await Promise.all(
        gems.map(async (gem) => {
            let parsed = path.parse(gem);
            let sources: string[] = await new Promise((resolve, reject) => {
                glob(parsed.dir + '/**/*', (err, files) => {
                    if (err) reject(err);
                    resolve(files);
                });
            });

            let pages = sources.filter(
                (source) =>
                    source.includes('/pages/') || source.includes('/Pages/')
            );
            let components = sources.filter(
                (source) =>
                    source.includes('/components/') ||
                    source.includes('/components/')
            );
            let scripts = sources.filter(
                (source) =>
                    source.includes('/scripts/') || source.includes('/Scripts/')
            );
            let modals = sources.filter(
                (source) =>
                    source.includes('/modals/') || source.includes('/modals/')
            );
            let contracts = sources.filter(
                (source) =>
                    source.includes('/contracts/') ||
                    source.includes('/Contracts/')
            );
            let metadata = JSON.parse(fs.readFileSync(gem, 'utf8'));

            let modules = {
                main: fs.existsSync(parsed.dir + '/main.ts')
                    ? parsed.dir + 'main.ts'
                    : null,
                client: fs.existsSync(parsed.dir + '/client.ts')
                    ? parsed.dir + 'client.ts'
                    : null,
                setup: fs.existsSync(parsed.dir + '/setup.ts')
                    ? parsed.dir + 'setup.ts'
                    : null,
                deploy: fs.existsSync(parsed.dir + '/deploy.ts')
                    ? parsed.dir + 'deploy.ts'
                    : null,
            };

            includedGems[parsed.name] = {
                name: parsed.name,
                metadata,
                pages,
                modules,
                scripts,
                components,
                contracts,
                isOldGem: metadata.infinitymint === undefined,
                hasDeployScript:
                    fs.existsSync(parsed.dir + '/deploy.ts') ||
                    fs.existsSync(parsed.dir + '/deploy.js'),
                hasSetupScript:
                    fs.existsSync(parsed.dir + '/setup.ts') ||
                    fs.existsSync(parsed.dir + '/setup.js'),
                hasMainScript:
                    fs.existsSync(parsed.dir + '/main.ts') ||
                    fs.existsSync(parsed.dir + '/main.js'),
                hasClientScript:
                    fs.existsSync(parsed.dir + '/client.ts') ||
                    fs.existsSync(parsed.dir + '/client.js'),
                modals,
                sources,
            };
        })
    );
    requiredGems = { ...requiredGems, ...includedGems };
    return includedGems;
};

export const findGems = async () => {
    let locations = [cwd() + '/gems/**/*.json'];
    let config = getConfigFile();

    if (!isInfinityMint())
        locations.push(cwd() + '/node_modules/infinitymint/gems/**/*.json');

    if (config.roots)
        config.roots.forEach((root) => {
            if (root[root.toString().length - 1] !== '/') root = root + '/';
            locations.push(cwd() + '/' + root + 'gems/**/*.json');
            locations.push(cwd() + '/' + root + 'mods/**/*.json');
        });

    let roots = [];

    await Promise.all(
        locations.map(
            (location) =>
                new Promise((resolve, reject) => {
                    glob(location, (err, files) => {
                        if (err) reject(err);
                        log(
                            '\t => found ' +
                                files.length +
                                ' gems in ' +
                                location,
                            'glob'
                        );
                        files.forEach((file) => {
                            roots.push(file);
                        });
                        resolve(true);
                    });
                })
        )
    );

    return roots;
};
