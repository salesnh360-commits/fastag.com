import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinaryUploadOptions {
    buffer: Buffer
    filename: string
    folder?: string
    publicId?: string
}

export interface CloudinaryUploadResult {
    url: string
    secureUrl: string
    publicId: string
    format: string
    width: number
    height: number
}

/**
 * Upload a buffer to Cloudinary
 */
export async function uploadToCloudinary(
    options: CloudinaryUploadOptions
): Promise<CloudinaryUploadResult> {
    const { buffer, filename, folder = 'products', publicId } = options

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: publicId || filename.split('.')[0],
                resource_type: 'auto',
                overwrite: true,
            },
            (error, result) => {
                if (error) {
                    reject(error)
                } else if (result) {
                    resolve({
                        url: result.url,
                        secureUrl: result.secure_url,
                        publicId: result.public_id,
                        format: result.format,
                        width: result.width,
                        height: result.height,
                    })
                } else {
                    reject(new Error('Upload failed - no result returned'))
                }
            }
        )

        // Write buffer to stream
        uploadStream.end(buffer)
    })
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId)
}

/**
 * Get optimized Cloudinary URL with transformations
 */
export function getOptimizedCloudinaryUrl(
    url: string,
    options?: {
        width?: number
        height?: number
        quality?: 'auto' | number
        format?: 'auto' | 'webp' | 'jpg' | 'png'
    }
): string {
    const { width, height, quality = 'auto', format = 'auto' } = options || {}

    // Extract public ID from URL
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)$/)
    if (!match) return url

    const publicId = match[1]
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

    // Build transformation string
    const transformations: string[] = []
    if (width) transformations.push(`w_${width}`)
    if (height) transformations.push(`h_${height}`)
    if (quality) transformations.push(`q_${quality}`)
    if (format) transformations.push(`f_${format}`)

    const transformString = transformations.join(',')

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicId}`
}
