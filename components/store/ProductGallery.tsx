'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductGalleryProps {
  images: string[]
  name: string
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0)

  const UNOPTIMIZED_DOMAINS = ['placehold.co', 'images.unsplash.com']

  const needsUnoptimized = (url: string) => 
    url.startsWith('http') && UNOPTIMIZED_DOMAINS.some(d => url.includes(d))

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-neutral-100 rounded-xl flex items-center justify-center">
        <span className="text-neutral-400">Sin imagen</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square overflow-hidden rounded-xl bg-neutral-100">
        <Image
          src={images[selected]}
          alt={`${name} - imagen ${selected + 1}`}
          width={600}
          height={600}
          unoptimized={needsUnoptimized(images[selected])}
          className="object-cover w-full h-full"
        />
      </div>
      
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelected(idx)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                selected === idx
                  ? 'border-accent-600'
                  : 'border-transparent hover:border-neutral-300'
              }`}
              aria-label={`Ver imagen ${idx + 1}`}
            >
              <Image
                src={img}
                alt={`${name} miniatura ${idx + 1}`}
                width={80}
                height={80}
                unoptimized={needsUnoptimized(img)}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
