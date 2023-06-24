const generateConfig = {
  moduleName: 'wishlist',
  isUnique: true, // Will be used in controller(Create) to determine the param
  parameters: [
    {
      name: 'wishlist_product',
      type: "Array",
      subType: "String",
      ref: "product",
      isRequired: false,
      isValidationRequired: false,
      isEditable: true,
      isSearchable: true,
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