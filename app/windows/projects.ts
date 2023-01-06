import { InfinityMintWindow } from "../window";
import { findProjects, readSession, saveSession } from "../helpers";

const Projects = new InfinityMintWindow(
	"Projects",
	{
		fg: "white",
		bg: "grey",
		border: {
			fg: "#f0f0f0",
		},
	},
	{
		type: "line",
	}
);
Projects.initialize = async (window, frame, blessed) => {
	let list = window.createElement(
		"form",
		{
			label: "{bold}(Enter/Double-Click to select){/bold}",
			tags: true,
			top: 4,
			left: 0,
			width: "50%",
			height: "100%-" + (frame.bottom + frame.top + 4),
			padding: 2,
			keys: true,
			vi: true,
			mouse: true,
			border: "line",
			scrollbar: {
				ch: " ",
				track: {
					bg: "black",
				},
				style: {
					inverse: true,
				},
			},
			style: {
				bg: "black",
				fg: "white",
				item: {
					hover: {
						bg: "green",
						fg: "black",
					},
				},
				selected: {
					bg: "grey",
					fg: "green",
					bold: true,
				},
			},
		},
		"list"
	);

	let scripts = await findProjects();
	let projects = scripts.map(
		(project) =>
			`${
				project.ext === ".js"
					? "{yellow-fg}js{/yellow-fg}"
					: "{blue-fg}ts{/blue-fg}"
			} {underline}${project.name}{/underline} {gray-fg}(${
				project.dir + "/" + project.base
			}){gray-fg}`
	);
	list.setItems(projects);
	list.on("select", (el: any, selected: any) => {
		let session = readSession();
		session.environment.project = {
			...scripts[selected],
		};
		saveSession(session);
		window.updateFrameTitle();
	});
	list.focus();
};
export default Projects;
