import {
  AlignmentType,
  Document,
  HeightRule,
  ISectionOptions,
  Paragraph,
  SectionType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  UnderlineType,
  VerticalAlign,
  WidthType,
} from "docx";
import { DateTime } from "luxon";

export interface Soldier {
  name: string;
  solasy_no: string;
  segl_no: string | number;
  national_no: string | number;
  governorate: string;
  moahel: string;
  tagneed: string;
  birth_date: string;
}

export const documentGenerator = (soldiers: Soldier[]) => {
  return new Document({
    sections: soldiers
      .map((soldier, index) => [
        genSection(
          soldier,
          index % 2 ? SectionType.CONTINUOUS : SectionType.NEXT_PAGE
        ),
        !(index % 2) && {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "",
                  break: 2,
                }),
              ],
            }),
          ],
          properties: { type: SectionType.CONTINUOUS },
        },
      ])
      .flat()
      .filter((s) => s),
  });
};

const genSection = (
  soldier: Soldier,
  type: SectionType = SectionType.CONTINUOUS
): ISectionOptions => {
  return {
    properties: {
      type,
      page: {
        margin: {
          top: 500,
          right: 250,
          bottom: 500,
          left: 250,
        },
      },
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: "إدارة الإشـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــارة",
            bold: true,
            size: 28,
            font: "calibri",
            rightToLeft: true,
            underline: {
              type: UnderlineType.SINGLE,
            },
          }),
          new TextRun({
            break: 1,
            text: "مركز تدريب مشترك الإشارة رقم 2",
            bold: true,
            size: 28,
            font: "calibri",
            rightToLeft: true,
            underline: {
              type: UnderlineType.SINGLE,
            },
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "نموذج رصد الاجهزة البدنية",
            bold: true,
            size: 36,
            font: "calibri",
            rightToLeft: true,
            underline: {
              type: UnderlineType.SINGLE,
            },
          }),
        ],
      }),
      new Paragraph({
        children: [new TextRun("")],
      }),
      genPhysicalTable(soldier),
      new Paragraph({
        children: [new TextRun("")],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: "معلومات اضافية: مؤشر كتلة الجسم: ........ نسبة الدهون: ........ % نسبة العضلات: ........ % الاحتياج اليومي للسعرات الحرارية: ........ سعرة",
            font: "calibri",
            size: 24,
            rightToLeft: true,
          }),
        ],
      }),
      new Paragraph({
        children: [new TextRun("")],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "نموذج رصد نتائج جهاز شدة السمع",
            bold: true,
            size: 36,
            font: "calibri",
            rightToLeft: true,
            underline: {
              type: UnderlineType.SINGLE,
            },
          }),
        ],
      }),
      new Paragraph({
        children: [new TextRun("")],
      }),
      genHearingTable(soldier),
    ],
  };
};

const genHearingTable = (soldier: Soldier) =>
  new Table({
    visuallyRightToLeft: true,
    alignment: AlignmentType.CENTER,
    width: {
      size: 11000,
      type: WidthType.DXA,
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          genTableHeader({
            text: "م",
            size: 1000,
            rowSpan: 2,
          }),
          genTableHeader({
            text: "البيانات",
            size: 4000,
            rowSpan: 2,
          }),
          genTableHeader({
            text: "الأذن اليمنى",
            size: 4000,
            columnSpan: 4,
          }),
          genTableHeader({
            text: "الأذن اليسرى",
            size: 4000,
            columnSpan: 4,
          }),
        ],
      }),
      new TableRow({
        tableHeader: true,
        children: [
          genTableHeader({
            text: "500",
            size: 1000,
          }),
          genTableHeader({
            text: "1000",
            size: 1000,
          }),
          genTableHeader({
            text: "2000",
            size: 1000,
          }),
          genTableHeader({
            text: "4000",
            size: 1000,
          }),
          genTableHeader({
            text: "500",
            size: 1000,
          }),
          genTableHeader({
            text: "1000",
            size: 1000,
          }),
          genTableHeader({
            text: "2000",
            size: 1000,
          }),
          genTableHeader({
            text: "4000",
            size: 1000,
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: soldier.segl_no.toString().substring(2),
                    rightToLeft: true,
                    font: "calibri",
                    size: 24,
                  }),
                ],
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
            width: {
              size: 1000,
              type: WidthType.DXA,
            },
          }),
          new TableCell({
            verticalAlign: VerticalAlign.CENTER,
            width: {
              size: 4000,
              type: WidthType.DXA,
            },
            margins: {
              top: 50,
              bottom: 50,
              right: 100,
              left: 100,
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `رقم الملف: ${soldier.segl_no}`,
                    rightToLeft: true,
                    font: "calibri",
                    size: 24,
                  }),
                  new TextRun({
                    text: `الاسم: ${soldier.name}`,
                    rightToLeft: true,
                    break: 1,
                    font: "calibri",
                    size: 24,
                  }),
                  new TextRun({
                    text: `منطقة التجنيد: ${soldier.tagneed}`,
                    rightToLeft: true,
                    break: 1,
                    font: "calibri",
                    size: 24,
                  }),
                  new TextRun({
                    text: `المؤهل: ${soldier.moahel}`,
                    rightToLeft: true,
                    break: 1,
                    font: "calibri",
                    size: 24,
                  }),
                ],
              }),
            ],
          }),
          ...genEmptyCells(8),
        ],
      }),
    ],
  });

const genPhysicalTable = (soldier: Soldier) =>
  new Table({
    visuallyRightToLeft: true,
    alignment: AlignmentType.CENTER,
    width: {
      size: 11000,
      type: WidthType.DXA,
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          genTableHeader({
            text: "م",
            size: 1000,
            rowSpan: 2,
          }),
          genTableHeader({
            text: "البيانات",
            size: 4000,
            rowSpan: 2,
          }),
          genTableHeader({
            text: "التناسق",
            size: 2000,
            columnSpan: 2,
          }),
          genTableHeader({
            text: "بذل الجهد",
            size: 2000,
            rowSpan: 2,
          }),
          genTableHeader({
            text: "الظهر و  الرجلين",
            size: 2000,
            rowSpan: 2,
          }),
          genTableHeader({
            text: "قبضة اليد",
            size: 2000,
            columnSpan: 2,
          }),
        ],
      }),
      new TableRow({
        tableHeader: true,
        children: [
          genTableHeader({
            text: "الطول",
            size: 1000,
          }),
          genTableHeader({
            text: "الوزن",
            size: 1000,
          }),
          genTableHeader({
            text: "يمنى",
            size: 1000,
          }),
          genTableHeader({
            text: "يسرى",
            size: 1000,
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: soldier.segl_no.toString().substring(2),
                    rightToLeft: true,
                    font: "calibri",
                    size: 24,
                  }),
                ],
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
            width: {
              size: 1000,
              type: WidthType.DXA,
            },
          }),
          new TableCell({
            margins: {
              top: 50,
              bottom: 50,
              right: 100,
              left: 100,
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `الرقم الثلاثي: ${soldier.solasy_no
                      .split("/")
                      .reverse()
                      .join("/")}`,
                    rightToLeft: true,
                    font: "calibri",
                    size: 24,
                  }),
                  new TextRun({
                    break: 1,
                    text: `الاسم: ${soldier.name}`,
                    rightToLeft: true,
                    font: "calibri",
                    size: 24,
                  }),
                  new TextRun({
                    break: 1,
                    text: `السن: ${DateTime.now()
                      .diff(DateTime.fromISO(soldier.birth_date), ["years"])
                      .toObject()
                      .years.toFixed(0)}`,
                    rightToLeft: true,
                    font: "calibri",
                    size: 24,
                  }),
                  new TextRun({
                    break: 1,
                    text: `المحافظة: ${soldier.governorate}`,
                    rightToLeft: true,
                    font: "calibri",
                    size: 24,
                  }),
                ],
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
            width: {
              size: 1000,
              type: WidthType.DXA,
            },
          }),
          ...genEmptyCells(6),
        ],
      }),
    ],
  });

const genTableHeader = ({
  text,
  size,
  rowSpan = 1,
  columnSpan = 1,
}: {
  text: string;
  size: number;
  rowSpan?: number;
  columnSpan?: number;
}) =>
  new TableCell({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text,
            rightToLeft: true,
            bold: true,
            font: "calibri",
            size: 24,
          }),
        ],
      }),
    ],
    verticalAlign: VerticalAlign.CENTER,
    width: {
      size,
      type: WidthType.DXA,
    },
    rowSpan,
    columnSpan,
  });

const genEmptyRow = (numOfCols: number) => {
  let children: TableCell[] = [];
  for (let i = 0; i < numOfCols; i++) {
    children.push(new TableCell({ children: [] }));
  }
  return new TableRow({
    height: {
      rule: HeightRule.ATLEAST,
      value: 1500,
    },
    children,
  });
};

const genEmptyCells = (numOfCells: number) => {
  let cells: TableCell[] = [];
  for (let i = 0; i < numOfCells; i++) {
    cells.push(new TableCell({ children: [] }));
  }

  return cells;
};
