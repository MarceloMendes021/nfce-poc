import express from "express";
import cors from "cors";
import { fetchNfce } from "./fetchNfce";
import { parseNfce } from "./parseNfce";

const app = express();
const PORT = 3333;

app.use(express.json());
app.use(cors());

app.post("/nfce", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL da NFC-e não informada" });
    }

    const html = await fetchNfce(url);
    const data = parseNfce(html);

    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao processar NFC-e" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
