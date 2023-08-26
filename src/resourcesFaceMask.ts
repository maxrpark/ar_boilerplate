import { Loader } from "./utils/resourcesLoader.js";

export const sources = [
  {
    type: Loader.GLTF_LOADER,
    path: "../assets/models/helmet/helmet.glb",
    name: "model",
  },
  {
    type: Loader.GLTF_LOADER,
    name: "headOccluder",
    path: "../assets/models/occluder/headOccluder.glb",
  },
  {
    type: Loader.TEXTURE_LOADER,
    name: "faceMaskTexture",
    path: "../assets/models/face-mask-template/Face_Mask_Template.png",
  },
  {
    type: Loader.RGBE_LOADER,
    name: "environmentMap",
    path: "../assets/environments/aft_lounge_1k.hdr",
  },
];
