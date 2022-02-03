export default {
  StatusType: [
    {
      id: 0,
      name: "غير مبين",
    },
    {
      id: 1,
      name: "موقف طبي",
    },
    {
      id: 2,
      name: "رفت طبي",
    },
  ],
  Status: [
    {
      id: 0,
      name: "بدون موقف",
      statusTypeId: 0,
    },
    {
      id: 1,
      name: "موقف طبي",
      statusTypeId: 1,
    },
    {
      id: 2,
      name: "رفت طبي",
      statusTypeId: 2,
    },
  ],
};
