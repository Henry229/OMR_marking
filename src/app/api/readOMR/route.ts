import { NextRequest, NextResponse } from 'next/server';

// 이미지 파일을 base64로 인코딩하는 함수
function encodeImageFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function POST(req: NextRequest) {
  // export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const form = await req.formData();
  const file = form.get('file') as Blob;

  if (!file) {
    return new Response('No file provided', { status: 400 });
    //   // return res.status(400).json({ error: 'No file provided' });
  }

  console.log('>>> file: ', file);

  // Extract the File object from the ReadableStream
  // const fileReader = file.getReader();
  // const { value } = await fileReader.read();
  // const fileObject = value ? new File([value], 'filename') : undefined;

  // if (!fileObject) {
  // return new Response('Error creating file object', { status: 400 });
  // }

  // 이미지 파일을 base64로 인코딩
  const base64Image = await encodeImageFileAsBase64(file);

  const response = await fetch('http://localhost:5000/readOMR', {
    // const response = await fetch('http://localhost:5000/readOMR', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'multipart/form-data',
    },
    body: JSON.stringify({
      image: base64Image,
    }),
  });

  if (!response.ok) {
    return new Response('No file provided', { status: 400 });
    // return res
    //   .status(response.status)
    //   .json({ error: 'Error in processing image' });
  }

  const data = await response.json();
  return NextResponse.json(data);
}

// import { NextApiRequest, NextApiResponse } from 'next';
// import { NextRequest, NextResponse } from 'next/server';

// // 이미지 파일을 base64로 인코딩하는 함수
// function encodeImageFileAsBase64(file: File): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onloadend = () => resolve(reader.result as string);
//     reader.onerror = reject;
//     reader.readAsDataURL(file);
//   });
// }

// export default async function POST(req: NextRequest) {
//   // export default async function POST(req: NextApiRequest, res: NextApiResponse) {
//   const file = req.body;

//   if (!file) {
//     return new Response('No file provided', { status: 400 });
//     //   // return res.status(400).json({ error: 'No file provided' });
//   }

//   console.log('>>> body: ', req.body);

//   // 이미지 파일을 base64로 인코딩
//   const base64Image = await encodeImageFileAsBase64(file);

//   const response = await fetch('http://localhost:5000/readOMR', {
//     // const response = await fetch('http://localhost:5000/readOMR', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       // 'Content-Type': 'multipart/form-data',
//     },
//     body: JSON.stringify({
//       image: req.body,
//     }),
//   });

//   if (!response.ok) {
//     return new Response('No file provided', { status: 400 });
//     // return res
//     //   .status(response.status)
//     //   .json({ error: 'Error in processing image' });
//   }

//   const data = await response.json();
//   return NextResponse.json(data);
// }

// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const formData = req.body;

//   const response = await fetch('http://localhost:5000/readOMR', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       image: formData.file,
//     }),
//   });

//   if (!response.ok) {
//     res.status(response.status).json({ error: 'Error in processing image' });
//     return;
//   }

//   const data = await response.json();
//   res.status(200).json(data);
// }

// import { NextRequest } from 'next/server';

// export async function POST(req: NextRequest) {
//   return await fetch( 'http://localhost:5000/readOMR', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({image: image}),
//     });
//     const form = await req.formData();
//     const text = form.get('text')?.toString();
//     const file = form.get('file') as Blob;

//     if (!text || !file) {
//       return new Response('Bad Request', { status: 400 });
//     }

//     return createPost(user.id, text, file) //
//       .then((data) => NextResponse.json(data));
//   });
// }
