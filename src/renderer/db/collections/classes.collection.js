const schema = {
  title: "Classes schema",
  description: "Classes",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    number: {
      type: "string"
    },
    name: {
      type: "string",
      index: true
    },
    category: {
      type: "string",
      index: true
    },
    condition: {
      type: "string"
    },
    target: {
      type: "string"
    },
    position: {
      type: "string"
    },
    distance: {
      type: "string",
      index: true
    },
    type: {
      type: "string"
    },
    sight: {
      type: "string"
    },
    trigger: {
      type: "string"
    },
    calibre: {
      type: "string"
    },
    bulletType: {
      type: "string"
    },
    loadingRod: {
      type: "string"
    },
    cleaning: {
      type: "string"
    },
    team: {
      type: "string"
    },
    pictureUrl: {
      type: "string"
    },
    remarks: {
      type: "string"
    }
  },
  required: [
    "number",
    "name",
    "category",
    "condition",
    "target",
    "position",
    "distance",
    "type",
    "sight",
    "trigger",
    "calibre",
    "bulletType"
  ]
}

const methods = {}

export default {
  name: "classes",
  schema: schema,
  methods: methods
}
