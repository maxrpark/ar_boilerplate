import * as THREE from "three";
import { MindARThree } from "mindar-image-three";
import { resourcesLoader } from "./utils/resourcesLoader.js";
import { sources } from "./resources.js";
// import { setARTestImage } from "./utils/helperFunctions.js";

// import guiDebugger from "./utils/GUIDebugger.js";
// const debugActive = window.location.hash === "#debug";

const listener = new THREE.AudioListener();
const audio = new THREE.PositionalAudio(listener);

let worldCup: THREE.Mesh | null = null;
let envMap: THREE.Texture | null = null;

const resources = async () => {
  try {
    const loadedResources = await resourcesLoader(sources);

    const { model, environmentMap } = loadedResources as {
      model: { scene: THREE.Mesh };
      environmentMap: THREE.Texture;
    };

    worldCup = model.scene;
    envMap = environmentMap;

    envMap.mapping = THREE.EquirectangularReflectionMapping;

    start();
  } catch (error) {
    console.log(error);
  }
};
// TEST AR
// setARTestImage("../assets/muchachos.png", resources);

// AR LIVE
document.addEventListener("DOMContentLoaded", () => resources());
const start = async () => {
  if (!worldCup) return;

  const mindarThree = new MindARThree({
    container: document.body,
    imageTargetSrc: "../assets/targets/target.mind",
  });

  const { renderer, scene, camera } = mindarThree;

  // AUDIO
  const sound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load("../assets/muchachos.mp3", function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
  });

  // RENDERER
  renderer.outputColorSpace;
  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // SCENE
  scene.environment = envMap;

  // /// LIGHTS
  // // AMBIENT_LIGHT
  // const ambientLight = new THREE.AmbientLight("#2630ba", 1.02);
  // // DIRECTIONAL_LIGHT
  // const directionalLight = new THREE.DirectionalLight("#fffcf0", 4.223);
  // directionalLight.position.set(3.038, 3.038, 8.692);

  // scene.add(directionalLight, ambientLight);
  // // DEBUGGER
  // if (debugActive)
  //   guiDebugger({
  //     ambientLight,
  //     directionalLight,
  //     renderer,
  //   });

  // MODEL INITIAL POSITION AND ANI
  worldCup.scale.set(0, 0, 0);
  worldCup.position.y = 0.5;

  const anchor = mindarThree.addAnchor(0);
  anchor.group.add(worldCup);

  // AUDIO
  camera.add(listener);
  anchor.group.add(audio);

  audio.setRefDistance(100);
  //@ts-ignore
  let tl = gsap.timeline({ ease: "none", paused: true });

  tl.to(worldCup!.scale, {
    x: 0.002,
    y: 0.002,
    z: 0.002,
    duration: 3,
  })
    .to(worldCup!.position, { y: -0.4, duration: 2 }, 0)
    .set(
      worldCup.rotation,
      {
        y: -2.5,
      },
      0
    );

  anchor.onTargetFound = () => {
    sound.offset = 18;
    sound.play();
    tl.progress(0);
    tl.play();
  };
  anchor.onTargetLost = () => {
    sound.stop();

    tl.reversed(true);
  };

  await mindarThree.start();

  renderer.setAnimationLoop(() => {
    worldCup!.rotation.y += 0.01;
    renderer.render(scene, camera);
  });
};
