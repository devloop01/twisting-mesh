import GL from "./gl";
import Type from "./gl/Type";

// shaders
import shaders from "./gl/shaders";

// Fonts
import file from "../assets/ArchivoBlack-Regular.fnt";
import atlas from "../assets/ArchivoBlack-Regular.png";

const OPTION_DEFAULTS = {
	position: {
		texture: [-0.945, -0.5, 0],
		mesh: [0, 0, 0],
	},
	scale: [0.012, 0.04, 1],
	shaders: {
		vertex: shaders.vertex,
		fragment: shaders.fragment,
	},
	font: {
		file,
		atlas,
	},
};
const options = [
	{
		word: "HOME",
		color: "#ffffff",
		fill: "#0466c8",
		geometry: new THREE.BoxGeometry(2, 1, 1, 64, 64, 64),
		...OPTION_DEFAULTS,
	},
	{
		word: "WORK",
		color: "#0466c8",
		fill: "#ffffff",
		geometry: new THREE.BoxGeometry(1.9995, 1.0015, 0.9995, 64, 64, 64),
		...OPTION_DEFAULTS,
	},
];

options.forEach((option) => {
	let type = new Type();
	type.init(option);
});
