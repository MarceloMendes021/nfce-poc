import { Camera, CameraView } from "expo-camera";
import { useEffect, useState } from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  // Permissão da câmera
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  // Controle de fluxo
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  // Resultado do QR
  const [qrData, setQrData] = useState<string | null>(null);

  // Pedir permissão ao abrir o app
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === "granted");
    })();
  }, []);

  // Quando o QR for lido
  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    setIsScanning(false);

    router.push({
      pathname: "/result",
      params: { url: data },
    });
  };

  // Permissão pendente
  if (hasCameraPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>Solicitando permissão da câmera…</Text>
      </View>
    );
  }

  // Permissão negada
  if (hasCameraPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>Permissão de câmera negada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* TELA INICIAL */}
      {!isScanning && !qrData && (
        <>
          <Text style={styles.title}>POC NFC-e</Text>
          <Text style={styles.subtitle}>Leia o QR Code da nota fiscal</Text>

          <Pressable
            style={styles.button}
            onPress={() => {
              setQrData(null);
              setScanned(false);
              setIsScanning(true);
            }}
          >
            <Text style={styles.buttonText}>Ler QR Code</Text>
          </Pressable>
        </>
      )}

      {isScanning && (
        <View style={StyleSheet.absoluteFillObject}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
          />

          <Pressable
            style={styles.backButton}
            onPress={() => {
              setIsScanning(false);
              setScanned(false);
            }}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </Pressable>
        </View>
      )}

      {/* RESULTADO */}
      {qrData && (
        <View style={styles.result}>
          <Text style={styles.subtitle}>QR Code lido:</Text>

          <Text selectable style={styles.qrText}>
            {qrData}
          </Text>

          <Pressable
            style={styles.button}
            onPress={() => {
              setQrData(null);
              setScanned(false);
            }}
          >
            <Text style={styles.buttonText}>Escanear novamente</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#B3B3B3",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  result: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 8,
  },
  qrText: {
    color: "#FFFFFF",
    marginVertical: 12,
  },
  button: {
    backgroundColor: "#1DB954",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
