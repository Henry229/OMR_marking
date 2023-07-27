import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { file } = req.body;

  if (!file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  const response = await fetch('http://localhost:5000/readOMR', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: file,
    }),
  });

  if (!response.ok) {
    return res
      .status(response.status)
      .json({ error: 'Error in processing image' });
  }

  const data = await response.json();
  return res.status(200).json(data);
}

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
