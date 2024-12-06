const cloudinaryUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

export const uploadImage = async (
  file: File,
  path: string = 'eda'
): Promise<string> => {
  try {
    const form = new FormData()

    form.append('file', file)
    form.append('upload_preset', cloudinaryUploadPreset)
    form.append('folder', path)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/upload`,
      {
        method: 'POST',
        body: form,
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json'
        }
      }
    )

    const data = await res.json()
    const secureUrl = data.secure_url
    return secureUrl as string
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}
