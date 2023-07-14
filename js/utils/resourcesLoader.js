import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
export var Loader;
(function (Loader) {
    Loader["RGBE_LOADER"] = "rgbeLoader";
    Loader["GLTF_LOADER"] = "gltfLoader";
})(Loader || (Loader = {}));
const loaders = {
    [Loader.GLTF_LOADER]: new GLTFLoader(),
    [Loader.RGBE_LOADER]: new RGBELoader(),
};
export const resourcesLoader = (assets) => {
    const items = {};
    const loadPromises = [];
    for (const item of assets) {
        const loader = loaders[item.type];
        const loadPromise = new Promise((resolve) => {
            loader.load(item.path, (file) => {
                items[item.name] = file;
                resolve();
            });
        });
        loadPromises.push(loadPromise);
    }
    return Promise.all(loadPromises).then(() => {
        const loaderWrapper = document.querySelector(".assets-loader-wrapper");
        loaderWrapper.style.display = "none";
        return items;
    });
};
//# sourceMappingURL=resourcesLoader.js.map