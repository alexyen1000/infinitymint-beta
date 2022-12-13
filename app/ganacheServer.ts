import ganache, { ServerOptions } from "ganache";

const GanacheServer = new (class {
	public provider: any;

	start(options: ServerOptions) {
		this.provider = ganache.server(options);
	}
})();
export default GanacheServer;
