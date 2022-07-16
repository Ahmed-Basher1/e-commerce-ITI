const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (req.body.type == 'businessProfile') {
			cb(null, path.join(__dirname, '../', 'images', 'business'));
		} else if (req.body.type == 'commercial') {
			cb(null, path.join(__dirname, '../', 'images', 'commercialRegister'));
		} else {
			cb(null, path.join(__dirname, '../', 'images', 'products'));
		}
	},
	filename: (req, file, cb) => {
		const id = req.body.id;
		if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
			let err = new Error();
			err.code = 'filetype';
			return cb(err);
		} else {
			let fileName = crypto.randomBytes(10).toString('hex');
			file.filename = fileName;
			cb(null, fileName + '.jpg');
		}
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};
module.exports = multer({ storage: storage, fileFilter: fileFilter });
