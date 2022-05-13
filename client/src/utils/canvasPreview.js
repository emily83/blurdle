export async function canvasPreview(
  image,
  canvas,
  crop
) {
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('No 2d context')
  }

  canvas.width = 500
  canvas.height = 500

  const scale = crop.width / image.width

  ctx.imageSmoothingQuality = 'high'

  const cropX = crop.x * image.naturalWidth / image.width
  const cropY = crop.y * image.naturalHeight / image.height

  ctx.save()

  ctx.drawImage(
    image,
    cropX,
    cropY,
    image.naturalWidth * scale,
    image.naturalWidth * scale,
    0,
    0,
    500,
    500,
  )

  ctx.restore()
}