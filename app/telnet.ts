import { InfinityMintTelnetOptions, KeyValue } from "./interfaces";
import { createHash } from "node:crypto";
import fs from "fs";
import { Blessed, BlessedElement, getConfigFile, warning } from "./helpers";
import InfinityConsole from "./console";
import { Dictionary } from "form-data";
import { logDirect } from "./helpers";
import { startInfinityConsole } from "./web3";

const telnet = require("telnet2");
export class TelnetServer {
	private clients: any;
	private consoles: Dictionary<InfinityConsole>;
	private online: Dictionary<boolean>;

	constructor() {
		getUsernames(true);
		this.consoles = {};
		this.clients = {};
		this.online = {};
	}

	/**
	 *
	 * @param username
	 * @param password
	 * @param sessionId
	 * @returns
	 */
	public login(username: string, password: string, sessionId: string) {
		logDirect("Logging in " + username + ` <${sessionId}>`);
		try {
			loginUser(
				username,
				password,
				this.clients[sessionId].remoteAddress,
				sessionId
			);
			this.online[username] = true;
			this.consoles[sessionId].setUser(usernames[username]);
			this.consoles[sessionId].setSession(sessions[sessionId]);
		} catch (error) {
			return error.message;
		}

		return true;
	}

	public logout(sessionId: string) {
		if (!sessions[sessionId]) return;

		logDirect("Logging out " + sessionId);

		let session = sessions[sessionId];
		this.online[session.username] = false;
		delete sessions[sessionId];
	}

	/**
	 * Returns the session of a username, or unefined if none is found
	 * @param username
	 * @returns
	 */
	public findSession(username: string) {
		let _sessions = Object.values(sessions);
		for (let i = 0; i < _sessions.length; i++) {
			if (_sessions[i].username === username) return _sessions[i];
		}
		return undefined;
	}

	public getClient(sessionId: string) {
		return this.clients[sessionId];
	}

	public getConsole(sessionId: string) {
		return this.consoles[sessionId];
	}

	public register(username: string, password: string, sessionId: string) {
		let config = getConfigFile();
		try {
			register(
				username,
				password,
				this.clients[sessionId],
				//make the first user admin
				Object.values(username).length === 0
					? "admin"
					: (config.telnet as InfinityMintTelnetOptions)
							.defaultGroup || "user"
			);
			//save the usernames file
			saveUsernames();
		} catch (error) {
			return error.message;
		}
	}

	async start(port?: number) {
		telnet({ tty: true }, (client) => {
			logDirect(`\n🚀 New Client Detected`);
			(async () => {
				let screen: BlessedElement;
				let infinityConsole: InfinityConsole;
				let sessionId: string;
				try {
					infinityConsole = await startInfinityConsole({
						blessed: {
							smartCSR: true,
							input: client,
							output: client,
							terminal: "xterm-256color",
							fullUnicode: true,
						},
					});
					sessionId = infinityConsole.getSessionId();
					this.clients[sessionId] = client;
					this.consoles[sessionId] = infinityConsole;
					screen = infinityConsole.getScreen();
					infinityConsole.setClient(client);

					client.on("term", (terminal) => {
						screen.terminal = terminal;
						screen.render();
					});

					//when its resizes
					client.on("size", (width, height) => {
						client.columns = width;
						client.rows = height;
						client.emit("resize");
					});

					//when the client closes
					client.on("close", () => {
						try {
							if (this.clients || this.clients[sessionId])
								delete this.clients[sessionId];

							if (this.consoles || this.consoles[sessionId]) {
								this.consoles[sessionId]?.destroy();
								delete this.consoles[sessionId];
							}
						} catch (error) {
							logDirect("💥 warning: " + error.message);
						}

						logDirect(
							`💀 Disconnected ${
								client.remoteAddress ||
								client.input.remoteAddress
							}\n`
						);
					});

					//screen on
					screen.on("destroy", () => {
						if (client.writable) {
							client.destroy();
						}

						logDirect(
							`⚰️ Screen Destroyed ${
								client.remoteAddress ||
								client.input.remoteAddress
							}`
						);
					});

					if (!hasLoggedIn(client, sessionId))
						infinityConsole.gotoWindow("Login");

					logDirect(
						`🦊 Successful Connection ${
							client.remoteAddress ||
							client.output.remoteAddress ||
							client.input.remoteAddress
						}<${sessionId}>`
					);
				} catch (error) {
					logDirect(
						`💥 error<${client.input.remoteAddress}>:\n${error.stack}`
					);

					if (client.writable) {
						client.destroy();
					}
				}
			})();
		}).listen(port || 1337);
		logDirect(
			"🟢 Telnet Server Online! enter line below to connect\n\tbrew install telnet && telnet localhost " +
				port
		);
	}
	reload() {}
}

export interface UserEntry {
	username: string;
	password: string;
	salt: string;
	client: any;
	group: string;
}
export const register = (
	username: string,
	password: string,
	client: any,
	group: string
) => {
	if (usernames[username])
		throw new Error("username already taken: " + username);

	let salt = createHash("md5")
		.update(btoa((Math.random() * Math.random() * Date.now()).toString()))
		.digest("hex");

	let saltedPassword = createHash("sha512")
		.update(btoa(salt + password))
		.digest("hex");

	usernames[username] = {
		username,
		salt,
		password: saltedPassword,
		client: client,
		group,
	} as UserEntry;

	return usernames[username];
};

export const saveUsernames = () => {
	fs.writeFileSync(
		process.cwd() + "/temp/username_list.json",
		JSON.stringify(usernames)
	);
};

export interface SessionEntry {
	username: string;
	sessionId: string;
	creation: number;
	remoteAddress: string;
	group: string;
}

export let sessions: Dictionary<SessionEntry> = {};
export const loginUser = (
	username: string,
	password: string,
	remoteAddress: string,
	sessionId: string
) => {
	if (sessions[sessionId]) throw new Error("session has already begun");
	if (!usernames[username]) throw new Error("bad username or password");

	let user = usernames[username];

	let hash = createHash("sha512")
		.update(user.salt + password)
		.digest("hex");

	if (hash !== user.password) throw new Error("bad username or password");

	sessions[sessionId] = {
		username,
		remoteAddress,
		sessionId,
		group: user.group,
	} as SessionEntry;

	return sessions[sessionId];
};

export const readUsernameList = () => {
	if (!fs.existsSync(process.cwd() + "/temp/username_list.json"))
		return {} as typeof usernames;

	return JSON.parse(process.cwd() + "/temp/username_list.json");
};

export let usernames: Dictionary<UserEntry>;
export const getUsernames = (useFresh?: boolean) => {
	if (!usernames || useFresh) {
		usernames = readUsernameList();
	}
	return usernames;
};

/**
 *
 * @param client
 * @returns
 */
export const hasLoggedIn = (client: any, sessionId: any) => {
	return getSession(client, sessionId) !== undefined;
};

/**
 *
 * @param client
 * @returns
 */
export const getSession = (client: any, sessionId?: any): SessionEntry => {
	return Object.values(sessions).filter(
		(entry) =>
			client.remoteAddress === entry.remoteAddress &&
			(sessionId ? entry.sessionId === sessionId : true)
	)[0];
};
