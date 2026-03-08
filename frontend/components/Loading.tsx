import React from 'react'

export default function Loading() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8fafc',
    }}>
      <div style={{ position: 'relative', width: 56, height: 56 }}>
        {/* Track ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '3px solid #e0e7ff',
        }} />

        {/* Spinning arc */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '3px solid transparent',
          borderTopColor: '#2563eb',
          borderRightColor: '#93c5fd',
          animation: 'spin 0.9s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        }} />

        {/* Center dot */}
        {/* <div style={{
          position: 'absolute',
          inset: '50%',
          transform: 'translate(-50%, -50%)',
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: '#2563eb',
          opacity: 0.7,
        }} /> */}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}