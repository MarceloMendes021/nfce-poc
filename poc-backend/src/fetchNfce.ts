export async function fetchNfce(url: string): Promise<string> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erro ao buscar NFC-e. Status: ${response.status}`);
  }

  return await response.text();
}
