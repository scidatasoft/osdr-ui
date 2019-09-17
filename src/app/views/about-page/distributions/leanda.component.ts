import { Component, OnInit } from '@angular/core';

@Component({
  template: `
    <h1>About Leanda</h1>
    <p>
      <b>Leanda.io</b> is a reincarnation of the Open Science Data Repository (or, OSDR, created by the awesome Data Science Software, LLC
      team!). Leanda alows consuming and managing of many different data types, formats and data volumes. Its unique architecture connects
      various modules without rebuilding the whole system. Currently a large set of modules is implemented providing general content
      management as well as scientific data handling. Our goal is to address functional, design and UX deficiencies of other systems and
      make Leanda the de-facto gold standard for Open Science community. Leanda's vision is to be an open tool based on open standards for
      improving data sharing and collaboration with a potential impact across many scientific areas.
    </p>
    <h5>Machine Learning</h5>
    <p>
      A machine learning (ML) framework is embedded into Leanda and can be used as an API, standalone tool or can be integrated in a new
      software as an autonomous module. Leanda provides a number of pipelines simplifying data science workflows used in research and drug
      discovery starting from data import and curation and finishing with the predictive models training, evaluation and application.
      Trained models can be shared with other users or made public.
    </p>
    <h5>Flexible data repository</h5>
    <p>
      There is a clear disconnect between domain-specific databases, publishers’ data repositories and semantic web knowledgebases. Leanda
      provides a basic data processing pipeline. Leanda allows real-time data curation and supports ontologies-based properties assignment
      with subsequent complex searches. Leanda’s deposition pipeline includes a data mining stage which allows text-mining and data
      conversion on the fly when a new file is deposited. Leanda security model supports private, shared and public data. Leanda, by
      incorporating data mining and a curation pipeline on top of integration with multiple data sources, provides a platform for rapid
      composition of training data sets for immediate modeling.
    </p>
    <h5>Format Adapters</h5>
    <p>
      Leanda supports various formats and is able to convert between them seamlessly on the fly at time of import or export. Leanda has the
      built in capability to load CSV files, specify column mapping to semantic type and run real-time conversion with results being
      visually controlled. Once information is imported into a system, other operations like exporting in various formats, modeling, etc.
      become possible.
    </p>
    <h5>Open platform for data acquisition, curation and dissemination</h5>
    <p>
      Data is essential for science and data repositories have existed for decades and have been well-supported by NSF and other grants, yet
      they are merely file stores. Leanda was designed to support multiple ways of data acquisition, conversion, real-time automated and
      manual data curation and dissemination through export and API.
    </p>
  `,
})
export class LeandaAboutComponent {}
