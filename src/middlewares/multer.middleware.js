import multer from "multer"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    const uniqueprefix = Date.now()
    cb(null, uniqueprefix + "_" + file.originalname)
  }
})

const filefilter = (req, file, cb) => {
  if (file.originalname.match(/\.(jpg|jpeg|png|svg|webp)$/)) {
    cb(null, true);
  } else {
    return cb(new Error("Please upload a valid image file"));
  }
}

export const upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 5
  // }, //5MB
  fileFilter: filefilter,
})