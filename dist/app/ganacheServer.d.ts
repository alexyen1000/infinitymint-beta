import { Web3Provider } from "@ethersproject/providers";
import { Server, ServerOptions } from "ganache";
declare const GanacheServer: {
    server?: Server<"ethereum"> | undefined;
    options?: ServerOptions<"ethereum"> | undefined;
    port?: number | undefined;
    provider?: Web3Provider | undefined;
    start(options: ServerOptions, port?: number): Promise<Web3Provider>;
    getProvider(): Web3Provider;
};
export default GanacheServer;
//# sourceMappingURL=ganacheServer.d.ts.map