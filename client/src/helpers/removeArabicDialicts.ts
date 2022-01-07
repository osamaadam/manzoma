export const removeArabicDialicts = (text: string) => {
  const arabicNormChar = {
    ک: "ك",
    ﻷ: "لا",
    أ: "ا",
    إ: "ا",
    آ: "ا",
    ٱ: "ا",
    ٳ: "ا",
    ة: "ه",
    "ِ": "",
    "ْ": "",
    "ُ": "",
    "َ": "",
    "ّ": "",
    "ٍ": "",
    "ً": "",
    "ٌ": "",
    "ٓ": "",
    "ٰ": "",
    "ٔ": "",
    "�": "",
  };

  return text
    .replace(/ي\s+/g, "ى ")
    .replace(/ي$/g, "ى")
    .replace(/[^\u0000-\u007E]/g, (a) => {
      // @ts-ignore
      let retval = arabicNormChar[a];
      if (retval === undefined) {
        retval = a;
      }
      return retval;
    })
    .normalize("NFKD")
    .toLowerCase();
};
