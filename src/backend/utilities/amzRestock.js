const MwsApi = require('amazon-mws');
const fs = require('fs');
const path = require('path')
const
  SELLER_ID = 'AXIATCKCVD08Z',
  MWS_AUTH_TOKEN = 'amzn.mws.84b9bc3f-0d58-8927-02a1-3fae9ec20821',
  MARKET_PLACE_ID_US = 'ATVPDKIKX0DER',
  MARKET_PLACE_ID_CA = 'A2EUQ1WTGCTBG2',
  MARKET_PLACE_ID_MX = 'A1AM78C64UM0Y8',
  accessKey = 'AKIAII3OZS75ANHTSU7Q',
  accessSecret = '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';

const amazonMws = new MwsApi();
amazonMws.setApiKey(accessKey, accessSecret);


let start = Date.now();

// var ASINList = [
//     'B01CA4383E',
//     'B074WHMGN3',
//     'B01H287HF8'
// ];

var data = {
  'Version': '2009-01-01',
  'SellerId': SELLER_ID,
  'MWSAuthToken': MWS_AUTH_TOKEN,
  'MarketplaceId': MARKET_PLACE_ID_US,
};

const getReport = async (reportId) => {

    try{
      const response = await amazonMws.reports.search({
        ...data,
        'Action': 'GetReport',
        'ReportId': reportId
      })

      return response;
    }
    catch(e){
      console.log('error products', e);
      await timeout(TIMEOUT);
      return getReport(reportId);
    }

}

const requestReport = async () => {

  try{
    const response = await amazonMws.reports.submit({
      ...data,
      'Action': 'RequestReport',
      'ReportType': '_GET_RESTOCK_INVENTORY_RECOMMENDATIONS_REPORT_'
    })

    return response.ReportRequestInfo.ReportRequestId;

  }
  catch(e){
    console.log('error products', e);
  }



}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const TIMEOUT = 30000;
const getGeneratedReportId = async (ReportRequestId) => {
  try{
    console.log('getGeneratedReport called: ', (Date.now() - start));
    const response = await amazonMws.reports.search({
      ...data,
      'Action': 'GetReportRequestList',
      'ReportType': '_GET_RESTOCK_INVENTORY_RECOMMENDATIONS_REPORT_',
      'ReportRequestIdList.Id.1': ReportRequestId
    })


    if(response.ReportRequestInfo && response.ReportRequestInfo.ReportProcessingStatus === "_DONE_"){
      return response.ReportRequestInfo.GeneratedReportId;
    }
    else {
      await timeout(TIMEOUT);
      return getGeneratedReportId(ReportRequestId);
    }

  }
  catch(e){
    console.log('error products', e);
    await timeout(TIMEOUT);
    return getGeneratedReportId(ReportRequestId);
  }

}

//4 stage process
getRestockReport = async () => {
  const ReportRequestId = await requestReport();
  // const ReportRequestId = '73975018486'

  await timeout(TIMEOUT);
  const generatedReportId = await getGeneratedReportId(ReportRequestId);
  // const generatedReportId = '22414590594018486'

  console.log('Got generated report Id: ', generatedReportId);
  let reportId = generatedReportId;
  // if(!generatedReportId){
  //   //reportId = Get report list (ReportRequestId)
  // }
  //
  const report = await getReport(reportId)

  const resultDict = {};
  report.data.map( row => {
    resultDict[row.ASIN] = {
      amzRec: row["Recommended replenishment qty"],
      last30: row["Units Sold Last 30 Days"],
      FBAstk: row["Total Units"]
    }
  })

  console.log(resultDict);

}

getRestockReport();