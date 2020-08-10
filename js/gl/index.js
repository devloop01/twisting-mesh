import * as THREE from "three";

export default new (class {
	constructor() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.createScene();
		this.createCamera();

		this.init();
	}

	createScene() {
		this.renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
		});
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
		this.renderer.setSize(this.width, this.height);
		this.renderer.setClearColor(0x001845, 1);

		this.scene = new THREE.Scene();
	}

	createCamera() {
		this.camera = new THREE.PerspectiveCamera(
			45,
			this.width / this.height,
			1,
			1000
		);

		this.camera.position.z = 5;

		this.camera.lookAt(new THREE.Vector3());
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	animate() {
		requestAnimationFrame(this.animate.bind(this));

		this.render();
	}

	addEvents() {
		window.addEventListener("resize", this.resize.bind(this));
	}

	init() {
		this.addToDom();
		this.animate();
		this.addEvents();
	}

	addToDom() {
		const canvas = this.renderer.domElement;
		document.querySelector("#app").appendChild(canvas);
	}

	resize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.width, this.height);
	}
})();
