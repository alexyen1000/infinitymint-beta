import * as Helpers from "./app/helpers";
import Console from "./app/console";

async function main() {
	let console = new Console();
	console.initialize();
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
