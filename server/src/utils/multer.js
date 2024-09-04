import multer from "multer"
import { filesTypes } from "./file_types.js"
import { nanoid } from "nanoid"
import fs from "fs"
import { checkMediaLength } from "../middelwares/media_length.js"

export const multerUploader = (path, types) => {

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {

      console.log("efedfedede",req,"--------------------------" ,file)
      if (!fs.existsSync(`uploads`)) {
        fs.mkdirSync(`uploads`, { recursive: true })
      }


      cb(null, `uploads`)

    },
    filename: function (req, file, cb) {
      const uniqueSuffix = file.fieldname + '-' + Date.now() + '-' + nanoid()
      console.log(file.originalname);


      file.finalPath = `uploads/${uniqueSuffix}${file.originalname}`

      cb(null, uniqueSuffix + file.originalname)
    }
  })
  function fileFilter(req, file, cb) {

    for (const key in types) {
      if (file.fieldname == key && !filesTypes[types[key]].includes(file.mimetype)) {
        return cb(new Error(`invalid type at ${file.fieldname}`))
        // return cb(null,false)
      }
    }

    cb(null, true)
    // cb(new Error('I don\'t have a clue!'))

  }
  let upload = multer({ storage, fileFilter })
  return upload
}



