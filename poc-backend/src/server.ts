import express from "express";
import cors from "cors";
import { fetchNfce } from "./fetchNfce";
import { parseNfce } from "./parseNfce";

const app = express();
const PORT = 3333;

// permite receber JSON
app.use(express.json());

// permite acesso do app mobile
app.use(cors());

// endpoint principal da POC
app.post("/nfce", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL da NFC-e não informada" });
    }

    // 1️⃣ busca o HTML da NFC-e
    const html = await fetchNfce(url);

    // 2️⃣ extrai os dados
    const data = parseNfce(html);

    // 3️⃣ devolve para o front
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao processar NFC-e" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
