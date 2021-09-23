const convert = require("heic-convert");

export class HeicConverterUtil {
    public static async processPhoto(file: File): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const reader: FileReader = new FileReader();

            reader.onerror = (e) => {
                reject("reader error");
            };

            reader.onload = async () => {
                try {
                    let arrayBuffer = new Uint8Array(reader.result as any);
                    const outputBuffer = await convert({
                        buffer: arrayBuffer,
                        format: "JPEG",
                        quality: 1,
                    });

                    resolve(HeicConverterUtil.arrayBuffer2Base64(outputBuffer));
                } catch (e) {
                    console.log("HEIC WORKER ERROR => ", e);
                    reject(e);
                }
            };

            reader.readAsArrayBuffer(file);
        });
    }

    protected static arrayBuffer2Base64 = (arrayBuffer: ArrayBuffer) => {
        return btoa(
            new Uint8Array(arrayBuffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
    }
}