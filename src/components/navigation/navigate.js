<div className="App">
  <div className="w3-container w3-blue ">
    <h1>EpiDataFuse</h1>
    <p>Spatio Temporal Data Fusion Engine for Disease Survillence</p>
  </div>
  <div className="w3-bar w3-teal">
    <button className="w3-bar-item w3-button">Pipilines</button>
    <button className="w3-bar-item w3-button">Create Pipeline</button>
    <button className="w3-bar-item w3-button">Dashboard</button>
  </div>
  <header className="App-header">

    <div className="flex-container">
      <div className="box">
        <div className="w3-card">
          <h4>H-Base Configurations</h4>
          <HBaseConfig />
        </div>
        <div className="w3-card">
          <h4>Schema Configurations</h4>
          <SchemaConfig />
        </div>
        <div className="w3-card">
          <h4>Query</h4>
          <Query />
        </div>
      </div>
      <div className="box">
        <div className="w3-card">
          <h4>Ingest Configurations</h4>
          <IngestConfig />
        </div>
        <div className="w3-card">
          <h4>Source Connector</h4>
          <SourceConnector />
        </div>
      </div>
      <div className="box">
        <div className="w3-card">
          <h4>Granularity Configurations</h4>
          <GranularityConfig />
        </div>
        <div className="w3-card">
          <h4>Granularity Mapping Configurations</h4>
          <GranularityMappingConfig />
        </div>
        <div>
          <Home />
        </div>
      </div>
    </div>

  </header>
</div>