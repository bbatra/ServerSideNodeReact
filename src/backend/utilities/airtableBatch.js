var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyLHDlXFGBP21E4R'}).base('appRmNsz6U4L9kKgD');


function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// base('Products').select({
//   // Selecting the first 3 records in Grid view:
//   fields: ["SKU"],
// }).eachPage(function page(records, fetchNextPage) {
//   // This function (`page`) will get called for each page of records.
//
//   records.forEach(function(record) {
//     console.log('Retrieved', record.get('SKU'), ' : ', record.getId());
//   });
//
//   // To fetch the next page of records, call `fetchNextPage`.
//   // If there are more records, `page` will get called again.
//   // If there are no more records, `done` will get called.
//   fetchNextPage();
//
// }, function done(err) {
//   if (err) { console.error(err); return; }
// });


const getAllRecords = async (tableName = 'Products copy', fieldNames = []) => {

  try{
    const records = await base(tableName).select({
      // Selecting the first 3 records in Grid view:
      fields: ["SKU", ...fieldNames],
    }).all();

    return records;
  }
  catch(e){
    console.error(e);
  }

  return [];


}

const MAX_UPDATES_PER_CALL = 10;//Airtable limit
const mapUpdateRecords = async (tableName = 'Products copy', records, mapFunc) => {
  let updates = records.map(mapFunc);
  while (updates.length > 0) {
    const updateBatch = updates.slice(0, MAX_UPDATES_PER_CALL);
    //Update toUpdate
    try {
      const updated = await base(tableName).update(updateBatch);
      updates = updates.slice(MAX_UPDATES_PER_CALL);
    }
    catch(e){
      console.error('[ERROR] updating batch: ', e, '\n', {updateBatch});
    }
  }
}



const main = async () => {
  const records = await getAllRecords('Products copy', ['SKU', 'AmzRec']);
  const mapper = (record) => {
    return {
      id: record.id,
      fields : {
        AmzRec: Math.round(Math.random() * (-100))
      }
    }
  }
  await mapUpdateRecords('Products copy', records, mapper);
}


main()