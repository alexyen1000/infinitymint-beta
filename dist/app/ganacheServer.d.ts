import { Web3Provider } from "@ethersproject/providers";
import { Server, ServerOptions } from "ganache";
declare const GanacheServer: {
    server?: Server;
    options?: ServerOptions;
    port?: number;
    provider?: Web3Provider;
    start(options: ServerOptions, port?: number): Promise<Web3Provider>;
    getProvider(): Web3Provider;
};
export default GanacheServer;
//# sourceMappingURL=ganacheServer.d.ts.map