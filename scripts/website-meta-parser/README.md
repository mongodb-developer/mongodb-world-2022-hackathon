# Website Meta Information Parser

This parser will query the GDELT recent events data from MongoDB looking for entries that are missing an `Info` field. For any document missing the `Info` field, a web scrape is done based on the `SourceURL` to collect any news headlines, descriptions, images, etc., for displaying within the UX. The website meta information is then inserted into the MongoDB documents using the document id that was returned in the first query.

## Instructions

To run this script, do the following:

1. Copy the project's **.env.example** file and rename it to **.env** to hold our script variables.
2. Replace the `ATLAS_*` fields in the **.env** file with values of your own GDELT project within MongoDB Atlas.
3. Run `npm install` from within the project to install any script dependencies.
4. Run `node main.js` to execute the script.

You'll need to have MongoDB Atlas properly configured with GDELT data prior to executing or configuring the script.