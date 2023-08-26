import { Loader } from "./utils/resourcesLoader.js";

export const sources = [
  {
    type: Loader.GLTF_LOADER,
    path: "../assets/models/wordCupModel/scene.gltf",
    name: "model",
  },
  {
    type: Loader.RGBE_LOADER,
    name: "environmentMap",
    path: "../assets/environments/bg_map_2.hdr",
  },
];
