import QRCode from "qrcode";

export async function generateQR(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    width: 280,
    margin: 2,
    color: {
      dark: "#7A5A2D",
      light: "#00000000"
    }
  });
}
