export const mockWithImage = (path: string) => {
  navigator.mediaDevices.getUserMedia = () => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.setAttribute("id", "test-img");
      const context = canvas.getContext("2d");

      const image = new Image();
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context!.drawImage(image, 0, 0, image.width, image.height);
        const stream = canvas.captureStream();

        resolve(stream);
      };
      image.src = path;
    });
  };
};

export const setARTestImage = (path: string, callback: () => void) => {
  const testButton = document.createElement("button");
  testButton.textContent = "Start";
  testButton.style.zIndex = "10";
  testButton.style.position = "absolute";
  testButton.style.top = "50%";
  testButton.style.left = "50%";
  testButton.style.transform = "translate(-50%,-50%)";
  testButton.style.padding = "1rem 2rem";
  testButton.style.fontSize = "1.25rem";
  testButton.style.color = "white";
  testButton.style.background = "black";
  testButton.style.border = "none";

  testButton.addEventListener("click", () => {
    mockWithImage(path);
    callback();
    testButton.style.display = "none";
  });
  document.body.appendChild(testButton);
};
