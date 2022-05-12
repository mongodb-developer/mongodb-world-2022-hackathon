exports = async function(rows, downloadId) {
  const db = context.services.get("mongodb-atlas").db("gdelt-stream");

  const eventsCSV = await db.collection("eventscsv");
  const headings = [
    "_id",	// GlobalEventId int64()
    "Day",	// int64()
    "MonthYear",	// int64()
    "Year",	// int64()
    "FractionDate",	// double()
    "Actor1Code",	
    "Actor1Name",	
    "Actor1CountryCode",	
    "Actor1KnownGroupCode",	
    "Actor1EthnicCode",	
    "Actor1Religion1Code",	
    "Actor1Religion2Code",	
    "Actor1Type1Code",	
    "Actor1Type2Code",	
    "Actor1Type3Code",	
    "Actor2Code",	
    "Actor2Name",	
    "Actor2CountryCode",	
    "Actor2KnownGroupCode",	
    "Actor2EthnicCode",	
    "Actor2Religion1Code",	
    "Actor2Religion2Code",	
    "Actor2Type1Code",	
    "Actor2Type2Code",	
    "Actor2Type3Code",	
    "IsRootEvent",	// int64()
    "EventCode",	
    "EventBaseCode",	
    "EventRootCode",	
    "QuadClass",	// int64()
    "GoldsteinScale",	// double()
    "NumMentions",	// int64()
    "NumSources",	// int64()
    "NumArticles",	// int64()
    "AvgTone",	// double()
    "Actor1Geo_Type",	// int64()
    "Actor1Geo_Fullname",	
    "Actor1Geo_CountryCode",	
    "Actor1Geo_ADM1Code",	
    "Actor1Geo_ADM2Code",	
    "Actor1Geo_Lat",	
    "Actor1Geo_Long",	
    "Actor1Geo_FeatureID",	
    "Actor2Geo_Type",	// int64()
    "Actor2Geo_Fullname",	
    "Actor2Geo_CountryCode",	
    "Actor2Geo_ADM1Code",	
    "Actor2Geo_ADM2Code",	
    "Actor2Geo_Lat",	
    "Actor2Geo_Long",	
    "Actor2Geo_FeatureID",	
    "ActionGeo_Type",	// int64()
    "ActionGeo_Fullname",	
    "ActionGeo_CountryCode",	
    "ActionGeo_ADM1Code",	
    "ActionGeo_ADM2Code",	
    "ActionGeo_Lat",	
    "ActionGeo_Long",	
    "ActionGeo_FeatureID",	
    "DATEADDED",	
    "SOURCEURL",	
  ];
  
    const int64Fields = [
    //"_id",	// GlobalEventId int64()
    "Day",	// int64()
    "MonthYear",	// int64()
    "Year",	// int64()
    "IsRootEvent",	// int64()
    "QuadClass",	// int64()
    "NumMentions",	// int64()
    "NumSources",	// int64()
    "NumArticles",	// int64()
    "Actor1Geo_Type",	// int64()
    "Actor2Geo_Type",	// int64()
    "ActionGeo_Type",	// int64()
  ];
  const doubleFields = [
    "FractionDate",	// double()
    "GoldsteinScale",	// double()
    "AvgTone",	// double()
  ];
  
  const docs = [];
  rows.forEach((row, i) => {
    const doc = Object.fromEntries(headings.map((k, i) => [k, row[i] === "" ? undefined : row[i]]));
    doc["_id"] = parseInt(doc["_id"]);
    int64Fields.forEach((k) => {
      doc[k] = { "$numberLong": doc[k] };
    });
    doubleFields.forEach((k) => {
      doc[k] = {"$numberDouble": doc[k]};
    });
    doc["downloadId"] = downloadId;
    docs.push(doc);
  });
  
  const insertResult = await eventsCSV.insertMany(docs);
  
  const matchTheseDocs = {
    $match: {
      downloadId: downloadId,
    }
  }
  
  const reshapeActors = {
    $project: {
      GlobalEventId: 1,

      Day: 1,
      MonthYear: 1,
      Year: 1,
      FractionDate: 1,

      Actor1: {
          Code: "$Actor1Code",
          Name: "$Actor1Name",
          CountryCode: "$Actor1CountryCode",
          KnownGroupCode: "$Actor1KnownGroupCode",
          EthnicCode: "$Actor1EthnicCode",
          Religion1Code: "$Actor1Religion1Code",
          Religion2Code: "$Actor1Religion2Code",
          Type1Code: "$Actor1Type1Code",
          Type2Code: "$Actor1Type2Code",
          Type3Code: "$Actor1Type3Code",
          Geo_Type: "$Actor1Geo_Type",
          Geo_Fullname: "$Actor1Geo_Fullname",
          Geo_CountryCode: "$Actor1Geo_CountryCode",
          Geo_ADM1Code: "$Actor1Geo_ADM1Code",
          Geo_ADM2Code: "$Actor1Geo_ADM2Code",
          Location: {
              type: "Point",
              coordinates: [
                { $convert: { input: "$Actor1Geo_Long", to: "double", onError: 0.00, onNull: 0.00 }},  
                { $convert: { input: "$Actor1Geo_Lat", to: "double", onError: 0.00, onNull: 0.00 }}
              ]
          },
          Geo_FeatureID: "$Actor1Geo_FeatureID",
      },
      Actor2: {
          Code: "$Actor2Code",
          Name: "$Actor2Name",
          CountryCode: "$Actor2CountryCode",
          KnownGroupCode: "$Actor2KnownGroupCode",
          EthnicCode: "$Actor2EthnicCode",
          Religion1Code: "$Actor2Religion1Code",
          Religion2Code: "$Actor2Religion2Code",
          Type1Code: "$Actor2Type1Code",
          Type2Code: "$Actor2Type2Code",
          Type3Code: "$Actor2Type3Code",
          Geo_Type: "$Actor2Geo_Type",
          Geo_Fullname: "$Actor2Geo_Fullname",
          Geo_CountryCode: "$Actor2Geo_CountryCode",
          Geo_ADM1Code: "$Actor2Geo_ADM1Code",
          Geo_ADM2Code: "$Actor2Geo_ADM2Code",
          Location: {
              type: "Point", coordinates: [
                { $convert: { input: "$Actor2Geo_Long", to: "double", onError: 0.00, onNull: 0.00 }},
                { $convert: { input: "$Actor2Geo_Lat", to: "double", onError: 0.00, onNull: 0.00 }}
              ]
          },
          Geo_FeatureID: "$Actor2Geo_FeatureID",
      },
      Action: {
          Geo_Type: "$ActionGeo_Type",
          Geo_Fullname: "$ActionGeo_Fullname",
          Geo_CountryCode: "$ActionGeo_CountryCode",
          Geo_ADM1Code: "$ActionGeo_ADM1Code",
          Geo_ADM2Code: "$ActionGeo_ADM2Code",
          Location: {
              type: "Point", coordinates: [
                { $convert: { input: "$ActionGeo_Long", to: "double", onError: 0.00, onNull: 0.00 }}, 
                { $convert: { input: "$ActionGeo_Lat", to: "double", onError: 0.00, onNull: 0.00 }}
              ]
          },
          Geo_FeatureID: "$ActionGeo_FeatureID",
      },
      IsRootEvent: 1,
      EventCode: 1,
      EventBaseCode: 1,
      EventRootCode: 1,
      QuadClass: 1,
      GoldsteinScale: 1,
      NumMentions: 1,
      NumSources: 1,
      NumArticles: 1,
      AvgTone: 1,
      internal: {
        downloadId: "$downloadId"
      }
    },
  };
  
  const result = await eventsCSV.aggregate([
      matchTheseDocs,
      reshapeActors,
      { 
        $merge: {
          into: "temp_events",
        }
      },
  ]);
  
  return result;
  
};