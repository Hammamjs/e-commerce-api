const multer = require("multer");
const ApiError = require("../utils/ApiError");

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  const memoryFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(
        new ApiError("Type of file not image please upload image", 400),
        false
      );
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: memoryFilter });
  return upload;
};

exports.uploadSingleImage = (filedName) => multerOptions().single(filedName);
exports.uploadImages = (arrOfimages) => multerOptions().fields(arrOfimages);
