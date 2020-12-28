import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import pdfDoc from './sdf.pdf';
export default function AllPages(props) {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const { pdf } = props;

  return (
  <div className="w3-center all-page-container" >
    <Document
      file={pdfDoc}
      options={{workerSrc: "pdf.worker.js"}}
      onLoadSuccess={onDocumentLoadSuccess}
    >
      {Array.from(new Array(numPages), (el, index) => (
        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
      ))}
    </Document>
    </div>
  );
}