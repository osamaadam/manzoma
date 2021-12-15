export const generateRelAddress = (
  address: string,
  center?: string,
  governorate?: string,
  maxLength: number = 50
) => {
  const fullAddress = [address, center, governorate].join("-");
  const addressWithCenter = [address, center].join("-");

  if (fullAddress.length <= maxLength) return fullAddress;
  else if (addressWithCenter.length <= maxLength) return addressWithCenter;
  else return address;
};
