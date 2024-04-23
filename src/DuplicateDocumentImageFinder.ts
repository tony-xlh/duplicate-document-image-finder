import leven from "leven";

export interface TextLine{
  x:number;
  y:number;
  width:number;
  height:number;
  text:string;
}
export class DuplicateDocumentImageFinder {
  private tess:any;
  private threshold:number = 0.7;
  private tessLogger:any = function(m:any){console.log(m);}
  async initTesseract(lang:string){
    if (!("Tesseract" in window)) {
      throw new Error("Tesseract not found");
    }else{
      let Tesseract = (window as any)["Tesseract"];
      this.tess = await Tesseract.createWorker(lang, 1, {
        logger: this.tessLogger
      });
    }
  }

  setThreshold(threshold:number) {
    this.threshold = threshold;
  }

  setTessLogger(fn:any) {
    this.tessLogger = fn;
  }

  async detect(source1:HTMLImageElement,source2:HTMLImageElement){
    const textLines1 = await this.recognize(source1);
    const textLines2 = await this.recognize(source2);
    const similarity = this.textSimilarity(textLines1,textLines2);
    if (similarity > this.threshold) {
      return true;
    }else{
      return false;
    }
  }

  textSimilarity(lines1:TextLine[],lines2:TextLine[]):number {
    const text1 = this.textOfLines(lines1);
    const text2 = this.textOfLines(lines2);
    const distance = leven(text1,text2);
    const similarity =  (1 - distance / Math.max(text1.length,text2.length));
    return similarity;
  }

  textOfLines(lines:TextLine[]){
    let content = "";
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];
      content = content + line.text + "\n";
    }
    return content;
  }

  async recognize(source:HTMLImageElement,lang?:string,confidenceThreshold?:number):Promise<TextLine[]> {
    if (!this.tess) {
      await this.initTesseract(lang ?? "eng");
    }
    const textLines:TextLine[] = [];
    const threshold = confidenceThreshold ?? 50;
    const result = await this.tess.recognize(source);
    const lines = result.data.lines;
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];
      const width = line.bbox.x1 - line.bbox.x0;
      const height = line.bbox.y1 - line.bbox.y0;
      if (line.confidence > threshold && width > 10) {
        const textLine:TextLine = {
          x:line.bbox.x0,
          y:line.bbox.y0,
          width:width,
          height:height,
          text:line.text
        }
        textLines.push(textLine);
      }
    }
    return textLines;
  }

  async find(images:HTMLImageElement[],textLinesOfImages?:TextLine[][],progressCallback?:any):Promise<HTMLImageElement[]> {
    if (!textLinesOfImages) {
      textLinesOfImages = [];
      for (let index = 0; index < images.length; index++) {
        if (progressCallback) {
          progressCallback("OCR "+index);
        }
        const image = images[index];
        const lines = await this.recognize(image);
        textLinesOfImages.push(lines);
      }
    }
    if (progressCallback) {
      progressCallback("Calculating");
    }
    let indexObject:any = {};
    for (let index = 0; index < textLinesOfImages.length; index++) {
      if (index + 1 < textLinesOfImages.length) {
        const textLines1 = textLinesOfImages[index];
        const textLines2 = textLinesOfImages[index+1];
        const similarity = this.textSimilarity(textLines1,textLines2);
        console.log(similarity);
        if (similarity > this.threshold) {
          indexObject[index] = "";
          indexObject[index+1] = "";
        }
      }
    }
    let duplicateImages:HTMLImageElement[] = [];
    const keys = Object.keys(indexObject);
    for (let index = 0; index < keys.length; index++) {
      const key:number = parseInt(keys[index]);
      duplicateImages.push(images[key]);
    }
    return duplicateImages;
  }
}