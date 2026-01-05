export async function fetchNfce(url: string): Promise<string> {
  // Faz a requisição HTTP para a URL da NFC-e
  const response = await fetch(url);

  // Se a resposta não for OK (200–299), lançamos erro
  if (!response.ok) {
    throw new Error(`Erro ao buscar NFC-e. Status: ${response.status}`);
  }

  // Retorna o HTML completo da página
  const html = await response.text();

  return html;
}

// import axios from "axios";
// import fs from "fs";

// const url = "http://www.fazenda.pr.gov.br/nfce/qrcode?p=41251275315333022269655210001396881048579175|2|1|1|40E97535AF5FA1BA2E21C43DFD83396A50D6F988";

// async function fetchNfce() {
//   try {
//     const response = await axios.get(url, {
//       headers: {
//         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
//       },
//     });

//     console.log("Status:", response.status);
//     console.log("HTML length:", response.data.length);

//     // salva o HTML em arquivo
//     fs.writeFileSync("nfce.html", response.data);

//     console.log("Arquivo nfce.html salvo com sucesso");
//   } catch (error) {
//     console.error("Erro ao buscar NFC-e:", error);
//   }
// }

// fetchNfce();
