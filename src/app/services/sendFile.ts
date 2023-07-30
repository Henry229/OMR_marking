export async function sendFile(file: Blob) {
  console.log('>>>>>>> Yogida <<<<<<<');
  return fetch('http://localhost:4000/readOMR', {
    method: 'POST',
    headers: {
      'content-type': file.type,
    },
    body: file,
  }).then((res) => res.json());
}

// try {
//     const sendFile = await  fetch('http://localhost:4000/readOMR', {
//       method: 'POST',
//       body: file
//     })
//     const sendResponse = await sendFile.json();
//     res.status(200).json(sendResponse);
//   } catch (error) {
//     res.status(error.statusCode).json({ error: 'Error updaloading file'})
//   }
// }

// async function sendFile(file: Blob) {
//   return fetch('http://localhost:4000/readOMR', {
//     method: 'POST',
//     body: file,
//   }).then((res) => res.json());
// }
