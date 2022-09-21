import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err; //lanza el error al module que unsa este module, donde ahi manejamos el error
  }
};

// export const getJSON = async function (url) {
//   try {
//     const fetchPro = fetch(url);

//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     throw err; //lanza el error al module que unsa este module, donde ahi manejamos el error
//   }
// };
// export const sendJSON = async function (url, uploadData) {
//   try {
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });

//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); //timeout () so that it can't run forever

//     const data = await res.json(); //we need also any data coming back because this API return the data back that we just send

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     throw err; //lanza el error al module que unsa este module, donde ahi manejamos el error
//   }
// };
