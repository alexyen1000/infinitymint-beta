import { getConfigFile, cwd, isInfinityMint, log, Dictionary } from './helpers';
import { Gem } from './interfaces';
import glob from 'glob';
import path from 'path';
import fs from 'fs';

let requiredGems: string[];
let loadedGems: Dictionary<Gem> = {};

/**
 * Loads all gems from the config file which are NPM packages
 */
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
 * Completely reloads a gem, deleting the cache and reloading it
 * @param name
 * @returns
 */
export const reloadGem = async (name: string) => {
    if (!hasGem(name)) return;

    if (loadedGems[name].modules) {
        Object.values(loadedGems[name].modules).forEach((module) => {
            if (require.cache[module]) delete require.cache[module];
        });
    }

    delete loadedGems[name];
    if (requiredGems[name]) {
        if (require.cache[requiredGems[name]])
            delete require.cache[requiredGems[name]];
        delete requiredGems[name];
        await requireGems();
    }
    await includeGems(name);
    return loadedGems[name];
};

/**
 *
 * @param name
 * @returns
 */
export const hasGem = (name: string) => {
    return loadedGems[name] !== undefined;
};

/**
 *
 * @param name
 * @returns
 */
export const getGem = (name: string) => {
    return loadedGems[name];
};

/**
 *
 * @returns
 */
export const includeGems = async (reload?: string) => {
    let gems = [...(await findGems()), ...Object.values(requiredGems)];
    let includedGems: Dictionary<Gem> = { ...loadedGems };
    await Promise.all(
        gems.map(async (gem) => {
            if (reload && reload !== gem) return;

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
            let deployScripts = sources.filter(
                (source) =>
                    source.includes('/deploy/') || source.includes('/deploy/')
            );
            let contracts = sources.filter(
                (source) =>
                    source.includes('/contracts/') ||
                    source.includes('/Contracts/')
            );
            let metadata = JSON.parse(fs.readFileSync(gem, 'utf8'));

            let modules = {
                main:
                    fs.existsSync(parsed.dir + '/main.ts') ||
                    fs.existsSync(parsed.dir + '/main.js')
                        ? parsed.dir +
                          'main' +
                          (fs.existsSync(parsed.dir + '/main.ts')
                              ? '.ts'
                              : '.js')
                        : null,
                setup:
                    fs.existsSync(parsed.dir + '/setup.ts') ||
                    fs.existsSync(parsed.dir + '/setup.js')
                        ? parsed.dir +
                          'setup' +
                          (fs.existsSync(parsed.dir + '/setup.ts')
                              ? '.ts'
                              : '.js')
                        : null,
                deploy:
                    fs.existsSync(parsed.dir + '/deploy.ts') ||
                    fs.existsSync(parsed.dir + '/deploy.js')
                        ? parsed.dir +
                          'deploy' +
                          (fs.existsSync(parsed.dir + '/deploy.ts')
                              ? '.ts'
                              : '.js')
                        : null,
                client:
                    fs.existsSync(parsed.dir + '/client.ts') ||
                    fs.existsSync(parsed.dir + '/client.js')
                        ? parsed.dir +
                          'client' +
                          (fs.existsSync(parsed.dir + '/client.ts')
                              ? '.ts'
                              : '.js')
                        : null,
            };

            includedGems[parsed.name] = {
                name: parsed.name,
                metadata,
                pages,
                modules,
                scripts,
                components,
                deployScripts,
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
    loadedGems = includedGems;
    return includedGems;
};

/**
 *
 * @returns
 */
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
