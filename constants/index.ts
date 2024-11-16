export const GenderOptions = ["male", "female", "other"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [ 
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "Roumodip Das",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Aditi Das",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "Pasupathi Sharma",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Kunal Kesh",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Sneha Sarkar",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Saptarshi banerjee",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Shruti Kiran",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Priya Jha",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Nikunj Ranjan",
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};