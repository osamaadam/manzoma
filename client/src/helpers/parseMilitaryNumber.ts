export const parseMilitaryNumber = (militaryNo: string | number) => {
  if (!militaryNo) return null;
  militaryNo = militaryNo.toString();

  const marhla = +militaryNo.slice(0, 4);
  const tagneedId = +militaryNo[4];
  const moahelId = +militaryNo[5];
  const weaponId = +militaryNo.slice(6, 8);
  const serial = +militaryNo.slice(-5);

  return {
    marhla,
    tagneedId,
    moahelId,
    weaponId,
    serial,
  };
};
