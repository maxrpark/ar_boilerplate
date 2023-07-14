# THREE.js & MINDAR Boilerplate

## About

This repository provides a boilerplate for AR experiences using THREE.js and MINDAR.

### THREE.js

For more information about THREE.js, please refer to their [documentation](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene).

### MINDAR.js

MindAR is an open-source web augmented reality library created by [HiuKim Yuen](https://github.com/hiukim). It supports Image Tracking and Face Tracking.

For more information about the library, please refer to their [documentation](https://hiukim.github.io/mind-ar-js-doc/).

There is a nice course about AR called [Introduction to Web AR Development](https://www.udemy.com/course/introduction-to-web-ar-development/) created by HiuKim Yuen, available on Udemy. Most of the code for this project was inspired by some of the lessons in this course.

### Extra Libraries

This boilerplate includes the CDN for GreenSock and lil-gui. These libraries are used in the project but are totally optional.

## Model

The model used in this boilerplate has been downloaded from Sketchfab. The model's Sketchfab page can be found [here](https://sketchfab.com/3d-models/world-cup-trophy-c4ae2dd470194a81b856ad84620d8beb). The model is attributed to Waimus.

## Resources Loader

The assetsLoader file in this project provides a module for loading and managing assets in your AR experience using THREE.js. It offers a convenient way to load 3D models and textures using the GLTFLoader and RGBELoader provided by THREE.js.

```ts
const resourcesLoader = (assets: SourceInt[]): Promise<ResourceItemsInt> => {
  const items: ResourceItemsInt = {};
  const loadPromises: Promise<void>[] = [];

  for (const item of assets) {
    const loader = loaders[item.type];
    const loadPromise = new Promise<void>((resolve) => {
      loader.load(item.path, (file: FileType) => {
        items[item.name] = file;
        resolve();
      });
    });
    loadPromises.push(loadPromise);
  }

  return Promise.all(loadPromises).then(() => {
    const loaderWrapper: HTMLDivElement = document.querySelector(
      ".assets-loader-wrapper"
    )!;
    loaderWrapper.style.display = "none";
    return items;
  });
};
```

The resourcesLoader function takes the array of asset sources and returns a Promise. Once all assets are loaded, the Promise resolves to an object (loadedAssets) mapping asset names to their corresponding loaded files.

### Loading and Using Assets

To load and use assets in your AR experience, follow these steps:

1- Import the asset loader module in your project:

```js
import { resourcesLoader } from "./assetsLoader.js";
```

2- Define an array of asset sources that you want to load, specifying the type of loader, name, and path for each asset:

```ts
const assets = [
  {
    type: Loader.GLTF_LOADER,
    name: "myModel",
    path: "models/myModel.gltf",
  },
  {
    type: Loader.RGBE_LOADER,
    name: "myTexture",
    path: "textures/myTexture.hdr",
  },
  // Add more asset sources as needed
];
```

3- Declare variables to hold your loaded assets. For example:

```ts
let worldCup: THREE.Mesh | null = null;
let envMap: THREE.Texture | null = null;
```

4- Create an async function, let's call it resources, to handle the loading of assets:

```ts
const resources = async () => {
  try {
    // Load the assets using the resourcesLoader function
    const loadedResources = await resourcesLoader(sources);

    // Access the loaded assets
    const { model, environmentMap } = loadedResources as {
      model: { scene: THREE.Mesh };
      environmentMap: THREE.Texture;
    };

    // Assign the loaded assets to your variables
    worldCup = model.scene;
    envMap = environmentMap;

    // Set the mapping for the environment map
    envMap.mapping = THREE.EquirectangularReflectionMapping;

    // Call the start function or any other logic to begin your AR experience
    start();
  } catch (error) {
    console.log(error);
  }
};
```

5- Finally, call the resources function when the DOM content is loaded:

```ts
document.addEventListener("DOMContentLoaded", () => resources());
```

This will trigger the loading of assets, and once they are loaded, you can access them through the model and envMap variables.

Make sure to replace the start() function call with the appropriate logic to start your AR experience.

### Assets Loader spinner

Since loading some assets like models or textures can take some time, there is an extra loader spinner at the beginning of the experience.
A CSS loader example has been used for this purpose, which can be found [here](https://cssloaders.github.io/)

## Setting a Test Image for AR

If you want to test your AR experience using a test image instead of a live camera feed, you can use the provided utility functions. Here's how you can do it:

1- Import the necessary functions in your code:

```ts
import { setARTestImage } from "./arTestUtils.js";
```

2- Comment out the document.addEventListener("DOMContentLoaded", () => resources()); line.

```ts
// document.addEventListener("DOMContentLoaded", () => resources());
```

3- Define a test image path that points to the image you want to use for testing your AR experience.

4- Call the setARTestImage function to set up a test button and handle the logic for using the test image:

```ts
setARTestImage(testImagePath, start);
```

he setARTestImage function takes two parameters: the testImagePath (the path to your test image) and a resources callback function that will be called when the test button is clicked.

The setARTestImage function creates a button element with the label "Start" and attaches an event listener to it. When the button is clicked, the mockWithImage function is called with the testImagePath to mock the getUserMedia function and create a test stream using a canvas and the test image.

After mocking the image stream, the resources callback function is invoked, and the test button is hidden (style.display = "none").

By using the setARTestImage function during development or testing, you can simulate an AR experience using a test image instead of accessing the user's camera.

Remember to replace testImagePath with the path to your desired test image.

## Project Structure

- `index.html`: The main HTML file that serves as the entry point for the AR experience.

### Assets

- `assets/`: Folder that contains styles, models, textures, or any other static files.
- `assets/models/`: A directory that stores 3D models used in the AR experience.
- `assets/targets/`: A directory for MindAR target images. You can generate target images and learn more about them in the (documentation)[https://hiukim.github.io/mind-ar-js-doc/quick-start/compile].

### Build

- `js/`: Build folder containing the compiled TypeScript code.

### Source Code

- `src/`: Root directory for the TypeScript files.
- `src/main.ts`: The main file that holds all the TypeScript logic to run the AR experience.

### Utilities

- `src/utils/GUIDebugger.ts`: A file that contains a lil.GUI debugger utility.
- `src/utils/helperFunctions.ts`: A file that contains helper functions.

### Asset Loader

- `src/utils/resourcesLoader.ts`: A file that provides an asset loader module for loading and managing assets in the AR experience.

### Resource Information

- `src/resources.ts`:A file containing information about the assets that are going to be loaded using the asset loader.

### Type Definitions

- `src/types/MindARThree.d.ts`: A type definition file for MindARThree.

Feel free to update the folder structure explanation if there are any additional details or specific configurations related to your project.

## Optional Features

The boilerplate provides optional features that allow you to explore different aspects of your AR experience. You can choose to include these features based on your specific requirements. Let's take a look at each of them:

### Environment Lighting

The boilerplate supports environment lighting, which provides a realistic lighting environment for your AR scene. It utilizes an environment map to simulate the reflection and illumination of objects. To enable environment lighting:

Load an environment map using the asset loader. Refer to the Asset Loader section in the README for more information on loading assets.

Assign the loaded environment map to the scene.environment property.

```ts
scene.environment = envMap;
```

The environment lighting enhances the visual realism of your AR experience by providing accurate lighting and reflections.

## Three.js Lights

The boilerplate includes support for various lighting techniques provided by THREE.js. You can choose to enable different types of lights based on your scene's requirements. Here are some of the available light types:

- Ambient Light: Adds ambient illumination to the scene.
- Directional Light: Simulates a distant light source, such as the sun.
- Point Light: Represents a light source that emits light in all directions from a specific point.
- Spot Light: Mimics a focused light beam with a specific direction and cone angle.
  To enable a specific light type:

Create an instance of the desired light type, specifying its properties such as color, intensity, and position.

Add the light to the scene using the scene.add() method.

Adjust the light properties as needed to achieve the desired lighting effect.

Refer to the code comments and relevant documentation within the boilerplate for specific examples and instructions on using different types of lights.

## Animations

The boilerplate offers examples and support for incorporating animations into your AR experience. You can create and control animations to bring your 3D models to life.

To include animations in your AR experience:

Set up your desired animation logic using techniques like gsap or native THREE.js animation capabilities.

## Audio

The boilerplate supports audio playback to enhance your AR experience with sound effects or background music. You can include audio files and have them synchronized with specific events or animations in your scene. To enable audio:

Load an audio file using the asset loader. Refer to the Asset Loader section in the README for more information on loading assets.

Create an instance of THREE.PositionalAudio or THREE.Audio based on your requirements.

Set the audio buffer using the loaded audio file.

Adjust audio properties like volume, loop, and position to customize the audio playback.

Refer to the provided audio code and comments within the boilerplate for specific examples and instructions on incorporating audio into your AR experience.

Feel free to explore and experiment with these optional features to create a rich and immersive AR experience.
