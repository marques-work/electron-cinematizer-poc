import * as THREE from "three";
import POINT_TEXTURE from "views/images/disc.png";

const PARTICLE_SIZE = 20;

// Native WebGL code
const VERTEX_SHADER = `
  attribute float size;
  attribute vec3 customColor;

  varying vec3 vColor;

  void main() {
    vColor = customColor;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = size * ( 300.0 / -mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Native WebGL code
const FRAGMENT_SHADER = `
  uniform vec3 color;
  uniform sampler2D pointTexture;

  varying vec3 vColor;

  void main() {
    gl_FragColor = vec4( color * vColor, 1.0 );
    gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
    if ( gl_FragColor.a < ALPHATEST ) discard;
  }
`;

class PointCube {
  mouse = null

  setup(view, container) {
    const { camera, renderer } = view.setup({
      fov: 45, near: 1, far: 10000, camZPos: 250,
    });

    const scene = new THREE.Scene();

    const { vertices } = new THREE.BoxGeometry(200, 200, 200, 16, 16, 16);

    const positions = new Float32Array(vertices.length * 3);
    const colors = new Float32Array(vertices.length * 3);
    const sizes = new Float32Array(vertices.length);

    const color = new THREE.Color();

    for (let i = 0, vertex, l = vertices.length; i < l; i++) {
      vertex = vertices[i];
      vertex.toArray(positions, i * 3);

      color.setHSL(0.01 + 0.1 * (i / l), 1.0, 0.5);
      color.toArray(colors, i * 3);

      sizes[i] = PARTICLE_SIZE * 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("customColor", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    //

    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xffffff) },
        pointTexture: { value: new THREE.TextureLoader().load(POINT_TEXTURE) },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      alphaTest: 0.9,
    });

    //

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    //
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    //

    const raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    document.addEventListener("mousemove", this.mouseMoveHandler, false);

    let intersections;
    let intersectedPoint = null;

    view.animate(() => {
      particles.rotation.x += 0.0005;
      particles.rotation.y += 0.001;

      const { attributes } = particles.geometry;

      raycaster.setFromCamera(this.mouse, camera);

      intersections = raycaster.intersectObject(particles);

      if (intersections.length > 0) {
        if (intersectedPoint !== intersections[0].index) {
          attributes.size.array[intersectedPoint] = PARTICLE_SIZE;

          intersectedPoint = intersections[0].index;

          attributes.size.array[intersectedPoint] = PARTICLE_SIZE * 1.25;
          attributes.size.needsUpdate = true;
        }
      } else if (intersectedPoint !== null) {
        attributes.size.array[intersectedPoint] = PARTICLE_SIZE;
        attributes.size.needsUpdate = true;
        intersectedPoint = null;
      }

      renderer.render(scene, camera);
    });
  }

  teardown() {
    document.removeEventListener("mousemove", this.mouseMoveHandler, false);
  }

  mouseMoveHandler = (event) => {
    event.preventDefault();

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };
}

export default new PointCube();
