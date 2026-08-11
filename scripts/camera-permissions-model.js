export const PLAYER_RULE_KEYS = Object.freeze([
  "shape",
  "frameStyle",
  "frame",
  "frameColor",
  "frameFinish",
  "glare",
  "innerShadow"
]);

const { ArrayField, BooleanField, StringField } = foundry.data.fields;

function enabledField() {
  return new BooleanField({ required: true, nullable: false, initial: true });
}

function allowedField() {
  return new ArrayField(
    new StringField({ required: true, nullable: false, blank: false }),
    { required: true, nullable: false, initial: [] }
  );
}

export class PlayerCustomizationRulesModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const schema = {};
    for (const key of PLAYER_RULE_KEYS) {
      schema[`${key}Enabled`] = enabledField();
      schema[`${key}Allowed`] = allowedField();
    }
    return schema;
  }
}

export function buildDefaultRuleSource(optionValuesByCategory) {
  const source = {};
  for (const key of PLAYER_RULE_KEYS) {
    source[`${key}Enabled`] = true;
    source[`${key}Allowed`] = [...(optionValuesByCategory[key] ?? [])];
  }
  return source;
}

export function rulesModelToCategoryMap(value) {
  const source = value?.toObject?.() ?? value ?? {};
  const result = {};

  for (const key of PLAYER_RULE_KEYS) {
    result[key] = {
      enabled: Boolean(source[`${key}Enabled`]),
      allowed: Array.isArray(source[`${key}Allowed`])
        ? [...source[`${key}Allowed`]]
        : []
    };
  }

  return result;
}

export function categoryMapToRuleSource(categoryMap) {
  const source = {};
  for (const key of PLAYER_RULE_KEYS) {
    source[`${key}Enabled`] = Boolean(categoryMap[key]?.enabled);
    source[`${key}Allowed`] = Array.isArray(categoryMap[key]?.allowed)
      ? [...categoryMap[key].allowed]
      : [];
  }
  return source;
}
