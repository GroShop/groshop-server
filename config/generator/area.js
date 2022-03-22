const generateConfig = {
  moduleName: "Area",
  routeVersion: "v1",
  parameters: [
    {
      name: "name",
      sensitive: false,
      type: "String",
      isUploadable: false,
      isRequired: true,
      isSearchable: true,
      isEditable: true,
    },
    {
      name: "pincode",
      sensitive: false,
      type: "Array",
      subType: "number",
      isUploadable: false,
      isRequired: false,
      isSearchable: false,
      isEditable: true,
    },
    {
      name: "created_by",
      sensitive: false,
      type: "String",
      isUploadable: false,
      isRequired: false,
      ref: "user",
      isSearchable: false,
      isEditable: false,
    },
  ]
}

module.exports = generateConfig;