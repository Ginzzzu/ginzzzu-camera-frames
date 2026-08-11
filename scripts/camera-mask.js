import {
  APPEARANCE_CHANGED_HOOK,
  CAMERA_SHAPE,
  getWorldAppearance,
  MODULE_ID
} from "./camera-settings.js";

const CAMERA_CIRCLE_CLASS = `${MODULE_ID}--circle`;
const CAMERA_MASK_CSS_VARIABLE = "--ginzzzu-camera-frames-mask-image";

let cameraMaskGeneration = 0;

async function applyCameraMask(path) {
  const generation = ++cameraMaskGeneration;
  const safePath = String(path || "").replace(/["'\\\r\n]/g, "");
  if (!safePath) {
    document.documentElement.style.setProperty(CAMERA_MASK_CSS_VARIABLE, "none");
    return;
  }

  try {
    const image = new Image();
    image.crossOrigin = "anonymous";
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = safePath;
    });

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0);

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < pixels.data.length; i += 4) {
      const sourceAlpha = pixels.data[i + 3] / 255;
      const luminance = Math.round(
        (pixels.data[i] * 0.2126 + pixels.data[i + 1] * 0.7152 + pixels.data[i + 2] * 0.0722) * sourceAlpha
      );
      pixels.data[i] = 255;
      pixels.data[i + 1] = 255;
      pixels.data[i + 2] = 255;
      pixels.data[i + 3] = luminance;
    }
    context.putImageData(pixels, 0, 0);

    if (generation !== cameraMaskGeneration) return;
    const alphaMask = canvas.toDataURL("image/png");
    document.documentElement.style.setProperty(CAMERA_MASK_CSS_VARIABLE, `url("${alphaMask}")`);
  } catch (error) {
    console.warn(`${MODULE_ID} | Could not convert the camera mask to an alpha channel.`, error);
    if (generation !== cameraMaskGeneration) return;
    document.documentElement.style.setProperty(CAMERA_MASK_CSS_VARIABLE, `url("${safePath}")`);
  }
}

async function applyWorldCameraMask() {
  const appearance = getWorldAppearance();
  document.documentElement.classList.toggle(CAMERA_CIRCLE_CLASS, appearance.shape === CAMERA_SHAPE.CIRCLE);
  await applyCameraMask(appearance.maskImage);
}

Hooks.once("init", () => {
  try {
    document.documentElement.classList.add(MODULE_ID);
  } catch (error) {
    console.error(`${MODULE_ID} | Camera mask initialization failed.`, error);
  }
});

Hooks.once("ready", async () => {
  try {
    await applyWorldCameraMask();
  } catch (error) {
    console.error(`${MODULE_ID} | Could not apply the configured camera mask.`, error);
  }
});

Hooks.on(APPEARANCE_CHANGED_HOOK, async () => {
  try {
    await applyWorldCameraMask();
  } catch (error) {
    console.error(`${MODULE_ID} | Could not update the configured camera mask.`, error);
  }
});
