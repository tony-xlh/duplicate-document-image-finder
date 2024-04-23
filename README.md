# duplicate-documet-image-finder

A JavaScript library to find duplicate document images.

How does it work?

It extracts the text of images using OCR and uses levenshtein distance to calculate the similarity between two texts.

## Methods and Interfaces

* `find`. Find the duplicated images. You can pass your own OCR results.

    ```ts
    async find(images:HTMLImageElement[],textLinesOfImages?:TextLine[][],progressCallback?:any):Promise<HTMLImageElement[]>
    ```

* `TextLine`

    ```ts
    export interface TextLine{
      x:number;
      y:number;
      width:number;
      height:number;
      text:string;
    }
    ```

## Install 

Via NPM:

```bash
npm install duplicate-document-image-finder
```

Via CDN:

```html
<script type="module">
  import { DuplicateDocumentImageFinder } from 'https://cdn.jsdelivr.net/npm/duplicate-document-image-finder/dist/duplicate-document-image-finder.js';
</script>
```

## License

MIT