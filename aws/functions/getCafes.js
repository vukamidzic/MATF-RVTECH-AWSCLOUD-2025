exports.getCafes = async (event) => {
  console.log('Received event:', JSON.stringify(event.queryStringParameters, null, 2));
  const cafes = await fetch(`https://api.geoapify.com/v2/places?categories=catering.cafe&filter=circle:${event.queryStringParameters.lng},${event.queryStringParameters.lat},1000&apiKey=${process.env.GEOAPIFY_API_KEY}`)
  .then(response => response.json())
  .then(data => data.features.map(feature => feature.properties));

  
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
    },
    body: JSON.stringify({
      message: "Successfully found neighboring cafes",
      cafes: cafes
    })
  }
}
