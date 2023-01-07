import { InfinityMintWindow } from "../window";
import {
	BlessedElement,
	findProjects,
	getProject,
	log,
	readSession,
	saveSession,
} from "../helpers";
import {
	InfinityMintProject,
	InfinityMintProjectJavascript,
} from "../interfaces";

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

let buildProjectPreview = (
	window: InfinityMintWindow,
	preview: BlessedElement,
	project: InfinityMintProject
) => {
	preview.content = `{bold}{underline}{cyan-fg}${
		project.name ||
		(project as InfinityMintProjectJavascript).description?.name
	}{/underline}{/cyan-fg}{/bold}`;
};

Projects.initialize = async (window, frame, blessed) => {
	let list = window.createElement(
		"form",
		{
			label: "{bold}(Enter/Double-Click to select){/bold}",
			tags: true,
			top: 4,
			left: 0,
			width: "50%",
			height: "100%-8",
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

	let preview = window.createElement(
		"preview",
		{
			tags: true,
			top: 4,
			right: 0,
			width: "50%+2",
			height: "100%-8",
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
		"layout"
	);

	let notice = window.createElement("noPreviewSelected", {
		tags: true,
		top: 6,
		right: 2,
		width: "shrink",
		height: "shrink",
		padding: 2,
		keys: true,
		vi: true,
		content: "{bold}Welcome!{/bold}\nPlease Select A Project To Preview",
		mouse: true,
		border: "line",
		style: {
			bg: "red",
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
	});

	if (window.data.currentProject) notice.hide();

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
		let path = scripts[selected];
		let project = getProject(
			path.dir + "/" + path.base,
			path.ext === ".js"
		);

		window.data.currentProject = project;
		notice.hide();
		buildProjectPreview(window, preview, project);
	});
	list.focus();
};
export default Projects;
