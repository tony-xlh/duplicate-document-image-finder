export class DuplicateDocumentImageFinder {
  private cv:any;
  constructor() {
    if (!("cv" in window)) {
      throw new Error("OpenCV not found");
    }else{
      this.cv = window["cv"];
    }
  }
  detect(_source1:HTMLImageElement,_source2:HTMLImageElement):boolean{
    return true;
  }

  find(images:HTMLImageElement[]):HTMLImageElement[] {
    return images;
  }
}