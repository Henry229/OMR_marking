'use client';

import { ChangeEvent, DragEvent, useState } from 'react';
import GridSpinner from './ui/GridSpinner';
import FilesIcon from './ui/FileIcon';
import Image from 'next/image';

export default function ReadOMR() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [file, setFile] = useState<File>();
  const [dragging, setDragging] = useState(false);

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

  return (
    <section>
      {loading && (
        <div>
          <GridSpinner />
        </div>
      )}
      {error && <p>{error}</p>}
      <form>
        <input
          type='file'
          name='input'
          id='input-upload'
          accept='image/*'
          onChange={handleChange}
        />
        <label
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
      </form>
    </section>
  );
}
