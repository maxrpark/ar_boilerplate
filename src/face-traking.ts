import * as THREE from "three";
import { MindARThree as MindARThreeFaceTracking } from "mindar-face-three";
import { resourcesLoader } from "./utils/resourcesLoader.js";
import { sources } from "./resourcesFaceMask.js";
// import guiDebugger from "./utils/GUIDebugger.js";
// const debugActive = window.location.hash === "#debug";

let modelObject: THREE.Mesh | null = null;
let occluder: THREE.Mesh | null = null;
let faceMask: THREE.Texture | null = null;
let envMap: THREE.Texture | null = null;
let glassesArea: THREE.Mesh | null = null;

const setResources = async () => {
  try {
    const loadedResources = await resourcesLoader(sources);

    const { model, headOccluder, faceMaskTexture, environmentMap } =
      loadedResources as {
        model: { scene: THREE.Mesh };
        headOccluder: { scene: THREE.Mesh };
        faceMaskTexture: THREE.Texture;
        environmentMap: THREE.Texture;
      };

    occluder = headOccluder.scene;
    faceMask = faceMaskTexture;

    // Model
    modelObject = model.scene;
    modelObject.position.y = 0.2;
    modelObject.rotation.x = 0.2;
    modelObject.scale.set(1.1, 1.1, 1.1);
    modelObject.renderOrder = 1;

    // ocluder

    const occluderMaterial = new THREE.MeshBasicMaterial({ colorWrite: false });
    occluder.traverse((item) => {
      if (item instanceof THREE.Mesh) {
        item.material = occluderMaterial;
      }
    });

    occluder.renderOrder = 0;
    occluder.scale.set(0.065, 0.065, 0.065);
    occluder.position.set(0.0, -0.3, 0.15);

    envMap = environmentMap;

    envMap.mapping = THREE.EquirectangularReflectionMapping;

    start();
  } catch (error) {
    console.log(error);
  }
};

document.addEventListener("DOMContentLoaded", () => setResources());

const start = async () => {
  if (!occluder || !modelObject || !faceMask || !envMap) return;

  const mindarThree = new MindARThreeFaceTracking({
    container: document.body,
  });

  const { renderer, scene, camera } = mindarThree;

  // RENDERER
  renderer.outputColorSpace;
  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // SCENE

  // THE BOILERPLATE USES environment for lighting.n
  scene.environment = envMap;

  const anchorOcluder = mindarThree.addAnchor(6);
  anchorOcluder.group.add(occluder);

  const anchor = mindarThree.addAnchor(6);
  anchor.group.add(modelObject);

  console.log(anchor);

  // const faceMaskAnchor = mindarThree.addFaceMesh();
  // faceMaskAnchor.material.transparent = true;
  // faceMaskAnchor.material.map = faceMask;
  // faceMask.needsUpdate = true;

  // scene.add(faceMaskAnchor);

  // MindAr events
  // anchor.onTargetFound = () => {
  //   // console.log("hey");
  // };
  // anchor.onTargetLost = () => {};

  await mindarThree.start();

  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
};
