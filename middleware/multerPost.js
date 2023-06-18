const multer = require('multer');
const fs = require('fs');

const defaultPath = 'Public';

const storage = multer.diskStorage({
    destination: async(req, file, cb) => {
        let destinationExists = fs.existsSync(`${defaultPath}/userImages`);
        
        if(!destinationExists) {
            await fs.promises.mkdir(`${defaultPath}/userImages`, {
                recursive: true
            });
        }
        if(file.fieldname === 'image') {
            cb(null, `${defaultPath}/userImages`);
        }
        else {
            cb(null, `${defaultPath}`);
        }
    },
    filename: async(req, file, cb) => {
        cb(null, 'USER-' + Date.now() + '.' + file.mimetype.split('/') [1]);
    }
});

const fileFilter = (req, file, cb) => {
    const fileType = file.mimetype.split('/') [1];

    if(fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg') {
        cb(null, true);
    }
    else {
        cb(new Error('file type not supported'));
    }
}

exports.postImage = multer({storage: storage, fileFilter: fileFilter});
