import * as THREE from "three";
import { MindARThree as MindARThreeFaceTracking } from "mindar-face-three";
import { resourcesLoader } from "./utils/resourcesLoader.js";
import { sources } from "./resourcesFaceMask.js";
let modelObject = null;
let occluder = null;
let faceMask = null;
let envMap = null;
let glassesArea = null;
const setResources = async () => {
    try {
        const loadedResources = await resourcesLoader(sources);
        const { model, headOccluder, faceMaskTexture, environmentMap } = loadedResources;
        occluder = headOccluder.scene;
        faceMask = faceMaskTexture;
        modelObject = model.scene;
        modelObject.position.y = 0.2;
        modelObject.rotation.x = 0.2;
        modelObject.scale.set(1.1, 1.1, 1.1);
        modelObject.renderOrder = 1;
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
    }
    catch (error) {
        console.log(error);
    }
};
document.addEventListener("DOMContentLoaded", () => setResources());
const start = async () => {
    if (!occluder || !modelObject || !faceMask || !envMap)
        return;
    const mindarThree = new MindARThreeFaceTracking({
        container: document.body,
    });
    const { renderer, scene, camera } = mindarThree;
    renderer.outputColorSpace;
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    scene.environment = envMap;
    const anchorOcluder = mindarThree.addAnchor(6);
    anchorOcluder.group.add(occluder);
    const anchor = mindarThree.addAnchor(6);
    anchor.group.add(modelObject);
    console.log(anchor);
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    });
};
//# sourceMappingURL=face-traking.js.map