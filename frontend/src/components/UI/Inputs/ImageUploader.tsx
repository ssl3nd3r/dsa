import React, { useState, useMemo, useCallback } from 'react'
import GalleryIcon from '../Assets/GalleryIcon';
import CloseIcon from '../Assets/CloseIcon';
import { errorToast } from '../Toast';
interface ImageUploaderProps {
  onChange: (files: File[]) => void;
  isMulti?: boolean;
  value?: File[];
  name: string;
  label?: string;
  accept?: string;
}

interface ImageGridProps {
  files: File[];
  handleRemoveFile: (fileName: string) => void;
}

function ImageGrid({ files, handleRemoveFile }: ImageGridProps) {
  if (files.length === 0) return null;
  
  return (
    <div className='grid grid-cols-3 gap-2 mt-2'>
      {files.map((file, index) => (
        <div key={`${file.name}-${file.size}-${index}`} className='relative'>
          <img src={URL.createObjectURL(file)} alt={file.name} className='h-20 mx-auto' />
          <button 
            className='absolute top-0 right-0 cursor-pointer' 
            onClick={() => handleRemoveFile(file.name)}
          >  
            <CloseIcon size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function ImageUploader({ onChange, isMulti = false, value, label, name, accept }: ImageUploaderProps) {
  const [files, setFiles] = useState<File[]>(value ?? []);
  const [uploading, setUploading] = useState(false);

  const handleRemoveFile = useCallback((fileName: string) => {
    const updatedFiles = files.filter((f) => f.name !== fileName);
    setFiles(updatedFiles);
    onChange(updatedFiles);
    setUploading(false);
  }, [files, onChange]);
  return (
    <div className='flex flex-col gap-1'>
        {label && <span className='block text-sm'>{label}</span>}
        <label htmlFor={`${name}-image-uploader`} className='cursor-pointer rounded-md relative w-full px-3 py-2 outline-none border dark:border-white border-black dark:bg-black bg-white dark:text-gray-200 text-gray-800 focus:outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5'>
            {uploading ? (
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 dark:border-white border-black'></div>
            ) : (
                <>
                  <GalleryIcon size={16} />
                </>
            )}
            <span>{uploading ? 'Uploading...' : 'Upload Images'}</span>
        </label>
        <input id={`${name}-image-uploader`} type="file" className='hidden' multiple={isMulti} accept={accept} onChange={async (e) => {
            setUploading(true);
            const newFiles = e.target.files;
            
            if (newFiles) {
              let filesToAdd = Array.from(newFiles);
              filesToAdd.forEach((file) => {
                if (files.find((f) => f.name === file.name)) {
                  filesToAdd = filesToAdd.filter((f) => f.name !== file.name);
                  errorToast('Image with the same name already exists');
                }
              });
              const updatedFiles = [...files, ...filesToAdd];
              setFiles(updatedFiles);
              onChange(updatedFiles);
              setUploading(false);
            }
        }} />

        <ImageGrid files={files} handleRemoveFile={handleRemoveFile} />
    </div>
  )
}
