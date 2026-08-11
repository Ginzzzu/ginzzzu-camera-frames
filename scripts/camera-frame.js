import {
  APPEARANCE_CHANGED_HOOK,
  APPEARANCE_POLICY,
  CAMERA_FRAME,
  CAMERA_FRAME_COLOR,
  CAMERA_FRAME_FINISH,
  CAMERA_FRAME_STYLE,
  CAMERA_SHAPE,
  EFFECT_LEVEL,
  getEffectiveAppearanceForUser,
  getWorldAppearance,
  MODULE_ID,
  SETTINGS,
  USER_APPEARANCE_FLAG
} from "./camera-settings.js";

const FRAME_CLASSES = Object.values(CAMERA_FRAME)
  .map((frame) => `${MODULE_ID}--frame-${frame}`);

const FRAME_COLOR_CLASSES = Object.values(CAMERA_FRAME_COLOR)
  .map((color) => `${MODULE_ID}--frame-color-${color}`);

const FRAME_FINISH_CLASSES = Object.values(CAMERA_FRAME_FINISH)
  .map((finish) => `${MODULE_ID}--frame-finish-${finish}`);

const FRAME_STYLE_CLASSES = Object.values(CAMERA_FRAME_STYLE)
  .map((style) => `${MODULE_ID}--frame-style-${style}`);

const GLARE_CLASSES = Object.values(EFFECT_LEVEL)
  .map((level) => `${MODULE_ID}--glare-${level}`);

const INNER_SHADOW_CLASSES = Object.values(EFFECT_LEVEL)
  .map((level) => `${MODULE_ID}--inner-shadow-${level}`);

const SHAPE_CLASSES = [
  `${MODULE_ID}--circle`,
  `${MODULE_ID}--image-mask`
];

const PERSONAL_CAMERA_CLASS = `${MODULE_ID}--personal-camera`;
const PERSONAL_APPEARANCE_CLASSES = [
  ...FRAME_CLASSES,
  ...FRAME_COLOR_CLASSES,
  ...FRAME_FINISH_CLASSES,
  ...FRAME_STYLE_CLASSES,
  ...GLARE_CLASSES,
  ...INNER_SHADOW_CLASSES,
  ...SHAPE_CLASSES,
  PERSONAL_CAMERA_CLASS
];

function replaceAppearanceClass(classList, classNames, nextClass) {
  classList.remove(...classNames);
  if (nextClass) classList.add(nextClass);
}

function applyWorldFrameAndEffects() {
  const appearance = getWorldAppearance();
  const rootClasses = document.documentElement.classList;

  const frameClass = appearance.frame === CAMERA_FRAME.NONE
    ? null
    : `${MODULE_ID}--frame-${appearance.frame}`;
  const glareClass = appearance.glare === EFFECT_LEVEL.OFF
    ? null
    : `${MODULE_ID}--glare-${appearance.glare}`;
  const innerShadowClass = appearance.innerShadow === EFFECT_LEVEL.OFF
    ? null
    : `${MODULE_ID}--inner-shadow-${appearance.innerShadow}`;

  replaceAppearanceClass(rootClasses, FRAME_CLASSES, frameClass);
  replaceAppearanceClass(
    rootClasses,
    FRAME_COLOR_CLASSES,
    `${MODULE_ID}--frame-color-${appearance.frameColor}`
  );
  replaceAppearanceClass(
    rootClasses,
    FRAME_FINISH_CLASSES,
    `${MODULE_ID}--frame-finish-${appearance.frameFinish}`
  );
  replaceAppearanceClass(
    rootClasses,
    FRAME_STYLE_CLASSES,
    `${MODULE_ID}--frame-style-${appearance.frameStyle}`
  );
  replaceAppearanceClass(rootClasses, GLARE_CLASSES, glareClass);
  replaceAppearanceClass(rootClasses, INNER_SHADOW_CLASSES, innerShadowClass);
}

function clearPersonalCameraClasses() {
  for (const cameraView of document.querySelectorAll(`.camera-view.${PERSONAL_CAMERA_CLASS}`)) {
    cameraView.classList.remove(...PERSONAL_APPEARANCE_CLASSES);
  }
}

function getCameraView(userId) {
  if (!userId) return null;
  return ui.webrtc?.getUserCameraView?.(userId) ?? null;
}

function addAppearanceClasses(cameraView, appearance) {
  const shapeClass = appearance.shape === CAMERA_SHAPE.CIRCLE
    ? `${MODULE_ID}--circle`
    : `${MODULE_ID}--image-mask`;

  cameraView.classList.add(
    PERSONAL_CAMERA_CLASS,
    shapeClass,
    `${MODULE_ID}--frame-${appearance.frame}`,
    `${MODULE_ID}--frame-color-${appearance.frameColor}`,
    `${MODULE_ID}--frame-finish-${appearance.frameFinish}`,
    `${MODULE_ID}--frame-style-${appearance.frameStyle}`,
    `${MODULE_ID}--glare-${appearance.glare}`,
    `${MODULE_ID}--inner-shadow-${appearance.innerShadow}`
  );
}

function applySynchronizedUserAppearances() {
  clearPersonalCameraClasses();

  const policy = game.settings.get(MODULE_ID, SETTINGS.APPEARANCE_POLICY);
  if (policy !== APPEARANCE_POLICY.PERSONAL) return;

  for (const user of game.users ?? []) {
    if (user.isGM) continue;

    const cameraView = getCameraView(user.id);
    if (!cameraView) continue;

    addAppearanceClasses(cameraView, getEffectiveAppearanceForUser(user));
  }
}

function applyCameraAppearance() {
  applyWorldFrameAndEffects();
  applySynchronizedUserAppearances();
}

function queueAppearanceRefresh(errorMessage) {
  queueMicrotask(() => {
    try {
      applySynchronizedUserAppearances();
    } catch (error) {
      console.error(`${MODULE_ID} | ${errorMessage}`, error);
    }
  });
}

function handleCameraViewsRender() {
  queueAppearanceRefresh("Could not restore synchronized camera appearances after rendering.");
}

Hooks.once("ready", () => {
  try {
    applyCameraAppearance();
    ui.webrtc?.addEventListener?.("render", handleCameraViewsRender);
  } catch (error) {
    console.error(`${MODULE_ID} | Could not apply the configured camera frame and effects.`, error);
  }
});

Hooks.on(APPEARANCE_CHANGED_HOOK, () => {
  try {
    applyCameraAppearance();
  } catch (error) {
    console.error(`${MODULE_ID} | Could not update the configured camera frame and effects.`, error);
  }
});

Hooks.on("updateUser", (_user, changes) => {
  const moduleFlags = changes?.flags?.[MODULE_ID];
  const appearanceChanged = moduleFlags
    && (Object.hasOwn(moduleFlags, USER_APPEARANCE_FLAG)
      || Object.hasOwn(moduleFlags, `-=${USER_APPEARANCE_FLAG}`));
  if (!appearanceChanged) return;

  queueAppearanceRefresh("Could not apply an updated synchronized user appearance.");
});
