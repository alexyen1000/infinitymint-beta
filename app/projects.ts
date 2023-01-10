import {
	readSession,
	log,
	getConfigFile,
	findFiles,
	write,
	logDirect,
} from './helpers';
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
	if (!getCurrentProject()) throw new Error('no current project');

	return getDeployedProject(getCurrentProject());
};

/**
 * Returns a compiled InfinityMintProject ready to be deployed, see {@link app/interfaces.InfinityMintProject}.
 * @param projectName
 * @throws
 */
export const getCompiledProject = (
	project: InfinityMintProject | InfinityMintTempProject,
	version?: string,
) => {
	version = version || '1.0.0';
	let projectName = getProjectName(project);
	let filename = `/projects/compiled/${projectName}@${version}.json`;
	let res = require(process.cwd() + filename);
	res = res.default || res;
	//
	if (!res.compiled)
		throw new Error(`project ${projectName} has not been compiled`);

	return res as InfinityMintCompiledProject;
};

export const hasTempDeployedProject = (
	project: InfinityMintProject | InfinityMintTempProject,
	version?: string,
) => {
	let projectName = getProjectName(project);
	version = version || '1.0.0';
	let filename = `/temp/projects/${projectName}@${version}.deployed.temp.json`;
	logDirect(filename);
	return fs.existsSync(process.cwd() + filename);
};

export const getProjectName = (
	project: InfinityMintProject | InfinityMintTempProject,
) => {
	return (
		project.name ||
		(project as any)?.description?.name ||
		path.parse(project?.source).name
	);
};

export const hasTempCompiledProject = (
	project: InfinityMintProject | InfinityMintTempProject,
	version?: string,
) => {
	let projectName = getProjectName(project);
	version = version || '1.0.0';
	let filename = `/temp/projects/${projectName}@${version}.compiled.temp.json`;

	return fs.existsSync(process.cwd() + filename);
};

export const saveTempDeployedProject = (project: InfinityMintTempProject) => {
	let filename = `/temp/projects/${project.name}@${project.version.version}.deployed.temp.json`;
	write(filename, project);
};

export const saveTempCompiledProject = (project: InfinityMintTempProject) => {
	let filename = `/temp/projects/${project.name}@${project.version.version}.compiled.temp.json`;
	write(filename, project);
};

/**
 * Returns a temporary deployed InfinityMintProject which can be picked up and completed.
 * @param projectName
 * @returns
 * @throws
 */
export const getTempDeployedProject = (
	project: InfinityMintProject,
	version?: string,
) => {
	version = version || '1.0.0';
	let projectName = getProjectName(project);
	let filename = `/temp/projects/${projectName}@${version}.deployed.temp.json`;
	try {
		let res = require(process.cwd() + filename);
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
export const getTempCompiledProject = (
	project: InfinityMintProject,
	version?: string,
) => {
	version = version || '1.0.0';
	let projectName = getProjectName(project);
	let filename = `/temp/projects/${projectName}@${version}.compiled.temp.json`;
	try {
		let res = require(process.cwd() + filename);
		res = res.default || res;
		return res as InfinityMintTempProject;
	} catch (error) {
		throw new Error('could not load temp compiled project: ' + error.message);
	}
};

/**
 * Returns a deployed InfinityMintProject, see {@link app/interfaces.InfinityMintProject}.
 * @param projectName
 */
export const getDeployedProject = (
	project: InfinityMintProject,
	version?: any,
) => {
	version = version || '1.0.0';

	let projectName = getProjectName(project);
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
	if (!fs.existsSync(process.cwd() + '/temp/projects_cache.json'))
		return {
			updated: Date.now(),
			database: {},
			keys: {},
		};

	return JSON.parse(
		fs.readFileSync(process.cwd() + '/temp/projects_cache.json', {
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
		let projectName =
			project.name || (project as any)?.description?.name || path.name;
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
		cache.keys[projectName] = name;
		cache.keys[projectName + '@' + (project?.version?.version || '1.0.0')] =
			name;
		cache.keys[
			projectName +
				'@' +
				(project?.version?.version === '1.0.0' ||
				project?.version?.tag === 'initial'
					? 'initial'
					: '')
		] = name;
		cache.keys[projectName + '@source'] = name;
		cache.keys[projectName + path.ext] = name;
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
	let project = script.args?.project?.value
		? getProject(script.args?.project?.value)
		: script.project;

	if (
		!script.args?.dontUseTemp?.value &&
		type === 'source' &&
		hasTempCompiledProject(project, version)
	) {
		script.infinityConsole.log(
			'{yellow-fg}found previous compiled project attempting to retry{yellow-fg}',
		);
		return getTempCompiledProject(project, version);
	}

	if (
		!script.args?.dontUseTemp?.value &&
		!type &&
		hasTempDeployedProject(project, version)
	) {
		script.infinityConsole.log(
			'{yellow-fg}found previous deployed project attempting to retry{yellow-fg}',
		);
		return getTempDeployedProject(project, version);
	}

	return !type || type === 'source'
		? (project as InfinityMintTempProject)
		: getTempDeployedProject(project, version);
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

	let result = requireProject(
		projects.database[projectName].dir +
			'/' +
			projects.database[projectName].base,
		projects.database[projectName].ext === '.js',
		true,
	);
	if (!result.name) result.name = projects.database[projectName].name;

	return result as InfinityMintProject;
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
	res.source = projectPath;
	res.name =
		res.name ||
		res.description?.name ||
		path.parse(projectPath.toString()).name;
	if (isJavaScript) return res as InfinityMintProjectJavascript;
	return res as InfinityMintProject;
};

/**
 *
 * @returns
 */
export const getCurrentCompiledProject = () => {
	if (!getCurrentProject()) throw new Error('no current project');
	return getCompiledProject(getCurrentProject());
};
