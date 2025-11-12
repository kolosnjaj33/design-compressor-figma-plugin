import { useState } from 'preact/hooks'
import imageCompression from 'browser-image-compression'
import './app.css'

export function App() {
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [compressed, setCompressed] = useState<string | null>(null)
  const [compressedSize, setCompressedSize] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [format, setFormat] = useState<'webp' | 'png'>('webp')
  const [quality, setQuality] = useState(75)

  function handleLoadImage() {
    parent.postMessage({ pluginMessage: { type: 'get-image' } }, '*')
  }

  function handleCancel() {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
  }

  async function handleCompress() {
    if (!imageBase64) return
    const { compressedBase64, size } = await compressImage(imageBase64, quality, format)
    setCompressed(compressedBase64)
    setCompressedSize(size)
  }

  async function compressImage(base64: string, quality: number, format: 'webp' | 'png') {
    const blob = await fetch(`data:image/png;base64,${base64}`).then(res => res.blob())
    const file = new File([blob], 'image.png', { type: blob.type })

    const compressedFile = await imageCompression(file, {
      maxSizeMB: 5,
      initialQuality: quality / 100,
      fileType: `image/${format}`,
      useWebWorker: true,
    })

    const compressedDataUrl = await imageCompression.getDataUrlFromFile(compressedFile)

    return {
      compressedBase64: compressedDataUrl.split(',')[1],
      size: (compressedFile.size / 1024).toFixed(2),
    }
  }

  function handleDownload() {
    if (!compressed) return
    const link = document.createElement('a')
    link.href = `data:image/${format};base64,${compressed}`
    link.download = `compressed.${format}`
    link.click()
  }

  window.onmessage = (event) => {
    const msg = event.data.pluginMessage
    if (!msg) return

    if (msg.type === 'error') {
      setError(msg.message)
      setImageBase64(null)
      setCompressed(null)
      setOriginalSize(null)
    }

    if (msg.type === 'image-bytes') {
      const bytes = new Uint8Array(msg.data)
      const base64 = arrayBufferToBase64(bytes.buffer)
      setError(null)
      setImageBase64(base64)
      setCompressed(null)

      const originalBytes = bytes.length
      setOriginalSize((originalBytes / 1024).toFixed(2))
    }
  }

  function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    const len = bytes.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
  }

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <h2>Design Compressor</h2>
      <button onClick={handleLoadImage}>Load Selected Image</button>
      <button onClick={handleCancel} style={{ marginLeft: '10px' }}>Cancel</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {imageBase64 && (
        <>
          <div style={{ marginTop: '20px' }}>
            <h3>Compression Settings</h3>
            <label>
              Format:
              <select
                value={format}
                onChange={(e) => setFormat((e.target as HTMLSelectElement).value as 'webp' | 'png')}
                style={{ marginLeft: '5px' }}
              >
                <option value="webp">WebP</option>
                <option value="png">PNG</option>
              </select>
            </label>
            <label style={{ marginLeft: '15px' }}>
              Quality:
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt((e.target as HTMLInputElement).value))}
                style={{ marginLeft: '5px' }}
              />
              {quality}%
            </label>
            <button onClick={handleCompress} style={{ marginLeft: '10px' }}>Compress</button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '20px' }}>
            <div>
              <p>Original {originalSize && `(${originalSize} KB)`}</p>
              <img src={`data:image/png;base64,${imageBase64}`} width="200" />
            </div>
            {compressed && (
              <div>
                <p>Compressed ({compressedSize} KB)</p>
                <img src={`data:image/${format};base64,${compressed}`} width="200" />
                <br />
                <button onClick={handleDownload} style={{ marginTop: '5px' }}>Download</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
