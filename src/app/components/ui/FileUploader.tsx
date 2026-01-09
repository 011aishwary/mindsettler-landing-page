"use client"
import { on } from 'events';
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image';
import { convertFileToUrl } from '../../../../lib/utils';

type FileUploaderProps = {
    files: File[] | undefined;
    onChange: (files: File[]) => void;
}

const FileUploader = ({ files, onChange }: FileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
        onChange(acceptedFiles);
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div {...getRootProps()} className='text-12-regular flex cursor-pointer  text-purple3/50 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-purple3 bg-purple3/2  mt-2 p-5'>
            <input {...getInputProps()} />
            {files && files?.length > 0 ? (
                <Image src={convertFileToUrl(files[0])} alt="file uploaded" width={400} height={400}
                 />
            ):(
                <>
                <Image src={"/assets/upload-cloud.svg"} alt="upload" width={40} height={40} />
                <div className=" flex flex-col justify-center gap-2 text-center text-dark-600">
                    <p className="text-[14px] leading-[18px] font-normal">
                        <span className="text-green-500">
                            Click to Upload
                        </span> or drag and drop
                    </p>
                    <p className="text-12-regular">
                        SVG, PNG, JPG or GIF (max. 800x400px)
                    </p>
                </div>
                </>
            )}
        
            
        </div>
    )
}

export default FileUploader;

