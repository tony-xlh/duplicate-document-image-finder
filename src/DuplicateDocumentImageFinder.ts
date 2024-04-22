export class DuplicateDocumentImageFinder {
  detect(_source1:HTMLImageElement,_source2:HTMLImageElement):boolean{
    return true;
  }

  find(images:HTMLImageElement[]):HTMLImageElement[] {
    return images;
  }
}