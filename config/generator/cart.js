const generateConfig = {
  moduleName: 'Cart',
  isUnique: true, // Will be used in controller(Create) to determine the param
  parameters: [
    {
      name: 'product',
      type: "String",
      ref: "product",
      isRequired: true,
      isValidationRequired: true,
      isEditable: true,
      isSearchable: true,
      isUnique: false,
      isUploadable: false,
      sensitive: false,
    },
    {
      name: 'status',
      type: "String",
      isRequired: true,
      isValidationRequired: true,
      isEditable: true,
      isSearchable: true,
      isUnique: false,
      isUploadable: false,
      sensitive: false,
    },
    {
      name: 'weight',
      type: "Number",
      isRequired: true,
      isValidationRequired: true,
      isEditable: true,
      isSearchable: false,
      isUnique: false,
      isUploadable: false,
      sensitive: false,
    },
    {
      name: 'created_by',
      sensitive: false,
      type: 'String',
      isUploadable: false,
      isRequired: false,
      ref: 'user',
      isSearchable: false,
      isEditable: false,
    },
  ],
};

module.exports = generateConfig;