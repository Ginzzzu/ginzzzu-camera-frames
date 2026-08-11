import {
  APPEARANCE_POLICY,
  broadcastAppearanceChange,
  createPlayerRuleSource,
  getAppearanceCategoryDefinitions,
  getPlayerCustomizationRules,
  getUserAppearanceSource,
  getWorldAppearance,
  MODULE_ID,
  saveUserAppearance,
  SETTINGS,
  USER_INHERIT
} from "./camera-settings.js";
import { PlayerCustomizationRulesModel } from "./camera-permissions-model.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

function localizeOptionLabel(definition, value) {
  const option = definition.options.find((candidate) => candidate.value === value);
  return option ? game.i18n.localize(option.label) : String(value ?? "");
}

export class PlayerPermissionsConfig extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: `${MODULE_ID}-permissions`,
    classes: [`${MODULE_ID}-settings`, `${MODULE_ID}-settings--permissions`],
    tag: "form",
    position: { width: 720, height: 760 },
    window: { title: "GINZZZU_CAMERA_FRAMES.App.Permissions.Title" },
    form: {
      closeOnSubmit: true,
      handler: this.#handleSubmit
    }
  };

  static PARTS = {
    main: {
      template: `modules/${MODULE_ID}/templates/player-permissions.hbs`,
      scrollable: [".gcf-settings__body"]
    }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const rules = getPlayerCustomizationRules();
    const policy = game.settings.get(MODULE_ID, SETTINGS.APPEARANCE_POLICY);

    return {
      ...context,
      personalModeEnabled: policy === APPEARANCE_POLICY.PERSONAL,
      categories: getAppearanceCategoryDefinitions().map((definition) => {
        const rule = rules[definition.key];
        return {
          key: definition.key,
          nameKey: definition.nameKey,
          hintKey: definition.hintKey,
          enabled: Boolean(rule?.enabled),
          options: definition.options.map((option) => ({
            ...option,
            checked: rule?.allowed.includes(option.value) ?? false
          }))
        };
      })
    };
  }

  static async #handleSubmit(_event, form) {
    if (!game.user?.isGM) return;

    const formData = new FormData(form);
    const categoryMap = {};

    for (const definition of getAppearanceCategoryDefinitions()) {
      const validValues = new Set(definition.options.map((option) => option.value));
      const allowed = formData
        .getAll(`allowed-${definition.key}`)
        .map(String)
        .filter((value) => validValues.has(value));

      categoryMap[definition.key] = {
        enabled: formData.has(`enabled-${definition.key}`) && allowed.length > 0,
        allowed
      };
    }

    try {
      const model = new PlayerCustomizationRulesModel(createPlayerRuleSource(categoryMap));
      await game.settings.set(MODULE_ID, SETTINGS.PLAYER_RULES, model.toObject());
      broadcastAppearanceChange();
      ui.notifications.info(game.i18n.localize("GINZZZU_CAMERA_FRAMES.App.Common.Saved"));
    } catch (error) {
      console.error(`${MODULE_ID} | Could not save player camera permissions.`, error);
      ui.notifications.error(game.i18n.localize("GINZZZU_CAMERA_FRAMES.App.Common.SaveFailed"));
      throw error;
    }
  }
}

export class PersonalAppearanceConfig extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: `${MODULE_ID}-personal-appearance`,
    classes: [`${MODULE_ID}-settings`, `${MODULE_ID}-settings--personal`],
    tag: "form",
    position: { width: 560, height: 680 },
    window: { title: "GINZZZU_CAMERA_FRAMES.App.Personal.Title" },
    form: {
      closeOnSubmit: true,
      handler: this.#handleSubmit
    }
  };

  static PARTS = {
    main: {
      template: `modules/${MODULE_ID}/templates/personal-appearance.hbs`,
      scrollable: [".gcf-settings__body"]
    }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const personalModeEnabled = game.settings.get(MODULE_ID, SETTINGS.APPEARANCE_POLICY)
      === APPEARANCE_POLICY.PERSONAL;
    const rules = getPlayerCustomizationRules();
    const worldAppearance = getWorldAppearance();
    const personalAppearance = getUserAppearanceSource(game.user);

    const categories = personalModeEnabled
      ? getAppearanceCategoryDefinitions()
        .filter((definition) => rules[definition.key]?.enabled && rules[definition.key].allowed.length)
        .map((definition) => {
          const allowedValues = new Set(rules[definition.key].allowed);
          const currentValue = personalAppearance[definition.key];
          const selectedValue = currentValue === USER_INHERIT || allowedValues.has(currentValue)
            ? currentValue
            : USER_INHERIT;
          const inheritedValue = worldAppearance[definition.key];

          return {
            key: definition.key,
            userSetting: definition.userSetting,
            nameKey: definition.nameKey,
            hintKey: definition.hintKey,
            inheritSelected: selectedValue === USER_INHERIT,
            inheritLabel: game.i18n.format(
              "GINZZZU_CAMERA_FRAMES.App.Personal.InheritWithValue",
              { value: localizeOptionLabel(definition, inheritedValue) }
            ),
            options: definition.options
              .filter((option) => allowedValues.has(option.value))
              .map((option) => ({
                ...option,
                selected: selectedValue === option.value
              }))
          };
        })
      : [];

    return {
      ...context,
      personalModeEnabled,
      categories,
      hasCategories: categories.length > 0,
      canSave: personalModeEnabled && categories.length > 0
    };
  }

  static async #handleSubmit(_event, form) {
    if (game.user?.isGM) return;

    const personalModeEnabled = game.settings.get(MODULE_ID, SETTINGS.APPEARANCE_POLICY)
      === APPEARANCE_POLICY.PERSONAL;
    if (!personalModeEnabled) return;

    const formData = new FormData(form);
    const rules = getPlayerCustomizationRules();
    const appearance = getUserAppearanceSource(game.user);

    for (const definition of getAppearanceCategoryDefinitions()) {
      const rule = rules[definition.key];
      if (!rule?.enabled || !rule.allowed.length) {
        appearance[definition.key] = USER_INHERIT;
        continue;
      }

      const submitted = String(formData.get(definition.userSetting) ?? USER_INHERIT);
      appearance[definition.key] = submitted === USER_INHERIT || rule.allowed.includes(submitted)
        ? submitted
        : USER_INHERIT;
    }

    try {
      await saveUserAppearance(game.user, appearance);
      broadcastAppearanceChange();
      ui.notifications.info(game.i18n.localize("GINZZZU_CAMERA_FRAMES.App.Common.Saved"));
    } catch (error) {
      console.error(`${MODULE_ID} | Could not save personal camera appearance.`, error);
      ui.notifications.error(game.i18n.localize("GINZZZU_CAMERA_FRAMES.App.Common.SaveFailed"));
      throw error;
    }
  }
}

function registerSettingsMenus() {
  if (game.user?.isGM) {
    game.settings.registerMenu(MODULE_ID, "playerPermissions", {
      name: "GINZZZU_CAMERA_FRAMES.App.Permissions.MenuName",
      label: "GINZZZU_CAMERA_FRAMES.App.Permissions.MenuLabel",
      hint: "GINZZZU_CAMERA_FRAMES.App.Permissions.MenuHint",
      icon: "fa-solid fa-user-shield",
      type: PlayerPermissionsConfig,
      restricted: true
    });
    return;
  }

  game.settings.registerMenu(MODULE_ID, "personalAppearance", {
    name: "GINZZZU_CAMERA_FRAMES.App.Personal.MenuName",
    label: "GINZZZU_CAMERA_FRAMES.App.Personal.MenuLabel",
    hint: "GINZZZU_CAMERA_FRAMES.App.Personal.MenuHint",
    icon: "fa-solid fa-camera-retro",
    type: PersonalAppearanceConfig,
    restricted: false
  });
}

Hooks.once("ready", () => {
  try {
    registerSettingsMenus();
  } catch (error) {
    console.error(`${MODULE_ID} | Camera settings menus initialization failed.`, error);
  }
});
