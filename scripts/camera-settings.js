import { UserCameraAppearanceModel } from "./camera-appearance-model.js";
import {
  buildDefaultRuleSource,
  categoryMapToRuleSource,
  PlayerCustomizationRulesModel,
  rulesModelToCategoryMap
} from "./camera-permissions-model.js";

export const MODULE_ID = "ginzzzu-camera-frames";
export const APPEARANCE_CHANGED_HOOK = `${MODULE_ID}.appearanceChanged`;
export const USER_APPEARANCE_FLAG = "appearance";

export const SETTINGS = Object.freeze({
  APPEARANCE_POLICY: "appearancePolicy",
  CAMERA_FRAME: "cameraFrame",
  CAMERA_FRAME_COLOR: "cameraFrameColor",
  CAMERA_FRAME_FINISH: "cameraFrameFinish",
  CAMERA_FRAME_STYLE: "cameraFrameStyle",
  CAMERA_GLARE: "cameraGlare",
  CAMERA_INNER_SHADOW: "cameraInnerShadow",
  CAMERA_MASK_IMAGE: "cameraMaskImage",
  CAMERA_SHAPE: "cameraShape",
  MIGRATION_VERSION: "migrationVersion",
  PLAYER_RULES: "playerRules",
  USER_CAMERA_FRAME: "userCameraFrame",
  USER_CAMERA_FRAME_COLOR: "userCameraFrameColor",
  USER_CAMERA_FRAME_FINISH: "userCameraFrameFinish",
  USER_CAMERA_FRAME_STYLE: "userCameraFrameStyle",
  USER_CAMERA_GLARE: "userCameraGlare",
  USER_CAMERA_INNER_SHADOW: "userCameraInnerShadow",
  USER_CAMERA_SHAPE: "userCameraShape",
  USER_MIGRATION_VERSION: "userMigrationVersion"
});

export const APPEARANCE_POLICY = Object.freeze({
  MASTER: "master",
  PERSONAL: "personal"
});

export const CAMERA_SHAPE = Object.freeze({
  CIRCLE: "circle",
  IMAGE_MASK: "imageMask"
});

export const CAMERA_FRAME = Object.freeze({
  MEDIUM: "medium",
  NONE: "none",
  THICK: "thick",
  THIN: "thin",
  VERY_THIN: "veryThin"
});

export const CAMERA_FRAME_STYLE = Object.freeze({
  DASHED: "dashed",
  DOTTED: "dotted",
  DOUBLE: "double",
  SEGMENTS: "segments",
  SOLID: "solid"
});

export const CAMERA_FRAME_FINISH = Object.freeze({
  DIMENSIONAL: "dimensional",
  FLAT: "flat",
  GLOW: "glow"
});

export const CAMERA_FRAME_COLOR = Object.freeze({
  AMBER: "amber",
  BLUE: "blue",
  BRASS: "brass",
  COPPER: "copper",
  CYAN: "cyan",
  DARK: "dark",
  GREEN: "green",
  INDIGO: "indigo",
  LIGHT: "light",
  LIME: "lime",
  MAGENTA: "magenta",
  ORANGE: "orange",
  PINK: "pink",
  RED: "red",
  SILVER: "silver",
  TURQUOISE: "turquoise",
  VIOLET: "violet",
  YELLOW: "yellow"
});

export const EFFECT_LEVEL = Object.freeze({
  HIGH: "high",
  LOW: "low",
  MEDIUM: "medium",
  OFF: "off"
});

export const USER_INHERIT = "inherit";

const LEGACY_CAMERA_FRAME = Object.freeze({
  METAL: "metal",
  PORTHOLE: "porthole"
});

const OPTION_LABELS = Object.freeze({
  shape: Object.freeze({
    [CAMERA_SHAPE.IMAGE_MASK]: "GINZZZU_CAMERA_FRAMES.Settings.CameraShape.Choice.ImageMask",
    [CAMERA_SHAPE.CIRCLE]: "GINZZZU_CAMERA_FRAMES.Settings.CameraShape.Choice.Circle"
  }),
  frameStyle: Object.freeze({
    [CAMERA_FRAME_STYLE.SOLID]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameStyle.Choice.Solid",
    [CAMERA_FRAME_STYLE.DOUBLE]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameStyle.Choice.Double",
    [CAMERA_FRAME_STYLE.DASHED]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameStyle.Choice.Dashed",
    [CAMERA_FRAME_STYLE.SEGMENTS]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameStyle.Choice.Segments",
    [CAMERA_FRAME_STYLE.DOTTED]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameStyle.Choice.Dotted"
  }),
  frame: Object.freeze({
    [CAMERA_FRAME.NONE]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrame.Choice.None",
    [CAMERA_FRAME.VERY_THIN]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrame.Choice.VeryThin",
    [CAMERA_FRAME.THIN]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrame.Choice.Thin",
    [CAMERA_FRAME.MEDIUM]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrame.Choice.Medium",
    [CAMERA_FRAME.THICK]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrame.Choice.Thick"
  }),
  frameColor: Object.freeze({
    [CAMERA_FRAME_COLOR.LIGHT]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameColor.Choice.Light",
    [CAMERA_FRAME_COLOR.SILVER]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameColor.Choice.Silver",
    [CAMERA_FRAME_COLOR.DARK]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameColor.Choice.Dark",
    [CAMERA_FRAME_COLOR.BRASS]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameColor.Choice.Brass",
    [CAMERA_FRAME_COLOR.COPPER]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameColor.Choice.Copper",
    [CAMERA_FRAME_COLOR.RED]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameColor.Choice.Red",
    [CAMERA_FRAME_COLOR.ORANGE]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameColor.Choice.Orange",
    [CAMERA_FRAME_COLOR.AMBER]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameColor.Choice.Amber",
    [CAMERA_FRAME_COLOR.YELLOW]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameColor.Choice.Yellow",
    [CAMERA_FRAME_COLOR.LIME]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameColor.Choice.Lime",
    [CAMERA_FRAME_COLOR.GREEN]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameColor.Choice.Green",
    [CAMERA_FRAME_COLOR.TURQUOISE]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameColor.Choice.Turquoise",
    [CAMERA_FRAME_COLOR.CYAN]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameColor.Choice.Cyan",
    [CAMERA_FRAME_COLOR.BLUE]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameColor.Choice.Blue",
    [CAMERA_FRAME_COLOR.INDIGO]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameColor.Choice.Indigo",
    [CAMERA_FRAME_COLOR.VIOLET]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameColor.Choice.Violet",
    [CAMERA_FRAME_COLOR.MAGENTA]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameColor.Choice.Magenta",
    [CAMERA_FRAME_COLOR.PINK]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameColor.Choice.Pink"
  }),
  frameFinish: Object.freeze({
    [CAMERA_FRAME_FINISH.FLAT]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameFinish.Choice.Flat",
    [CAMERA_FRAME_FINISH.DIMENSIONAL]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameFinish.Choice.Dimensional",
    [CAMERA_FRAME_FINISH.GLOW]: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameFinish.Choice.Glow"
  }),
  glare: Object.freeze({
    [EFFECT_LEVEL.OFF]: "GINZZZU_CAMERA_FRAMES.Settings.EffectLevel.Choice.Off",
    [EFFECT_LEVEL.LOW]: "GINZZZU_CAMERA_FRAMES.Settings.EffectLevel.Choice.Low",
    [EFFECT_LEVEL.MEDIUM]: "GINZZZU_CAMERA_FRAMES.Settings.EffectLevel.Choice.Medium",
    [EFFECT_LEVEL.HIGH]: "GINZZZU_CAMERA_FRAMES.Settings.EffectLevel.Choice.High"
  }),
  innerShadow: Object.freeze({
    [EFFECT_LEVEL.OFF]: "GINZZZU_CAMERA_FRAMES.Settings.EffectLevel.Choice.Off",
    [EFFECT_LEVEL.LOW]: "GINZZZU_CAMERA_FRAMES.Settings.EffectLevel.Choice.Low",
    [EFFECT_LEVEL.MEDIUM]: "GINZZZU_CAMERA_FRAMES.Settings.EffectLevel.Choice.Medium",
    [EFFECT_LEVEL.HIGH]: "GINZZZU_CAMERA_FRAMES.Settings.EffectLevel.Choice.High"
  })
});

const APPEARANCE_CATEGORY_DEFINITIONS = Object.freeze([
  Object.freeze({
    key: "shape",
    worldSetting: SETTINGS.CAMERA_SHAPE,
    userSetting: SETTINGS.USER_CAMERA_SHAPE,
    nameKey: "GINZZZU_CAMERA_FRAMES.Permissions.Category.Shape.Name",
    hintKey: "GINZZZU_CAMERA_FRAMES.Permissions.Category.Shape.Hint"
  }),
  Object.freeze({
    key: "frameStyle",
    worldSetting: SETTINGS.CAMERA_FRAME_STYLE,
    userSetting: SETTINGS.USER_CAMERA_FRAME_STYLE,
    nameKey: "GINZZZU_CAMERA_FRAMES.Permissions.Category.FrameStyle.Name",
    hintKey: "GINZZZU_CAMERA_FRAMES.Permissions.Category.FrameStyle.Hint"
  }),
  Object.freeze({
    key: "frame",
    worldSetting: SETTINGS.CAMERA_FRAME,
    userSetting: SETTINGS.USER_CAMERA_FRAME,
    nameKey: "GINZZZU_CAMERA_FRAMES.Permissions.Category.Frame.Name",
    hintKey: "GINZZZU_CAMERA_FRAMES.Permissions.Category.Frame.Hint"
  }),
  Object.freeze({
    key: "frameColor",
    worldSetting: SETTINGS.CAMERA_FRAME_COLOR,
    userSetting: SETTINGS.USER_CAMERA_FRAME_COLOR,
    nameKey: "GINZZZU_CAMERA_FRAMES.Permissions.Category.FrameColor.Name",
    hintKey: "GINZZZU_CAMERA_FRAMES.Permissions.Category.FrameColor.Hint"
  }),
  Object.freeze({
    key: "frameFinish",
    worldSetting: SETTINGS.CAMERA_FRAME_FINISH,
    userSetting: SETTINGS.USER_CAMERA_FRAME_FINISH,
    nameKey: "GINZZZU_CAMERA_FRAMES.Permissions.Category.FrameFinish.Name",
    hintKey: "GINZZZU_CAMERA_FRAMES.Permissions.Category.FrameFinish.Hint"
  }),
  Object.freeze({
    key: "glare",
    worldSetting: SETTINGS.CAMERA_GLARE,
    userSetting: SETTINGS.USER_CAMERA_GLARE,
    nameKey: "GINZZZU_CAMERA_FRAMES.Permissions.Category.Glare.Name",
    hintKey: "GINZZZU_CAMERA_FRAMES.Permissions.Category.Glare.Hint"
  }),
  Object.freeze({
    key: "innerShadow",
    worldSetting: SETTINGS.CAMERA_INNER_SHADOW,
    userSetting: SETTINGS.USER_CAMERA_INNER_SHADOW,
    nameKey: "GINZZZU_CAMERA_FRAMES.Permissions.Category.InnerShadow.Name",
    hintKey: "GINZZZU_CAMERA_FRAMES.Permissions.Category.InnerShadow.Hint"
  })
]);

function choiceObject(categoryKey, includeInherit = false) {
  const choices = {};
  if (includeInherit) choices[USER_INHERIT] = "GINZZZU_CAMERA_FRAMES.Settings.UserChoice.Inherit";
  Object.assign(choices, OPTION_LABELS[categoryKey]);
  return choices;
}

function defaultPlayerRuleSource() {
  const optionValues = Object.fromEntries(
    APPEARANCE_CATEGORY_DEFINITIONS.map(({ key }) => [key, Object.keys(OPTION_LABELS[key])])
  );
  return buildDefaultRuleSource(optionValues);
}

export function getAppearanceCategoryDefinitions() {
  return APPEARANCE_CATEGORY_DEFINITIONS.map((definition) => ({
    ...definition,
    options: Object.entries(OPTION_LABELS[definition.key]).map(([value, label]) => ({ value, label }))
  }));
}

export function getWorldAppearance() {
  return {
    frame: game.settings.get(MODULE_ID, SETTINGS.CAMERA_FRAME),
    frameColor: game.settings.get(MODULE_ID, SETTINGS.CAMERA_FRAME_COLOR),
    frameFinish: game.settings.get(MODULE_ID, SETTINGS.CAMERA_FRAME_FINISH),
    frameStyle: game.settings.get(MODULE_ID, SETTINGS.CAMERA_FRAME_STYLE),
    glare: game.settings.get(MODULE_ID, SETTINGS.CAMERA_GLARE),
    innerShadow: game.settings.get(MODULE_ID, SETTINGS.CAMERA_INNER_SHADOW),
    maskImage: game.settings.get(MODULE_ID, SETTINGS.CAMERA_MASK_IMAGE),
    shape: game.settings.get(MODULE_ID, SETTINGS.CAMERA_SHAPE)
  };
}

export function getPlayerCustomizationRules() {
  const stored = game.settings.get(MODULE_ID, SETTINGS.PLAYER_RULES);
  const rawRules = rulesModelToCategoryMap(stored);
  const normalized = {};

  for (const definition of APPEARANCE_CATEGORY_DEFINITIONS) {
    const validValues = new Set(Object.keys(OPTION_LABELS[definition.key]));
    normalized[definition.key] = {
      enabled: Boolean(rawRules[definition.key]?.enabled),
      allowed: (rawRules[definition.key]?.allowed ?? []).filter((value) => validValues.has(value))
    };
  }

  return normalized;
}

export function createPlayerRuleSource(categoryMap) {
  return categoryMapToRuleSource(categoryMap);
}

export function broadcastAppearanceChange() {
  try {
    Hooks.callAll(APPEARANCE_CHANGED_HOOK);
  } catch (error) {
    console.error(`${MODULE_ID} | Could not broadcast the camera appearance change.`, error);
  }
}

async function handleWorldAppearanceChange() {
  try {
    await sanitizeUserAppearance();
  } catch (error) {
    console.error(`${MODULE_ID} | Could not validate personal camera appearance.`, error);
  }
  broadcastAppearanceChange();
}

function registerWorldSettings() {
  game.settings.register(MODULE_ID, SETTINGS.APPEARANCE_POLICY, {
    name: "GINZZZU_CAMERA_FRAMES.Settings.AppearancePolicy.Name",
    hint: "GINZZZU_CAMERA_FRAMES.Settings.AppearancePolicy.Hint",
    scope: "world",
    config: true,
    type: String,
    choices: {
      [APPEARANCE_POLICY.MASTER]: "GINZZZU_CAMERA_FRAMES.Settings.AppearancePolicy.Choice.Master",
      [APPEARANCE_POLICY.PERSONAL]: "GINZZZU_CAMERA_FRAMES.Settings.AppearancePolicy.Choice.Personal"
    },
    default: APPEARANCE_POLICY.MASTER,
    requiresReload: false,
    onChange: handleWorldAppearanceChange
  });

  game.settings.register(MODULE_ID, SETTINGS.CAMERA_SHAPE, {
    name: "GINZZZU_CAMERA_FRAMES.Settings.CameraShape.Name",
    hint: "GINZZZU_CAMERA_FRAMES.Settings.CameraShape.Hint",
    scope: "world",
    config: true,
    type: String,
    choices: choiceObject("shape"),
    default: CAMERA_SHAPE.IMAGE_MASK,
    requiresReload: false,
    onChange: handleWorldAppearanceChange
  });

  game.settings.register(MODULE_ID, SETTINGS.CAMERA_MASK_IMAGE, {
    name: "GINZZZU_CAMERA_FRAMES.Settings.CameraMaskImage.Name",
    hint: "GINZZZU_CAMERA_FRAMES.Settings.CameraMaskImage.Hint",
    scope: "world",
    config: true,
    type: String,
    default: `modules/${MODULE_ID}/assets/camera-mask.png`,
    filePicker: "image",
    requiresReload: false,
    onChange: handleWorldAppearanceChange
  });

  game.settings.register(MODULE_ID, SETTINGS.CAMERA_FRAME_STYLE, {
    name: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameStyle.Name",
    hint: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameStyle.Hint",
    scope: "world",
    config: true,
    type: String,
    choices: choiceObject("frameStyle"),
    default: CAMERA_FRAME_STYLE.SOLID,
    requiresReload: false,
    onChange: handleWorldAppearanceChange
  });

  game.settings.register(MODULE_ID, SETTINGS.CAMERA_FRAME, {
    name: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrame.Name",
    hint: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrame.Hint",
    scope: "world",
    config: true,
    type: String,
    choices: choiceObject("frame"),
    default: CAMERA_FRAME.NONE,
    requiresReload: false,
    onChange: handleWorldAppearanceChange
  });

  game.settings.register(MODULE_ID, SETTINGS.CAMERA_FRAME_COLOR, {
    name: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameColor.Name",
    hint: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameColor.Hint",
    scope: "world",
    config: true,
    type: String,
    choices: choiceObject("frameColor"),
    default: CAMERA_FRAME_COLOR.SILVER,
    requiresReload: false,
    onChange: handleWorldAppearanceChange
  });

  game.settings.register(MODULE_ID, SETTINGS.CAMERA_FRAME_FINISH, {
    name: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameFinish.Name",
    hint: "GINZZZU_CAMERA_FRAMES.Settings.CameraFrameFinish.Hint",
    scope: "world",
    config: true,
    type: String,
    choices: choiceObject("frameFinish"),
    default: CAMERA_FRAME_FINISH.DIMENSIONAL,
    requiresReload: false,
    onChange: handleWorldAppearanceChange
  });

  game.settings.register(MODULE_ID, SETTINGS.CAMERA_GLARE, {
    name: "GINZZZU_CAMERA_FRAMES.Settings.CameraGlare.Name",
    hint: "GINZZZU_CAMERA_FRAMES.Settings.CameraGlare.Hint",
    scope: "world",
    config: true,
    type: String,
    choices: choiceObject("glare"),
    default: EFFECT_LEVEL.OFF,
    requiresReload: false,
    onChange: handleWorldAppearanceChange
  });

  game.settings.register(MODULE_ID, SETTINGS.CAMERA_INNER_SHADOW, {
    name: "GINZZZU_CAMERA_FRAMES.Settings.CameraInnerShadow.Name",
    hint: "GINZZZU_CAMERA_FRAMES.Settings.CameraInnerShadow.Hint",
    scope: "world",
    config: true,
    type: String,
    choices: choiceObject("innerShadow"),
    default: EFFECT_LEVEL.OFF,
    requiresReload: false,
    onChange: handleWorldAppearanceChange
  });

  game.settings.register(MODULE_ID, SETTINGS.PLAYER_RULES, {
    scope: "world",
    config: false,
    type: PlayerCustomizationRulesModel,
    default: defaultPlayerRuleSource(),
    onChange: handleWorldAppearanceChange
  });

  game.settings.register(MODULE_ID, SETTINGS.MIGRATION_VERSION, {
    scope: "world",
    config: false,
    type: String,
    default: ""
  });
}

function registerLegacyUserSettings() {
  // Retained as a read-only migration source for worlds upgraded from 0.6.1 or earlier.
  const registrations = [
    [SETTINGS.USER_CAMERA_SHAPE, "shape"],
    [SETTINGS.USER_CAMERA_FRAME_STYLE, "frameStyle"],
    [SETTINGS.USER_CAMERA_FRAME, "frame"],
    [SETTINGS.USER_CAMERA_FRAME_COLOR, "frameColor"],
    [SETTINGS.USER_CAMERA_FRAME_FINISH, "frameFinish"],
    [SETTINGS.USER_CAMERA_GLARE, "glare"],
    [SETTINGS.USER_CAMERA_INNER_SHADOW, "innerShadow"]
  ];

  for (const [settingKey, categoryKey] of registrations) {
    game.settings.register(MODULE_ID, settingKey, {
      scope: "user",
      config: false,
      type: String,
      choices: choiceObject(categoryKey, true),
      default: USER_INHERIT,
      requiresReload: false
    });
  }

  game.settings.register(MODULE_ID, SETTINGS.USER_MIGRATION_VERSION, {
    scope: "user",
    config: false,
    type: String,
    default: ""
  });
}

function createInheritedAppearanceSource() {
  return Object.fromEntries(
    APPEARANCE_CATEGORY_DEFINITIONS.map(({ key }) => [key, USER_INHERIT])
  );
}

function normalizeUserAppearanceSource(value) {
  const source = value?.toObject?.() ?? value ?? {};
  const normalized = createInheritedAppearanceSource();

  for (const definition of APPEARANCE_CATEGORY_DEFINITIONS) {
    const validValues = new Set([USER_INHERIT, ...Object.keys(OPTION_LABELS[definition.key])]);
    const candidate = String(source[definition.key] ?? USER_INHERIT);
    normalized[definition.key] = validValues.has(candidate) ? candidate : USER_INHERIT;
  }

  return normalized;
}

export function getUserAppearanceSource(user = game.user) {
  if (!user) return createInheritedAppearanceSource();
  return normalizeUserAppearanceSource(user.getFlag(MODULE_ID, USER_APPEARANCE_FLAG));
}

export async function saveUserAppearance(user, value) {
  if (!user) throw new Error(`${MODULE_ID} | A User document is required to save camera appearance.`);
  if (!game.user?.isGM && user.id !== game.user?.id) {
    throw new Error(`${MODULE_ID} | A player may only update their own camera appearance.`);
  }

  const model = new UserCameraAppearanceModel(normalizeUserAppearanceSource(value));
  await user.setFlag(MODULE_ID, USER_APPEARANCE_FLAG, model.toObject());
}

function resolveUserValue(definition, worldValue, rules, userAppearance) {
  const rule = rules[definition.key];
  if (!rule?.enabled) return worldValue;

  const userValue = userAppearance[definition.key];
  if (userValue === USER_INHERIT) return worldValue;
  return rule.allowed.includes(userValue) ? userValue : worldValue;
}

export function getEffectiveAppearanceForUser(user) {
  const policy = game.settings.get(MODULE_ID, SETTINGS.APPEARANCE_POLICY);
  const worldAppearance = getWorldAppearance();
  if (policy !== APPEARANCE_POLICY.PERSONAL || !user || user.isGM) return worldAppearance;

  const rules = getPlayerCustomizationRules();
  const userAppearance = getUserAppearanceSource(user);
  const result = { ...worldAppearance };
  for (const definition of APPEARANCE_CATEGORY_DEFINITIONS) {
    result[definition.key] = resolveUserValue(
      definition,
      worldAppearance[definition.key],
      rules,
      userAppearance
    );
  }
  return result;
}

export function getEffectiveAppearance() {
  return getEffectiveAppearanceForUser(game.user);
}

export async function sanitizeUserAppearance() {
  if (!game.user || game.user.isGM) return;

  const policy = game.settings.get(MODULE_ID, SETTINGS.APPEARANCE_POLICY);
  const rules = getPlayerCustomizationRules();
  const current = getUserAppearanceSource(game.user);
  const sanitized = { ...current };
  let changed = false;

  for (const definition of APPEARANCE_CATEGORY_DEFINITIONS) {
    const value = current[definition.key];
    if (value === USER_INHERIT) continue;

    const rule = rules[definition.key];
    const valid = policy === APPEARANCE_POLICY.PERSONAL
      && rule?.enabled
      && rule.allowed.includes(value);

    if (!valid) {
      sanitized[definition.key] = USER_INHERIT;
      changed = true;
    }
  }

  if (changed) await saveUserAppearance(game.user, sanitized);
}

async function migrateStageThreeGlassEffects() {
  if (!game.user?.isGM) return;
  const migrationVersion = game.settings.get(MODULE_ID, SETTINGS.MIGRATION_VERSION);
  if (["0.4.0", "0.4.1", "0.5.0", "0.6.0", "0.6.1", "0.6.2"].includes(migrationVersion)) return;

  const frame = game.settings.get(MODULE_ID, SETTINGS.CAMERA_FRAME);
  const effectByFrame = {
    [CAMERA_FRAME.NONE]: EFFECT_LEVEL.OFF,
    [CAMERA_FRAME.THIN]: EFFECT_LEVEL.LOW,
    [CAMERA_FRAME.MEDIUM]: EFFECT_LEVEL.MEDIUM,
    [CAMERA_FRAME.THICK]: EFFECT_LEVEL.HIGH,
    [LEGACY_CAMERA_FRAME.METAL]: EFFECT_LEVEL.MEDIUM,
    [LEGACY_CAMERA_FRAME.PORTHOLE]: EFFECT_LEVEL.HIGH
  };
  const migratedEffect = effectByFrame[frame] ?? EFFECT_LEVEL.OFF;

  try {
    await Promise.all([
      game.settings.set(MODULE_ID, SETTINGS.CAMERA_GLARE, migratedEffect),
      game.settings.set(MODULE_ID, SETTINGS.CAMERA_INNER_SHADOW, migratedEffect)
    ]);
    await game.settings.set(MODULE_ID, SETTINGS.MIGRATION_VERSION, "0.4.0");
  } catch (error) {
    console.error(`${MODULE_ID} | Could not migrate the stage 3 glass effects.`, error);
  }
}

function getSeparatedFrameAppearance(legacyFrame) {
  switch (legacyFrame) {
    case CAMERA_FRAME.THIN:
      return { color: CAMERA_FRAME_COLOR.LIGHT, frame: CAMERA_FRAME.THIN };
    case LEGACY_CAMERA_FRAME.METAL:
      return { color: CAMERA_FRAME_COLOR.SILVER, frame: CAMERA_FRAME.MEDIUM };
    case LEGACY_CAMERA_FRAME.PORTHOLE:
      return { color: CAMERA_FRAME_COLOR.BRASS, frame: CAMERA_FRAME.THICK };
    case CAMERA_FRAME.NONE:
      return { color: CAMERA_FRAME_COLOR.SILVER, frame: CAMERA_FRAME.NONE };
    default:
      return null;
  }
}

async function migrateWorldFrameSeparation() {
  if (!game.user?.isGM) return;
  const migrationVersion = game.settings.get(MODULE_ID, SETTINGS.MIGRATION_VERSION);
  if (["0.4.1", "0.5.0", "0.6.0", "0.6.1", "0.6.2"].includes(migrationVersion)) return;

  const currentFrame = game.settings.get(MODULE_ID, SETTINGS.CAMERA_FRAME);
  const separated = getSeparatedFrameAppearance(currentFrame);

  try {
    if (separated) {
      await Promise.all([
        game.settings.set(MODULE_ID, SETTINGS.CAMERA_FRAME, separated.frame),
        game.settings.set(MODULE_ID, SETTINGS.CAMERA_FRAME_COLOR, separated.color)
      ]);
    }
    await game.settings.set(MODULE_ID, SETTINGS.MIGRATION_VERSION, "0.4.1");
  } catch (error) {
    console.error(`${MODULE_ID} | Could not separate the shared frame thickness and color.`, error);
  }
}

async function migrateUserFrameSeparation() {
  const migrationVersion = game.settings.get(MODULE_ID, SETTINGS.USER_MIGRATION_VERSION);
  if (["0.4.1", "0.5.0", "0.6.0", "0.6.1", "0.6.2"].includes(migrationVersion)) return;

  const currentFrame = game.settings.get(MODULE_ID, SETTINGS.USER_CAMERA_FRAME);
  const separated = currentFrame === USER_INHERIT
    ? { color: USER_INHERIT, frame: USER_INHERIT }
    : getSeparatedFrameAppearance(currentFrame);

  try {
    if (separated) {
      await Promise.all([
        game.settings.set(MODULE_ID, SETTINGS.USER_CAMERA_FRAME, separated.frame),
        game.settings.set(MODULE_ID, SETTINGS.USER_CAMERA_FRAME_COLOR, separated.color)
      ]);
    }
    await game.settings.set(MODULE_ID, SETTINGS.USER_MIGRATION_VERSION, "0.4.1");
  } catch (error) {
    console.error(`${MODULE_ID} | Could not separate the personal frame thickness and color.`, error);
  }
}

async function migrateSynchronizedUserAppearance() {
  if (!game.user || game.user.isGM) return;

  const migrationVersion = game.settings.get(MODULE_ID, SETTINGS.USER_MIGRATION_VERSION);
  const existingFlag = game.user.getFlag(MODULE_ID, USER_APPEARANCE_FLAG);

  try {
    if (!existingFlag) {
      const legacySource = {};
      for (const definition of APPEARANCE_CATEGORY_DEFINITIONS) {
        legacySource[definition.key] = game.settings.get(MODULE_ID, definition.userSetting);
      }
      await saveUserAppearance(game.user, legacySource);
    }

    if (migrationVersion !== "0.6.2") {
      await game.settings.set(MODULE_ID, SETTINGS.USER_MIGRATION_VERSION, "0.6.2");
    }
  } catch (error) {
    console.error(`${MODULE_ID} | Could not migrate personal appearance to the synchronized User flag.`, error);
  }
}

async function finalizeCurrentMigration() {
  if (game.user?.isGM) {
    const migrationVersion = game.settings.get(MODULE_ID, SETTINGS.MIGRATION_VERSION);
    if (migrationVersion !== "0.6.2") {
      await game.settings.set(MODULE_ID, SETTINGS.MIGRATION_VERSION, "0.6.2");
    }
  }

  const userMigrationVersion = game.settings.get(MODULE_ID, SETTINGS.USER_MIGRATION_VERSION);
  if (userMigrationVersion !== "0.6.2") {
    await game.settings.set(MODULE_ID, SETTINGS.USER_MIGRATION_VERSION, "0.6.2");
  }
}

Hooks.once("init", () => {
  try {
    registerWorldSettings();
    registerLegacyUserSettings();
  } catch (error) {
    console.error(`${MODULE_ID} | Camera settings initialization failed.`, error);
  }
});

Hooks.once("ready", async () => {
  try {
    await migrateStageThreeGlassEffects();
    await migrateWorldFrameSeparation();
    await migrateUserFrameSeparation();
    await migrateSynchronizedUserAppearance();
    await finalizeCurrentMigration();
    await sanitizeUserAppearance();
    broadcastAppearanceChange();
  } catch (error) {
    console.error(`${MODULE_ID} | Camera settings migration failed.`, error);
  }
});
