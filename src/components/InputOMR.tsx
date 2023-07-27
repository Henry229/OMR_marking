'use client';

import { ChangeEvent, DragEvent, FormEvent, useState } from 'react';
import GridSpinner from './ui/GridSpinner';
import FilesIcon from './ui/FileIcon';
import Image from 'next/image';
import Button from './ui/Button';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

export default function InputOMR() {
  // const { data, isLoading: loading, error } = useSWR('/api/opencv');
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target?.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const handleDrag = (e: DragEvent) => {
    if (e.type === 'dragenter') {
      setDragging(true);
    } else if (e.type === 'dragleave') {
      setDragging(false);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer?.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    fetch('/api/posts', { method: 'POST', body: formData }) //
      .then((res) => {
        if (!res.ok) {
          setError(`${res.status} ${res.statusText}`);
          return;
        }
        // api로 db에 insert가 제대로 이뤄졌다면 홈 경로로 이동한다.
        router.push('/');
      })
      .catch((err) => setError(err.toString()))
      .finally(() => setLoading(false));
  };

  return (
    <section className='flex flex-col items-center w-full max-w-xl mt-6'>
      {loading && (
        <div className='absolute inset-0 z-20 text-center pt-[30%] bg-sky-500/20'>
          <GridSpinner />
        </div>
      )}
      {error && (
        <p className='w-full p-4 mb-4 font-bold text-center text-red-600 bg-red-100'>
          {error}
        </p>
      )}
      <form className='flex flex-col w-full mt-2' onSubmit={handleSubmit}>
        <input
          className='hidden'
          type='file'
          name='input'
          id='input-upload'
          accept='image/*'
          onChange={handleChange}
        />
        <label
          className={`w-full h-60 flex flex-col items-center justify-center ${
            !file && 'border-2 border-sky-500 border-dashed'
          }`}
          htmlFor='input_upload'
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {dragging && (
            <div className='absolute inset-0 z-10 pointer-events-none bg-sky-500/20'></div>
          )}
          {!file && (
            <div className='flex flex-col items-center pointer-events-none'>
              <FilesIcon />
              <p>Drag and Drop your image here or click</p>
            </div>
          )}
          {file && (
            <div className='relative w-full aspect-square'>
              <Image
                className='object-cover'
                src={URL.createObjectURL(file)}
                alt='local file'
                fill
                sizes='650px'
              />
            </div>
          )}
        </label>
        <Button text='Upload' onClick={() => {}} />
      </form>
    </section>
  );
}
