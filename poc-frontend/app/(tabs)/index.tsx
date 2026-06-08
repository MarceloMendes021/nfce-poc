import { Camera, CameraView } from "expo-camera";
import { useEffect, useState } from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === "granted");
    })();
  }, []);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    setIsScanning(false);

    router.push({
      pathname: "/result",
      params: { url: data },
    });
  };

  if (hasCameraPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>Solicitando permissão da câmera…</Text>
      </View>
    );
  }

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

      {!isScanning && (
        <>
          <Text style={styles.title}>POC NFC-e</Text>
          <Text style={styles.subtitle}>Leia o QR Code da nota fiscal</Text>

          <Pressable
            style={styles.button}
            onPress={() => {
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
          <CameraView style={StyleSheet.absoluteFillObject} onBarcodeScanned={scanned ? undefined : handleBarcodeScanned} barcodeScannerSettings={{ barcodeTypes: ["qr"] }} />

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
