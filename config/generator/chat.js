const generateConfig = {
  moduleName: 'Chat',
  isUnique: true, // Will be used in controller(Create) to determine the param
  parameters: [
    {
      name: 'isAdmin',
      type: "Array",
      ref: "user",
      isRequired: false,
      isSearchable: true,
      isUnique: false,
      isUploadable: false,
      sensitive: false,
    },
    {
      name: 'groupChat',
      type: "Boolean",
      isRequired: false,
      isValidationRequired: false,
      isEditable: true,
      isSearchable: true,
      isUnique: false,
      isUploadable: false,
      sensitive: false,
    },
    {
      name: 'users',
      type: "Array",
      ref: "user",
      isRequired: true,
      isValidationRequired: true,
      isEditable: true,
      isSearchable: false,
      isUnique: false,
      isUploadable: false,
      sensitive: false,
    },
  ],
};

module.exports = generateConfig;