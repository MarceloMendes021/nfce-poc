import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

type Item = {
  description: string;
  quantity: number;
  unit: string;
  unitValue: number;
  totalValue: number;
};

type NfceResponse = {
  establishment: {
    name: string;
  };
  items: Item[];
};

export default function ResultScreen() {
  const { url } = useLocalSearchParams<{ url: string }>();

  const [data, setData] = useState<NfceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //   const API_URL = "https://SEU-ENDERECO.trycloudflare.com/nfce";
  const API_URL = "https://roger-nickel-flowers-nobody.trycloudflare.com/nfce";

  useEffect(() => {
    async function loadNfce() {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar NFC-e");
        }

        const json = await response.json();
        setData(json);
      } catch (err) {
        setError("Não foi possível carregar a nota");
      } finally {
        setLoading(false);
      }
    }

    if (url) {
      loadNfce();
    }
  }, [url]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={styles.text}>Carregando nota fiscal…</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{data.establishment.name}</Text>

      {data.items.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.itemTitle}>{item.description}</Text>
          <Text style={styles.itemText}>
            {item.quantity} {item.unit} × R$ {item.unitValue.toFixed(2)}
          </Text>
          <Text style={styles.itemTotal}>R$ {item.totalValue.toFixed(2)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
  },

  center: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },

  item: {
    backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  itemTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },

  itemText: {
    color: "#B3B3B3",
    fontSize: 14,
  },

  itemTotal: {
    color: "#1DB954",
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 4,
  },

  text: {
    color: "#B3B3B3",
    marginTop: 8,
  },

  error: {
    color: "#FF6B6B",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
