exports = async function(){
  const AdmZip = require("adm-zip");
  const http = context.http;
  
  const lastUpdateURL = "http://data.gdeltproject.org/gdeltv2/lastupdate.txt";
  const lastUpdate = (await http.get({ url: lastUpdateURL })).body.text();
  const exportMatch = lastUpdate.match(/http:\/\/data.gdeltproject.org\/gdeltv2\/(\d+).export.CSV.zip/)
  const csvURL = exportMatch[0];
  const downloadId = exportMatch[1];
  
  const latestCSV = (await http.get({ url: csvURL })).body;
  const zip = new AdmZip(new Buffer(latestCSV.toBase64(), 'base64'));
  const csvData = zip.getEntries()[0].getData().toString('utf-8');
  const csvLines = csvData.split("\n");
  
  if (csvLines[csvLines.length - 1] === "") {
    csvLines.pop();
  }
  const rows = csvLines.map((line) => line.split("\t"));
  await context.functions.execute("insertCSVRows", rows, downloadId);

};
