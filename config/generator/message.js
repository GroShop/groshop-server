const generateConfig = {
  moduleName: 'Message',
  isUnique: true, // Will be used in controller(Create) to determine the param
  parameters: [
    {
      name: 'cart',
      type: "String",
      ref: "cart",
      isRequired: false,
      isSearchable: true,
      isUnique: false,
      isUploadable: false,
      sensitive: false,
    },
    {
      name: 'sender',
      type: "String",
      isRequired: false,
      isValidationRequired: false,
      isEditable: true,
      isSearchable: true,
      isUnique: false,
      isUploadable: false,
      sensitive: false,
    },
    {
      name: 'receiver',
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
    {
      name: 'content',
      type: "String",
      isRequired: true,
      isValidationRequired: true,
      isEditable: true,
      isSearchable: true,
      isUnique: false,
      isUploadable: false,
      sensitive: false,
    },
  ],
};

module.exports = generateConfig;