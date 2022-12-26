import { Web3Provider } from "@ethersproject/providers";
import { Server, ServerOptions } from "ganache";
export declare class GanacheServer {
    server?: Server;
    options?: ServerOptions;
    port?: number;
    provider?: Web3Provider;
    start(options: ServerOptions, port?: number): Promise<Web3Provider>;
    getProvider(): Web3Provider;
}
declare const _default: GanacheServer;
export default _default;
//# sourceMappingURL=ganacheServer.d.ts.map