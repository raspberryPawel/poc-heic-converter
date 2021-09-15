import { expose } from "threads/worker"
const convert = require("heic-convert");

const heicConverter = {
    convert: async (file: File): Promise<string> => {
        const arrayBuffer2Base64 = (arrayBuffer: ArrayBuffer) => {
            return btoa(
                new Uint8Array(arrayBuffer)
                    .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
        }
        
        return new Promise(async (resolve, reject) => {
            const reader: FileReader = new FileReader();

            reader.onerror = (e) => {
                reject("reader error");
            };

            reader.onload = async () => {
                try {
                    const outputBuffer = await convert({
                        buffer: new Uint8Array(reader.result as any),
                        format: "JPEG",
                        quality: 1,
                    });

                    resolve(arrayBuffer2Base64(outputBuffer));
                } catch (e) {
                    console.log("HEIC WORKER ERROR => ", e);
                    reject(e);
                }
            };

            reader.readAsArrayBuffer(file);
        });
    },
}

export type HeicConverter = typeof heicConverter

expose(heicConverter)