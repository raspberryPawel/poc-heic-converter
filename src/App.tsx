import React from 'react';
import './App.css';
import {BlockedProcessChecker} from "./BlockedProcessChecker";

const convert = require("heic-convert");

export class App extends React.Component {
    protected fileInputRef: HTMLInputElement | null = null;
    protected imageContainer: HTMLDivElement | null = null;

    protected onClick = () => {
        const files = this.fileInputRef?.files;

        if (!this.fileInputRef) {
            console.error("There are no file input!");
            return;
        }

        if (!files || !files.length) {
            console.error("There are no files!");
            return;
        }

        this.processPhotos(files);
    }

    protected processPhotos = async (files: FileList) => {
        for (const file of files) {
            try {
                const photo = await this.processPhoto(file)

                this.createImage(photo)
            } catch {
                console.warn(`Photo: ${file.name} is not available.`)
            }
        }
    }

    protected createImage = (base64Photo: string) => {
        const image = new Image();

        image.onload = () => {
            const maxImageSize = 500;
            const ratio = image.height / image.width;

            if (image.width > image.height) {
                image.width = maxImageSize;
                image.height = maxImageSize * ratio;
            } else {
                image.height = maxImageSize;
                image.width = maxImageSize / ratio;
            }

            this.appendPhotoToContainer(image);
        }

        image.src = `data:image/jpeg;base64,${base64Photo}`;
    }

    protected appendPhotoToContainer = (image: HTMLImageElement) => {
        if (!this.imageContainer) {
            console.error("There are no image container");
            return;
        }

        this.imageContainer.appendChild(image)
    }

    protected processPhoto = async (file: File): Promise<string> => {
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

                    resolve(this.arrayBuffer2Base64(outputBuffer));
                } catch (e) {
                    console.log("HEIC WORKER ERROR => ", e);
                    reject(e);
                }
            };

            reader.readAsArrayBuffer(file);
        });
    }

    protected arrayBuffer2Base64 = (arrayBuffer: ArrayBuffer) => {
        return btoa(
            new Uint8Array(arrayBuffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
    }


    render() {
        return (
            <div className="App">
                <input type="file" multiple={true} ref={(ref) => this.fileInputRef = ref}/>
                <button onClick={this.onClick}>Konwertuj pliki HEIC!
                </button>
                <BlockedProcessChecker/>

                <div className={"imageContainer"} ref={(ref) => this.imageContainer = ref}></div>
            </div>
        );
    }
}

export default App;
