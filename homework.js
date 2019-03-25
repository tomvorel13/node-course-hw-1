"use strict";

const request = require("request");
const rp = require("request-promise");
const luke = "http://swapi.co/api/people/1";

const callbacks = () => {
  const list = [];
  request.get(luke, (err, res, body) => {
    if (err) {
      console.log(err);
    } else {
      const data = JSON.parse(body);
      const vehicles = data.vehicles;
      vehicles.map(v => {
        request.get(v, (err, res, body) => {
          if (err) {
            console.log(err);
          } else {
            const vehiclesObj = JSON.parse(body);
            const vehicleName = vehiclesObj.name;
            list.push(vehicleName);
            if (vehicles.length === list.length) {
              console.log("Luke's Whips:", list);
            }
          }
        });
      });
    }
  });
};

// PROMISES
const promises = () => {
  rp.get(luke)
    .then(data => {
      const dataObj = JSON.parse(data);
      const vehicles = dataObj.vehicles;
      const promises = vehicles.map(v => {
        return rp.get(v).then(res => {
          return JSON.parse(res);
        });
      });
      Promise.all(promises).then(res => {
        const vehicleList = res.map(vehicle => vehicle.name);
        console.log("Luke's Whips:", vehicleList);
      });
    })
    .catch(err => console.log(err));
};

// ASYNC / AWAIT
const asyncawait = async () => {
  try {
    const data = await rp.get(luke);
    const dataObj = JSON.parse(data);
    const vehicles = dataObj.vehicles;
    const getVehicles = async () => {
      return await Promise.all(
        vehicles.map(async v => {
          const data = await rp.get(v);
          return JSON.parse(data);
        })
      );
    };
    const vehicleData = await getVehicles();
    const vehicleList = vehicleData.map(v => v.name);
    console.log("Luke's Whips:", vehicleList);
  } catch (err) {
    console.log(err);
  }
};

callbacks();
// promises();
// asyncawait();
