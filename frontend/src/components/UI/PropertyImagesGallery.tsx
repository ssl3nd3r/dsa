import React, { useCallback, useEffect, useState } from 'react'
import { Fade } from '@mui/material';
import CloseIcon from './Assets/CloseIcon';
import useEmblaCarousel from 'embla-carousel-react'


interface PropertyImagesGalleryProps {
  open: boolean;
  images: string[];
  setGalleryOpen: (open: boolean) => void;
}

export default function PropertyImagesGallery({open, images, setGalleryOpen}: PropertyImagesGalleryProps) {
  const [isOpen, setIsOpen] = useState(open);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
  });


  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
  }, [emblaApi])

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
  }, [emblaApi])

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <Fade in={isOpen} timeout={500}>
      <div className='fixed flex flex-col justify-center items-center dark:text-white text-black dark:bg-black/50 bg-white/50 backdrop-blur-sm w-full h-full top-0 left-0 z-50'>
        <button onClick={() => setGalleryOpen(false)} className='absolute top-4 right-4 cursor-pointer'>
          <CloseIcon />
        </button>
        <div className="embla w-2/3 h-2/3" ref={emblaRef}>
          <div className="embla__container">
            {images.map((image, index) => (
              <div className="embla__slide overflow-hidden cursor-grab active:cursor-grabbing" key={index}>
                <img src={image} alt="Property Image" className="mx-auto h-full object-contain" />
              </div>
            ))}
          </div>
        </div>
        <div className='flex mt-6 gap-4'>
          <PrevButton onPrevButtonClick={onPrevButtonClick} />
          <NextButton onNextButtonClick={onNextButtonClick} />
        </div>
      </div>
    </Fade>
  )
}

export const PrevButton = ({onPrevButtonClick}: {onPrevButtonClick: () => void}) => {

  return (
    <button
      className="embla__button embla__button--prev cursor-pointer"
      type="button"
      onClick={onPrevButtonClick}
    >
      <svg className="embla__button__svg" viewBox="0 0 532 532">
        <path
          fill="currentColor"
          d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
        />
      </svg>
    </button>
  )
}

export const NextButton = ({onNextButtonClick}: {onNextButtonClick: () => void}) => {
  return (
    <button
      className="embla__button embla__button--next cursor-pointer"
      type="button"
      onClick={onNextButtonClick}
    >
      <svg className="embla__button__svg" viewBox="0 0 532 532">
        <path
          fill="currentColor"
          d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z"
        />
      </svg>
    </button>
  )
}
