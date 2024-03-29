const generateConfig = {
  moduleName: 'Voucher',
  isUnique: true, // Will be used in controller(Create) to determine the param
  parameters: [
    {
      name: 'name',
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
      name: 'discount',
      type: "Number",
      isRequired: false,
      isValidationRequired: false,
      isEditable: true,
      isSearchable: true,
      isUnique: false,
      isUploadable: false,
      sensitive: false,
    },
    {
      name: 'expire_voucher',
      type: "Date",
      isRequired: false,
      isValidationRequired: false,
      isEditable: true,
      isSearchable: false,
      isUnique: false,
      isUploadable: false,
      sensitive: false,
    },
    {
      name: 'user',
      type: "Array",
      subType: "String",
      ref: "user",
      sensitive: false,
      type: 'String',
      isUploadable: false,
      isRequired: false,
      ref: 'user',
      isSearchable: false,
      isEditable: false,
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