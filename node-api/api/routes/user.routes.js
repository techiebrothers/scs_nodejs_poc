const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller');
const auth = require("../middleware/auth");
const multer = require('multer');
const fs = require("fs");

// const upload = multer({ dest: 'uploads/' })
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = 'uploads/profile';
        if (fs.existsSync(dir)) {
            cb(null, dir)
        } else {
            fs.mkdirSync(dir);
            cb(null, dir)
        }
    },
    filename: function (req, file, cb) {
        var file_ext = file.originalname.split('.').pop();
        // var random_string = (file.fieldname+'_'+Date.now() +'' + Math.random()).toString();
        // var file_name = crypto.createHash('md5').update(random_string).digest('hex');
        // var file_name = file.originalname.replace(/[^a-zA-Z0-9]/g,'_');
        var file_name = file.originalname.replace("." + file_ext, "").replace(/[-&\/\\#,+()$~%.'":*?<>{} ]/g, '_');
        cb(null, file_name + '.' + file_ext) //Appending extension
    }
})
const upload = multer({
    storage: storage
});

// router.get('/test', (req, res) => {
//     console.log("call");
// 	res.send('About this wiki');
// });
// login user

router.post('/login', userController.login);
router.post('/findAll', auth, userController.findAll);
router.post('/resetToken', userController.resetToken);

router.post("/forgotPassword", userController.forgotPassword);
router.post("/resetRequestValidate", auth, userController.resetRequestValidate);
router.post("/resetPassword", auth, userController.resetPassword);
router.post("/resetUserPassword", auth, userController.resetUserPassword);
// retrive login user details
router.get('/details', auth, userController.findById);
router.get('/:id', auth, userController.findById);
router.get('/menu', auth, userController.getMenu);

router.post("/changePassword", auth, userController.changePassword);
// Create a new user
router.post('/', upload.fields([{ name: 'profile_picture', maxCount: 10 }]), userController.create);
// Retrieve a single user with id
// Update a user with id
router.put('/:id', auth, userController.update);
// Delete a user with id
router.delete('/:id/:is_hard', auth, userController.delete);

module.exports = router
