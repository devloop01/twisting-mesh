import * as THREE from "three";
import GL from "./index";

import gsap from "gsap";

// THREE BMFONT TEXT
import loadFont from "load-bmfont";
import createGeometry from "three-bmfont-text";
import MSDFShader from "three-bmfont-text/shaders/msdf";

export default class extends THREE.Object3D {
	init(options) {
		this.opts = {
			word: options.word,
			color: options.color,
			fill: options.fill,
			wordPosition: options.position.texture,
			wordScale: options.scale,
			position: options.position.mesh,
			rotation: options.rotation || [0, 0, 0],
			geometry: options.geometry,
			vertex: options.shaders.vertex,
			fragment: options.shaders.fragment,
			fontFile: options.font.file,
			fontAtlas: options.font.atlas,
		};

		// Create geometry of packed glyphs
		loadFont(this.opts.fontFile, (err, font) => {
			this.fontGeometry = createGeometry({
				font,
				text: this.opts.word,
			});

			// Load texture containing font glyps
			this.loader = new THREE.TextureLoader();
			this.loader.load(this.opts.fontAtlas, (texture) => {
				this.fontMaterial = new THREE.RawShaderMaterial(
					MSDFShader({
						map: texture,
						side: THREE.DoubleSide,
						transparent: true,
						negate: false,
						color: this.opts.color,
					})
				);

				this.createRenderTarget();
				this.createMesh();
				this.twistAndFlip();
			});
		});
	}

	createRenderTarget() {
		// Render Target setup
		this.rt = new THREE.WebGLRenderTarget(
			window.innerWidth,
			window.innerHeight
		);
		this.rtCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
		this.rtCamera.position.z = 2.3;

		this.rtScene = new THREE.Scene();
		this.rtScene.background = new THREE.Color(this.opts.fill);

		this.text = new THREE.Mesh(this.fontGeometry, this.fontMaterial);
		this.text.position.set(...this.opts.wordPosition);
		this.text.rotation.set(Math.PI, 0, 0);
		this.text.scale.set(...this.opts.wordScale);

		this.rtScene.add(this.text);
	}

	createMesh() {
		this.geometry = this.opts.geometry;

		this.material = new THREE.ShaderMaterial({
			vertexShader: this.opts.vertex,
			fragmentShader: this.opts.fragment,
			uniforms: {
				twistAmount: { value: 0 },
				uTexture: { value: this.rt.texture },
			},
			defines: {
				PI: Math.PI,
			},
			// wireframe: true,
			side: THREE.DoubleSide,
		});

		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(...this.opts.position);
		this.mesh.rotation.set(...this.opts.rotation);
		this.mesh.lookAt(new THREE.Vector3());

		this.mesh.onBeforeRender = (renderer) => {
			renderer.setRenderTarget(this.rt);
			renderer.render(this.rtScene, this.rtCamera);
			renderer.setRenderTarget(null);
		};

		this.add(this.mesh);

		GL.scene.add(this);
	}

	twistAndFlip() {
		const twistAmount = 1;
		const rotationAngleFactor = 58;

		const tlDefaults = {
			duration: 0.5,
			ease: "elastic.out(0.8, 1.5)",
		};

		const tl = gsap.timeline({
			delay: 1,
			repeat: -1,
			repeatDelay: 0.5,
			defaults: tlDefaults,
		});

		tl.addLabel("start", 0);
		tl.addLabel("startEnd", tlDefaults.duration);
		tl.addLabel("endStart", tlDefaults.duration * 2 + 0.5);
		tl.addLabel("end", tlDefaults.duration * 3 + 0.5);

		tl.to(
			this.material.uniforms.twistAmount,
			{
				value: twistAmount,
			},
			"start"
		)
			.to(
				this.mesh.rotation,
				{
					x: THREE.MathUtils.degToRad(
						twistAmount * rotationAngleFactor
					),
				},
				"start"
			)
			.to(
				this.material.uniforms.twistAmount,
				{
					value: 0,
				},
				"startEnd"
			)
			.to(
				this.mesh.rotation,
				{
					x: this.mesh.rotation.x - THREE.MathUtils.degToRad(90),
				},
				"startEnd"
			)
			.to(
				this.material.uniforms.twistAmount,
				{
					value: twistAmount,
				},
				"endStart"
			)
			.to(
				this.mesh.rotation,
				{
					x:
						this.mesh.rotation.x -
						THREE.MathUtils.degToRad(
							twistAmount * rotationAngleFactor * 0.55
						),
				},
				"endStart"
			)
			.set(
				this.mesh.rotation,
				{
					z: Math.PI,
				},
				"end"
			)
			.to(
				this.material.uniforms.twistAmount,
				{
					value: 0,
				},
				"end"
			)
			.to(
				this.mesh.rotation,
				{
					x: this.mesh.rotation.x - THREE.MathUtils.degToRad(180),
				},
				"end"
			);
	}
}
