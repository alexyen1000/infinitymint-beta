import { readSession, log, getConfigFile, findFiles } from "./helpers";
import {
	InfinityMintProject,
	InfinityMintDeployedProject,
	InfinityMintCompiledProject,
	InfinityMintTempProject,
	InfinityMintProjectJavascript,
	KeyValue,
} from "./interfaces";
import path from "path";
import { Dictionary } from "form-data";
import fs, { PathLike } from "fs";

/**
 *
 * @returns
 */
export const getCurrentProject = (cleanCache?: boolean) => {
	return requireProject(
		getCurrentProjectPath().dir + "/" + getCurrentProjectPath().base,
		getCurrentProjectPath().ext === ".js",
		cleanCache
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
	if (!getCurrentProjectPath()) throw new Error("no current project");

	return getDeployedProject(getCurrentProjectPath().name);
};

/**
 * Returns a compiled InfinityMintProject ready to be deployed, see {@link app/interfaces.InfinityMintProject}.
 * @param projectName
 * @throws
 */
export const getCompiledProject = (projectName: string) => {
	let res = require(process.cwd() +
		"/projects/compiled/" +
		projectName +
		".compiled.json");
	res = res.default || res;
	//
	if (!res.compiled)
		throw new Error(`project ${projectName} has not been compiled`);

	return res as InfinityMintCompiledProject;
};

export const hasTempDeployedProject = (projectName: string) => {
	return fs.existsSync(
		process.cwd() + "/temp/projects/" + projectName + ".temp.json"
	);
};

export const hasTempCompiledProject = (projectName: string) => {
	return fs.existsSync(
		process.cwd() + "/temp/projects/" + projectName + ".compiled.temp.json"
	);
};

export const saveTempDeployedProject = (project: InfinityMintProject) => {
	log("saving " + project.name + ".temp.json", "fs");
	fs.writeFileSync(
		process.cwd() + "/temp/projects/" + project.name + ".temp.json",
		JSON.stringify(project)
	);
};

export const saveTempCompiledProject = (project: InfinityMintProject) => {
	log("saving " + project.name + ".compiled.temp.json", "fs");
	fs.writeFileSync(
		process.cwd() +
			"/temp/projects/" +
			project.name +
			".compiled.temp.json",
		JSON.stringify(project)
	);
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
			"/temp/projects/" +
			projectName +
			".temp.deployed.json");
		res = res.default || res;
		return res as InfinityMintTempProject;
	} catch (error) {
		throw new Error(
			"could not load temp deployed project: " + error.message
		);
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
			"/temp/projects/" +
			projectName +
			".temp.compiled.json");
		res = res.default || res;

		return res as InfinityMintTempProject;
	} catch (error) {
		throw new Error(
			"could not load temp deployed project: " + error.message
		);
	}
};

/**
 * Returns a deployed InfinityMintProject, see {@link app/interfaces.InfinityMintProject}.
 * @param projectName
 */
export const getDeployedProject = (projectName: string, version?: any) => {
	let res = require(process.cwd() +
		"/projects/deployed/" +
		projectName +
		`@${version}.json`);
	res = res.default || res;
	//
	if (!res.deployed)
		throw new Error(`project ${projectName} has not been deployed`);

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
	if (!fs.existsSync(process.cwd() + "/temp/project_cache.json"))
		return {
			updated: Date.now(),
			database: {},
			keys: {},
		};

	return JSON.parse(
		fs.readFileSync(process.cwd() + "/temp/project_cache.json", {
			encoding: "utf-8",
		})
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

	projects.forEach((path) => {
		let project = requireProject(
			path.dir + "/" + path.base,
			path.ext === ".js"
		);
		let name = (project.name || path.name) + "#" + path.dir;
		if (cache.database[name]) {
			name =
				name +
				"_" +
				Object.keys(cache.database).filter((key) => key === name)
					.length;
			cache.database[name];
		} else cache.database[name] = path;

		cache.keys[path.dir + "/" + path.base] = name;
		cache.keys[path.dir + "/" + path.name] = name;
		cache.keys["/" + path.name] = name;
		cache.keys["/projects/" + path.name] = name;
		cache.keys["/projects/" + path.base] = name;
		cache.keys["/" + path.base] = name;
		cache.keys[path.name] = name;
	});

	fs.writeFileSync(
		process.cwd() + "/temp/projects_cache.json",
		JSON.stringify(cache)
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
		process.cwd() + "/projects/",
		...(config.roots || []).map(
			(root: string) =>
				process.cwd() +
				"/" +
				root +
				(root[root.length - 1] !== "/" ? "/projects/" : "projects/")
		),
	];

	let projects = [];
	for (let i = 0; i < roots.length; i++) {
		projects = [
			...projects,
			...(await findFiles(roots[i] + "**/*.ts")),
			...(await findFiles(roots[i] + "**/*.js")),
		];
	}

	return projects.map((filePath) => path.parse(filePath));
};

/**
 * Gets a project
 * @param projectNameOrPath
 * @returns
 */
export const getProject = (projectNameOrPath: string) => {
	let projects = getProjects();

	if (projects.keys[projectNameOrPath] === undefined)
		throw new Error("cannot find path or name: " + projectNameOrPath);

	let projectName = projects.keys[projectNameOrPath];
	if (projects.database[projectName] === undefined)
		throw new Error("cannot find: " + projectName);

	return requireProject(
		projects.database[projectName].dir +
			"/" +
			projects.database[projectName].base,
		projects.database[projectName].ext === ".js",
		true
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
	clearCache?: boolean
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
	if (!getCurrentProjectPath()) throw new Error("no current project");

	return getCompiledProject(getCurrentProjectPath().name);
};
