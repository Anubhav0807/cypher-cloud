import React from 'react'

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Loading ...</p>
      </div>
    </div>
  )
}
