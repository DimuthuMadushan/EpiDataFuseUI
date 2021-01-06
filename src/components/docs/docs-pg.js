import React, { Component } from "react";
import { Document, Page } from "react-pdf";
import pdfDoc from './EpidatafuseDocumentation.pdf';
export default class App extends Component {
  state = { numPages: null, pageNumber: 1 };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  goToPrevPage = () =>{
        if(this.state.pageNumber>1){
            this.setState(state => ({ pageNumber: state.pageNumber - 1 }));
        }
    }
  goToNextPage = () =>
  {
    if(this.state.pageNumber<5){
        this.setState(state => ({ pageNumber: state.pageNumber + 1 }));
  }}


  render() {
    const { pageNumber, numPages } = this.state;

    return (
      <div className="all-page-container w3-center">
        <div>
          <Document
            file={pdfDoc}
            onLoadSuccess={this.onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber} width={600} />
          </Document>
        </div>

        <p>
          Page {pageNumber} of {numPages}
        </p>
        <nav>
                  <button onClick={this.goToPrevPage}>Prev</button>
                  <button onClick={this.goToNextPage}>Next</button>
                </nav>

      </div>
    );
  }
}
