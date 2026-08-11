const { StringField } = foundry.data.fields;

function appearanceField() {
  return new StringField({
    required: true,
    nullable: false,
    blank: false,
    initial: "inherit"
  });
}

export class UserCameraAppearanceModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      shape: appearanceField(),
      frameStyle: appearanceField(),
      frame: appearanceField(),
      frameColor: appearanceField(),
      frameFinish: appearanceField(),
      glare: appearanceField(),
      innerShadow: appearanceField()
    };
  }
}
