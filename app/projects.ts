import {readSession, log, getConfigFile, findFiles, write} from './helpers';
import {
	InfinityMintProject,
	InfinityMintDeployedProject,
	InfinityMintCompiledProject,
	InfinityMintTempProject,
	InfinityMintProjectJavascript,
	KeyValue,
	InfinityMintScriptParameters,
} from './interfaces';
import path from 'path';
import {Dictionary} from 'form-data';
import fs, {PathLike} from 'fs';

/**
 *
 * @returns
 */
export const getCurrentProject = (cleanCache?: boolean) => {
	if (getCurrentProjectPath() === undefined)
		throw new Error('no current project');

	return requireProject(
		getCurrentProjectPath().dir + '/' + getCurrentProjectPath().base,
		getCurrentProjectPath().ext === '.js',
		cleanCache,
	);
};

/**
 * Returns the current project
 * @returns
 */
export const getCurrentProjectPath = () => {
	let session = readSession();

	if (!session.environment.project) return undefined;
	return session.environment.project as path.ParsedPath;
};

export const getCurrentDeployedProject = () => {
	if (!getCurrentProjectPath()) throw new Error('no current project');

	return getDeployedProject(getCurrentProjectPath().name);
};

/**
 * Returns a compiled InfinityMintProject ready to be deployed, see {@link app/interfaces.InfinityMintProject}.
 * @param projectName
 * @throws
 */
export const getCompiledProject = (projectName: string, version?: string) => {
	version = version || '1.0.0';
	let filename = `/projects/compiled/${projectName}@${version}.json`;
	let res = require(process.cwd() + filename);
	res = res.default || res;
	//
	if (!res.compiled)
		throw new Error(`project ${projectName} has not been compiled`);

	return res as InfinityMintCompiledProject;
};

export const hasTempDeployedProject = (
	projectName: string,
	version?: string,
) => {
	version = version || '1.0.0';
	let filename = `/temp/projects/${projectName}@${version}.deployed.temp.json`;
	return fs.existsSync(process.cwd() + filename);
};

export const hasTempCompiledProject = (
	projectName: string,
	version?: string,
) => {
	version = version || '1.0.0';
	let filename = `/temp/projects/${projectName}@${version}.deployed.temp.json`;
	return fs.existsSync(process.cwd() + filename);
};

export const saveTempDeployedProject = (project: InfinityMintTempProject) => {
	let filename = `/temp/projects/${project.name}@${project.version}.deployed.temp.json`;
	write(filename, project);
};

export const saveTempCompiledProject = (project: InfinityMintTempProject) => {
	let filename = `/temp/projects/${project.name}@${project.version}.compiled.temp.json`;
	write(filename, project);
};

/**
 * Returns a temporary deployed InfinityMintProject which can be picked up and completed.
 * @param projectName
 * @returns
 * @throws
 */
export const getTempDeployedProject = (projectName: string) => {
	try {
		let res = require(process.cwd() +
			'/temp/projects/' +
			projectName +
			'.temp.deployed.json');
		res = res.default || res;
		return res as InfinityMintTempProject;
	} catch (error) {
		throw new Error('could not load temp deployed project: ' + error.message);
	}
};

/**
 * Returns a temporary compiled InfinityMintProject which can be picked up and completed.
 * @param projectName
 * @returns
 * @throws
 */
export const getTempCompiledProject = (projectName: string) => {
	try {
		let res = require(process.cwd() +
			'/temp/projects/' +
			projectName +
			'.temp.compiled.json');
		res = res.default || res;

		return res as InfinityMintTempProject;
	} catch (error) {
		throw new Error('could not load temp deployed project: ' + error.message);
	}
};

/**
 * Returns a deployed InfinityMintProject, see {@link app/interfaces.InfinityMintProject}.
 * @param projectName
 */
export const getDeployedProject = (projectName: string, version?: any) => {
	version = version || '1.0.0';
	let filename = `/projects/deployed/${projectName}@${version}.json`;
	let res = require(process.cwd() + filename);
	res = res.default || res;
	//
	if (!res.compiled)
		throw new Error(`project ${projectName} has not been compiled`);

	return res as InfinityMintDeployedProject;
};

export interface ProjectCache {
	updated: number;
	database: Dictionary<path.ParsedPath>;
	keys: Dictionary<string>;
}

/**
 *
 * @returns
 */
export const readProjects = (): ProjectCache => {
	if (!fs.existsSync(process.cwd() + '/temp/project_cache.json'))
		return {
			updated: Date.now(),
			database: {},
			keys: {},
		};

	return JSON.parse(
		fs.readFileSync(process.cwd() + '/temp/project_cache.json', {
			encoding: 'utf-8',
		}),
	) as ProjectCache;
};

/**
 *
 * @param projects
 */
export const saveProjects = (projects: path.ParsedPath[]) => {
	let cache = {
		updated: Date.now(),
		database: {},
		keys: {},
	};

	projects.forEach(path => {
		let project = requireProject(
			path.dir + '/' + path.base,
			path.ext === '.js',
		);
		let name = (project.name || path.name) + '@' + path.dir;
		if (cache.database[name]) {
			name =
				name +
				'_' +
				Object.keys(cache.database).filter(key => key === name).length;
			cache.database[name];
		} else cache.database[name] = path;

		let root: string | string[] = path.dir.split('projects');
		if (root.length > 2) root.slice(1).join('projects');
		else root = root[1];
		let nss = root[0] === '/' ? (root as string).substring(1) : root;

		cache.keys[path.dir + '/' + path.base] = name;
		cache.keys[path.dir + '/' + path.name] = name;
		cache.keys['/' + path.name] = name;
		cache.keys['/' + path.base] = name;
		cache.keys['/projects/' + path.name] = name;
		cache.keys['/projects/' + path.base] = name;
		cache.keys[process.cwd() + '/' + path.name] = name;
		cache.keys[process.cwd() + '/' + path.base] = name;
		cache.keys[process.cwd() + '/projects/' + path.name] = name;
		cache.keys[process.cwd() + '/projects/' + path.base] = name;
		cache.keys[root + '/' + path.name] = name;
		cache.keys[root + '/' + path.base] = name;
		cache.keys[nss + '/' + path.name] = name;
		cache.keys[nss + '/' + path.base] = name;
		cache.keys[path.name] = name;
		cache.keys[path.name + '@' + (project?.version?.version || '1.0.0')] = name;
		cache.keys[
			path.name +
				'@' +
				(project?.version?.version === '1.0.0' ||
				project?.version?.tag === 'initial'
					? 'initial'
					: '')
		] = name;
		cache.keys[path.name + '@source'] = name;
		cache.keys[path.base] = name;
	});

	fs.writeFileSync(
		process.cwd() + '/temp/projects_cache.json',
		JSON.stringify(cache),
	);

	return cache;
};

let projectCache: ProjectCache;
export const getProjects = (useFresh?: boolean) => {
	if (useFresh || !projectCache) projectCache = readProjects();
	return projectCache;
};

/**
 *
 * @param roots
 * @returns
 */
export const findProjects = async (roots?: PathLike[]) => {
	let config = getConfigFile();
	roots = roots || [];
	roots = [
		...roots,
		process.cwd() + '/projects/',
		...(config.roots || []).map(
			(root: string) =>
				process.cwd() +
				'/' +
				root +
				(root[root.length - 1] !== '/' ? '/projects/' : 'projects/'),
		),
	];

	let projects = [];
	for (let i = 0; i < roots.length; i++) {
		projects = [
			...projects,
			...(await findFiles(roots[i] + '**/*.ts')),
			...(await findFiles(roots[i] + '**/*.js')),
		];
	}

	return projects.map(filePath => path.parse(filePath));
};

/**
 *
 * @param script
 * @param type
 * @returns
 */
export const getScriptProject = (
	script: InfinityMintScriptParameters,
	type?: 'deployed' | 'source',
	version?: any,
) => {
	if (script.args.project) {
		if (
			!script.args.dontUseTemp.value &&
			(!type || type === 'source'
				? hasTempCompiledProject(script.args.project.value)
				: hasTempCompiledProject(script.args.project.value))
		) {
			script.log('picking up previous attempt => ' + script.args.project.value);
			return !type || type === 'source'
				? getTempCompiledProject(script.args.project.value)
				: getTempDeployedProject(script.args.project.value);
		} else if (!type || type === 'source')
			return getProject(script.args.project.value) as InfinityMintTempProject;
		else
			return getCompiledProject(
				script.args.project.value,
			) as InfinityMintTempProject;
	} else if (!type || type === 'source')
		return script.project as InfinityMintTempProject;
	else
		return getCompiledProject(script.project.name) as InfinityMintTempProject;
};

/**
 * Gets a project
 * @param projectNameOrPath
 * @returns
 */
export const getProject = (projectNameOrPath: string) => {
	let projects = getProjects();

	if (!projects.keys[projectNameOrPath])
		throw new Error('cannot find path or name: ' + projectNameOrPath);

	let projectName = projects.keys[projectNameOrPath];
	if (!projects.database[projectName])
		throw new Error('cannot find: ' + projectName);

	return requireProject(
		projects.database[projectName].dir +
			'/' +
			projects.database[projectName].base,
		projects.database[projectName].ext === '.js',
		true,
	);
};

/**
 * Returns an InfinityMintProject file relative to the /projects/ folder, see {@link app/interfaces.InfinityMintProject}. Will return type of InfinityMintProjectClassic if second param is true.
 * @param projectName
 * @param isJavaScript
 * @throws
 */
export const requireProject = (
	projectPath: PathLike,
	isJavaScript: boolean,
	clearCache?: boolean,
) => {
	if (clearCache && require.cache[projectPath as string])
		delete require.cache[projectPath as string];

	let res = require(projectPath as string);
	res = res.default || res;
	res.javascript = isJavaScript;

	if (isJavaScript) return res as InfinityMintProjectJavascript;
	return res as InfinityMintProject;
};

/**
 *
 * @returns
 */
export const getCurrentCompiledProject = () => {
	if (!getCurrentProjectPath()) throw new Error('no current project');

	return getCompiledProject(getCurrentProjectPath().name);
};
