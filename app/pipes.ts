import { ChildProcess } from "child_process";
import { Dictionary } from "form-data";

/**
 * The log pipe class
 */
class Pipe {
	public logs: String[];
	public listen: boolean;
	public save: boolean;
	public appendDate?: boolean;
	private pipe: string;
	private errors: String[];
	private created: number;
	public logHandler: Function;
	public errorHandler: Function;
	public terminationHandler: Function;

	/**
	 *
	 * @param pipe
	 */
	constructor(pipe: string) {
		this.logs = [];
		this.pipe = pipe;
		this.save = true;
		this.listen = false;
		this.errors = [];
		this.appendDate = false;
		this.created = Date.now();
		this.logHandler = (str: string) => {
			if (this.listen) console.log(str, false);
			if (this.appendDate)
				str = `${new Date(Date.now()).toLocaleTimeString()} ` + str;
			this.logs.push(str);
		};
		this.errorHandler = (str: string) => {
			if (this.listen) console.error(str);
			this.errors.push(str);
		};
		this.terminationHandler = () => {};
	}

	toString() {
		return this.pipe;
	}

	getCreation() {
		return new Date(this.created);
	}

	log(msg: string) {
		this.logHandler(msg);
	}

	error(error: string) {
		this.errorHandler(error);
	}
}

/**
 * Interface for the log pipe options
 */
interface PipeOptions {
	save?: boolean;
	listen?: boolean;
	setAsCurrentPipe?: boolean;
	appendDate?: boolean;
}

/**
 * Logging factory class
 */
const Pipes = new (class {
	public logs: Dictionary<Pipe>;
	public currentPipe: string;
	constructor() {
		this.logs = {};
		this.currentPipe = "default";
		//registers the default pipe
		this.registerSimplePipe("default");
	}

	public setCurrentPipe(key: string) {
		if (this.logs[key] === undefined)
			throw new Error("undefined pipe key: " + key);

		this.currentPipe = key;
	}

	public error(error: any) {
		//go back to the default pipe
		if (
			this.currentPipe === undefined ||
			this.logs[this.currentPipe] === undefined
		)
			this.currentPipe = "default";

		this.logs[this.currentPipe].error(error.toString());
	}

	public log(msg: string, pipe?: string) {
		let actualPipe = pipe || this.currentPipe;
		if (this.logs[actualPipe] == undefined)
			throw new Error("bad pipe: " + actualPipe);

		this.logs[actualPipe].log(msg);
	}

	public getPipe(key: string) {
		return this.logs[key];
	}

	public registerSimplePipe(key: string, options?: PipeOptions): Pipe {
		let pipe = this.createPipe(key, options);
		return pipe;
	}

	public closePipe(pipe: string | Pipe) {
		delete this.logs[pipe.toString()];
	}

	public registerPipe(
		key: string,
		process: ChildProcess,
		options?: PipeOptions
	): Pipe {
		let pipe = this.createPipe(key, options);

		process.stdout?.on("data", (str: string) => {
			pipe.log(str);
		});

		process.stderr?.on("data", (str: string) => {
			pipe.error(str);
		});

		process.stdout?.on("end", (code: number) => {
			this.closePipe(pipe);
		});
		return pipe;
	}

	public createPipe(key: string, options?: PipeOptions): Pipe {
		this.logs[key] = new Pipe(key);
		this.logs[key].save = options?.save || true;
		this.logs[key].listen = options?.listen || false;
		this.logs[key].appendDate = options?.appendDate || true;

		if (this.currentPipe === "" || options?.setAsCurrentPipe)
			this.currentPipe = key;

		return this.logs[key];
	}
})();
export default Pipes;
