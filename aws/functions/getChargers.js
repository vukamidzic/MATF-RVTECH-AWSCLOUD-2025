exports.getChargers = async () => {
  console.log("getChargers() invoked");

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
    },
    body: JSON.stringify({
      message: "Successfully retrieved chargers",
      chargers: [
        { name: "charger1", lnglat: [44.811531531477875, 20.424087833238755]},
        { name: "charger2", lnglat: [44.80932586915106, 20.431445811164267]},
        { name: "charger3", lnglat: [44.822119581665994, 20.418318930583]},
        { name: "charger4", lnglat: [44.815033634038784, 20.437236922702624]},
      ],
    })
  };
}
