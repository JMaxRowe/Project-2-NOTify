import {cloudinary} from "./cloudinary.js"
import { createReadStream } from "streamifier"

export default function cloudinaryUpload(fileBuffer, type = 'image'){

    const resourceType = type === 'image' ? 'image' : type === 'video' ? 'video' : 'auto'

    return new Promise((resolve, reject)=>{
        const stream = cloudinary.uploader.upload_stream(
            {folder: 'NOTify',
                resource_type: resourceType
            },
            (err, result) => {
                if (result) resolve(result)
                else reject(err)
            }
        )
        createReadStream(fileBuffer).pipe(stream)
    })
}
