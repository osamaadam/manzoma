export const generateRelAddress = (
  address: string,
  center?: string,
  governorate?: string
) => {
  const fullAddress = [address, center, governorate].join(" - ");
  const addressWithCenter = [address, center].join(" - ");
  const MAX_LENGTH = 50;

  if (fullAddress.length <= MAX_LENGTH) return fullAddress;
  else if (addressWithCenter.length <= MAX_LENGTH) return addressWithCenter;
  else return address;
};
