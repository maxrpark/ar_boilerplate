declare module "mindar-face-three" {
  import * as THREE from "three";

  interface MaterialWithTexture extends THREE.Material {
    map: THREE.Texture;
  }

  export class MindARThree {
    constructor(options: { container: HTMLElement });

    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    addFaceMesh: () => THREE.Mesh<THREE.BufferGeometry, MaterialWithTexture>;
    addAnchor(index: number): {
      group: THREE.Group;
      onTargetFound: () => void;
      onTargetLost: () => void;
    };
    start(): Promise<void>;

    // Add other methods and properties as needed
  }

  export default MindARThree;
}
