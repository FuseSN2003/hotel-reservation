export const formInputs = [
  {
    label: "First Name",
    type: "text",
    id: "first-name",
    name: "first-name",
    required: true,
    key: "firstName",
    pattern: "^[A-Za-zก-๏\\- ]{1,35}$",
    max: 35,
    placeHolder: "only alphabet characters are allowed.",
    errorMessage: "Only A-Z, a-z, ตัวอักษรไทย"
  },
  {
    label: "Last Name",
    type: "text",
    id: "last-name",
    name: "last-name",
    required: true,
    key: "lastName",
    pattern: "^[A-Za-zก-๏\\- ]{1,35}$",
    max: 35,
    placeHolder: "only alphabet characters are allowed.",
    errorMessage: "Only A-Z, a-z, ตัวอักษรไทย"
  },
  {
    label: "Address",
    type: "text",
    id: "address",
    name: "address",
    required: true,
    key: "address",
    pattern: "^[A-Za-zก-๏/0-9.'\\-\\#\\& ]{1,35}$",
    max: 35,
    errorMessage: "Only A-Z, a-z, ตัวอักษรไทย, -, #, &, 1-9"
  },
  {
    label: "Province",
    type: "text",
    id: "province",
    name: "province",
    required: true,
    key: "province",
    pattern: "^[A-Za-zก-๏]{1,35}$",
    max: 35,
    errorMessage: "Only A-Z, a-z, ตัวอักษรไทย"
  },
  {
    label: "District",
    type: "text",
    id: "district",
    name: "district",
    required: true,
    key: "district",
    pattern: "^[A-Za-zก-๏]{1,35}$",
    max: 35,
    errorMessage: "Only A-Z, a-z, ตัวอักษรไทย"
  },
  {
    label: "Sub-District",
    type: "text",
    id: "sub-district",
    name: "sub-district",
    required: true,
    key: "subDistrict",
    pattern: "^[A-Za-zก-๏]{1,35}$",
    max: 35,
    errorMessage: "Only A-Z, a-z, ตัวอักษรไทย"
  },
  {
    label: "Postcode",
    type: "text",
    id: "postcode",
    name: "postcode",
    required: true,
    key: "postcode",
    pattern: "^[\\#0-9A-Z]{1,10}$", //UK postcode contain A-Z
    max: 10,
    errorMessage: "Only #, 0-9, A-Z"
  },
  {
    label: "Phone Number",
    type: "text",
    id: "phone-number",
    name: "phone-number",
    required: true,
    key: "phoneNumber",
    pattern: "^[0-9]{0,10}$",
    max: 10,
    placeHolder: "only numeric characters are allowed.",
    errorMessage: "Only 0-9"
  },
  {
    label: "Email",
    type: "email",
    id: "email",
    name: "email",
    required: true,
    key: "email",
    max: 35,
    errorMessage: ""
  },
  {
    errorMessage: "Only A-Z, a-z, ตัวอักษรไทย, 0-9, -, ., (, )",
    key:""
  }
];

export const specialRequest = {
  pattern: "^[A-Za-zก-๏/0-9\\.'\\-\\(\\) ]*$",
  errorMessage: "Only A-Z, a-z, ก-๏, 0-9, -, ., (, )"
}