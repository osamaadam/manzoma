export const normalizeArabic = (text: string) => {
  const arabicNormChar = {
    ک: "ك",
    ﻷ: "لا",
    أ: "ا",
    إ: "ا",
    آ: "ا",
    ٱ: "ا",
    ٳ: "ا",
    ة: "ه",
  };

  return (
    text
      .replace(/(\/|\d+)/g, (val) => ` ${val} `)
      .replace(/(\(\s+|\s+\))/g, (val) => val.trim())
      .replace(/\s+/g, " ")
      .replace(/ي\s+/g, "ى ")
      .replace(/ي$/g, "ى")
      // @ts-ignore
      .replace(/[^\u0000-\u007E]/g, (a) => arabicNormChar[a] ?? a)
      .trim()
  );
};
