const generateConfig = {
  moduleName: 'Booking',
  isUnique: true, // Will be used in controller(Create) to determine the param
  parameters: [
    {
      name: 'amount',
      type: "Number",
      isRequired: true,
      isValidationRequired: true,
      isEditable: true,
      isSearchable: true,
      isUnique: false,
      isUploadable: false,
      sensitive: false,
    },
    {
      name: 'cart',
      type: "Array",
      ref: "cart",
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
      isSearchable: false,
      isUnique: false,
      isUploadable: false,
      sensitive: false,
    },
    {
      name: 'payment_type',
      type: "String",
      isRequired: true,
      isValidationRequired: true,
      isEditable: true,
      isSearchable: false,
      isUnique: false,
      isUploadable: false,
      sensitive: false,
    },
    {
      name: 'delivery_time',
      type: "String",
      isRequired: false,
      isValidationRequired: false,
      isEditable: true,
      isSearchable: false,
      isUnique: false,
      isUploadable: false,
      sensitive: false,
    },
    {
      name: 'address',
      type: "Object",
      isRequired: true,
      isValidationRequired: true,
      isEditable: true,
      isSearchable: false,
      isUnique: false,
      isUploadable: false,
      sensitive: false,
    },
    {
      name: 'voucher',
      type: "String",
      ref:'voucher',
      isRequired: true,
      isValidationRequired: true,
      isEditable: true,
      isSearchable: false,
      isUnique: false,
      isUploadable: false,
      sensitive: false,
    },
    {
      name: 'razorpay_payment_id',
      type: "String",
      isRequired: true,
      isValidationRequired: true,
      isEditable: true,
      isSearchable: false,
      isUnique: false,
      isUploadable: false,
      sensitive: false,
    },
    {
      name: 'razorpay_order_id',
      type: "String",
      isRequired: true,
      isValidationRequired: true,
      isEditable: true,
      isSearchable: false,
      isUnique: false,
      isUploadable: false,
      sensitive: false,
    },
    {
      name: 'razorpay',
      type: "Object",
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