import * as Helpers from "./app/helpers";

async function main() {
	//start InfinityMint here

	console.log(Helpers.getConfig());
}

main()
	.then(() => {
		process.exit(0);
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
