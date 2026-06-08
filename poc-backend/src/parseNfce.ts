import * as cheerio from "cheerio";

type NfceItem = {
  description: string;
  quantity: number;
  unit: string;
  unitValue: number;
  totalValue: number;
};

type NfceResult = {
  establishment: {
    name: string;
  };
  items: NfceItem[];
};

export function parseNfce(html: string): NfceResult {
  const $ = cheerio.load(html);

  const establishmentName = $("#u20").text().trim();

  const items: NfceItem[] = [];

  $("#tabResult tr").each((_, row) => {
    const description = $(row).find(".txtTit2").text().trim();

    if (!description) return;

    const quantityText = $(row).find(".Rqtd").text().replace("Qtde.:", "").replace(",", ".").trim();
    const unitText = $(row).find(".RUN").text().replace("UN:", "").trim();
    const unitValueText = $(row).find(".RvlUnit").text().replace("Vl. Unit.:", "").replace(",", ".").trim();
    const totalValueText = $(row).find(".valor").text().replace(",", ".").trim();

    items.push({
      description,
      quantity: Number(quantityText),
      unit: unitText.replace(/[0-9]/g, ""),
      unitValue: Number(unitValueText),
      totalValue: Number(totalValueText),
    });
  });

  return {
    establishment: { name: establishmentName },
    items,
  };
}
