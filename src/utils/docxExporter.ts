import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType,
  AlignmentType,
  ShadingType,
} from 'docx';
import { TranslationResult } from '../types';

/**
 * Generates a real Microsoft Word (.docx) document from the translated result
 * and triggers a browser download.
 */
export async function downloadTranslatedDocx(
  result: TranslationResult,
  originalFilename: string
) {
  const children: any[] = [];

  // Title
  children.push(
    new Paragraph({
      text: result.documentTitle || 'Translated Document',
      heading: HeadingLevel.TITLE,
      spacing: { after: 300 },
      alignment: AlignmentType.CENTER,
    })
  );

  // Executive Summary Callout Box / Intro
  if (result.summary) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'EXECUTIVE SUMMARY: ',
            bold: true,
            color: '1E3A8A',
            size: 22,
          }),
          new TextRun({
            text: result.summary,
            italics: true,
            size: 22,
          }),
        ],
        spacing: { after: 360, before: 120 },
      })
    );
  }

  // Parse lines from translatedPlainText to extract headings, bullet points, and tables
  const lines = result.translatedPlainText.split('\n');
  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (tableRows.length > 0) {
      const docxRows = tableRows.map((rowCells, rIdx) => {
        const isHeader = rIdx === 0;
        return new TableRow({
          tableHeader: isHeader,
          children: rowCells.map(
            (cellText) =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: cellText.trim(),
                        bold: isHeader,
                        size: isHeader ? 22 : 20,
                        color: isHeader ? 'FFFFFF' : '111827',
                      }),
                    ],
                  }),
                ],
                shading: isHeader
                  ? { type: ShadingType.CLEAR, fill: '1E3A8A' }
                  : rIdx % 2 === 1
                  ? { type: ShadingType.CLEAR, fill: 'F3F4F6' }
                  : undefined,
                margins: { top: 120, bottom: 120, left: 160, right: 160 },
              })
          ),
        });
      });

      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: docxRows,
          margins: { top: 100, bottom: 200 },
        })
      );

      // Spacer after table
      children.push(new Paragraph({ spacing: { after: 200 } }));
      tableRows = [];
    }
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      if (inTable) flushTable();
      continue;
    }

    // Check if this line is part of a markdown / ascii table (e.g. | Col 1 | Col 2 |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      // Skip separator rows like |:---|:---| or |---|---|
      if (/^\|[\s\-:|]+\|$/.test(trimmed)) {
        continue;
      }
      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());
      inTable = true;
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Check headings
    if (trimmed.startsWith('# ')) {
      children.push(
        new Paragraph({
          text: trimmed.replace(/^#\s+/, ''),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 280, after: 140 },
        })
      );
    } else if (trimmed.startsWith('## ')) {
      children.push(
        new Paragraph({
          text: trimmed.replace(/^##\s+/, ''),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
        })
      );
    } else if (trimmed.startsWith('### ')) {
      children.push(
        new Paragraph({
          text: trimmed.replace(/^###\s+/, ''),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
        })
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      const bulletContent = trimmed.replace(/^[-*•]\s+/, '');
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun({ text: bulletContent, size: 22 })],
          spacing: { after: 80 },
        })
      );
    } else if (/^\d+\.\s+/.test(trimmed)) {
      const numContent = trimmed.replace(/^\d+\.\s+/, '');
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: trimmed.match(/^\d+\.\s+/)?.[0] || '', bold: true, size: 22 }),
            new TextRun({ text: numContent, size: 22 }),
          ],
          spacing: { after: 80 },
        })
      );
    } else {
      // Standard paragraph
      children.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, size: 22 })],
          spacing: { after: 140, line: 280 },
        })
      );
    }
  }

  if (inTable) flushTable();

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const cleanName = originalFilename.replace(/\.[^/.]+$/, '');
  a.href = downloadUrl;
  a.download = `${cleanName}_translated_EN.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
