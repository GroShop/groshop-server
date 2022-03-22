const config = {
  moduleName: "{MODULE_NAME}",
  routeVersion: "v1",
  parameters: [
    {
      name: "{PARAM_NAME}",
      sensitive: false,
      type: "String",
      isUploadable: false,
      isRequired: true,
      isSearchable: true,
      isEditable: true,
    },
  ],
};

module.exports = config;
