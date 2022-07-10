<script lang="ts">
  import { Button, Card, H1 } from "attractions";
  import { PdfViewer } from "../pdf";
  import DocumentCutter from '../DocumentCutter';

  export let moveNext = () => {};
  export let files: Array<File>;
  let formData: any = {
    containsText: [],
    linkClicked: false,
    highlightsClicked: true,
    imagesClicked: false,
    textRange: ""
  };

  let indexes: Array<number> = [0,1,2];

  const handleDocuments = async () => {
    const pdfViewerObj = new PdfViewer(files, formData);

    await pdfViewerObj.load();
    pdfViewerObj.renderPages(indexes);

    moveNext();
  };

  const handleDownload = async () => {
    // iterate over files and download each one
    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      const dc = new DocumentCutter(files[fileIndex]);
      const name = files[fileIndex].name.slice(0, -4);
      await dc.processDocument(indexes, `${ name }_new_version_${fileIndex + 1}.pdf`);
    }
  }

  handleDocuments();

</script>

<div>
  <H1>Preview</H1>


  <Card>
    <div id='pdf-viewer'></div>
  </Card>

  <div class="process-btn">
    <Button danger filled on:click={handleDownload}>Download</Button>
  </div>

</div>


<style>

  /* move submit-btn to the relative right side of the screen */
  .process-btn {
    float:right;
    /* add some padding */
    padding: 20px;
  }

</style>
