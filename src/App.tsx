import React from 'react';
import './App.css';
import {BlockedProcessChecker} from "./BlockedProcessChecker";
import {HeicConverterUtil} from "./HeicConverterUtil";

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
                const photo = await HeicConverterUtil.processPhoto(file)
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

    public render() {
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
