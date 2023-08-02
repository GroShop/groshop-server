const generateConfig = {
  moduleName: 'Product',
  isUnique: true, // Will be used in controller(Create) to determine the param
  parameters: [
    {
      name: "name", // Name of the param
      sensitive: false, // To hide information like password
      type: "String",
      isUploadable: false, // Will be used in frontend for using input="file"
      isRequired: true, // Will be used in Interface
      isSearchable: true, // Will be used in controller(Get Many)
      isEditable: true, // Will be used in Validation and Interface
      isUnique: true, // Will be used in controller(Create) to determine the param
      isValidationRequired: true // Will be used in Validation
    },
    {
      name: 'price',
      sensitive: false,
      type: 'String',
      isUploadable: false,
      isRequired: true,
      isValidationRequired: true,
      isSearchable: true,
      isEditable: true,
    },
    {
      name: 'product_pic',
      sensitive: false,
      type: 'String',
      isUploadable: true,
      isRequired: true,
      isValidationRequired: true,
      isSearchable: true,
      isEditable: true,
    },
    {
      name: 'tag',
      sensitive: false,
      type: 'Array',
      isUploadable: false,
      isRequired: false,
      isSearchable: false,
      isEditable: false,
    },
    {
      name: 'categories',
      sensitive: false,
      type: 'String',
      isUploadable: false,
      isRequired: false,
      isSearchable: false,
      isEditable: false,
    },
    {
      name: 'description',
      sensitive: false,
      type: 'String',
      isUploadable: false,
      isRequired: false,
      isSearchable: false,
      isEditable: false,
    },
    {
      name: 'rating',
      sensitive: false,
      type: 'Number',
      isUploadable: false,
      isRequired: false,
      isSearchable: false,
      isEditable: false,
    },
    {
      name: 'stock',
      sensitive: false,
      type: 'Number',
      isUploadable: false,
      isRequired: false,
      isSearchable: false,
      isEditable: false,
    },
    {
      name: 'discount',
      sensitive: false,
      type: 'Number',
      isUploadable: false,
      isRequired: false,
      isSearchable: false,
      isEditable: false,
    },
  ],
};

module.exports = generateConfig;