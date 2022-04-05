const Picture = require('../models/Picture');
const Jimp = require('jimp');
const Fuse = require('fuse.js');

const roundBlurs = {
    1: 40,
    2: 30,
    3: 20,
    4: 15,
    5: 10,
    6: 5
}

// @desc    Get all pictures
// @route   GET /api/v1/pictures
// @access  Public
exports.getPictures = async(req, res, next) => {
    try {
        const pictures = await Picture.find();

        return res.status(200).json({
            success: true,
            count: pictures.length,
            data: pictures
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}

// @desc    Get Today's Blurry Picture by Round number
// @route   GET /api/v1/pictures/today:round
// @access  Public
exports.getTodayBlurryPicture = async(req, res, next) => {
    try {

        var today = new Date().toISOString().split('T')[0];
        
        const picture = await Picture.findOne({ date: today });

        const round = req.params.id;

        const blurRadius = roundBlurs[round];

        const image = await Jimp.read( picture.url);
        const base64String = await image.blur( blurRadius ).getBase64Async(Jimp.AUTO);

        return res.status(200).json({
            success: true,
            data: base64String
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}

// @desc    Guess picture
// @route   POST /api/v1/pictures/today/guess
// @access  Public
exports.guessPicture = async (req, res, next) => {
    try {
        const { guess, pass, round } = req.body;

        var today = new Date().toISOString().split('T')[0];
        
        const picture = await Picture.findOne({ date: today });
     
        const image = await Jimp.read( picture.url);
        
        const data = {}

        if (pass) {
            data.outcome = 'pass';
            if (roundBlurs[round + 1]) {
                const blurRadius = roundBlurs[round + 1];
                data.image = await image.blur( blurRadius ).getBase64Async(Jimp.AUTO);
            } else {
                data.answer = picture.answer;   
                data.image = await image.getBase64Async(Jimp.AUTO);
            }
        } else {
            const options = {
                includeScore: true
              }
            const fuse = new Fuse([guess], options);        
            const result = fuse.search(picture.answer);
    
            if ( result.length == 1 && result[0].score < 0.2 ) {
                data.outcome = 'correct';
                data.answer = picture.answer;   
                data.image = await image.getBase64Async(Jimp.AUTO);
            } else {
                if ( result.length === 1 ) {
                    data.outcome = 'close';
                } else {
                    data.outcome = 'incorrect';
                }           
                if (roundBlurs[round + 1]) {
                    const blurRadius = roundBlurs[round + 1];
                    data.image = await image.blur( blurRadius ).getBase64Async(Jimp.AUTO);
                } else {
                    data.answer = picture.answer;   
                    data.image = await image.getBase64Async(Jimp.AUTO);
                }
            }
        }
        

        return res.status(201).json({
            success: true,
            data
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
    
}

// @desc    Add picture
// @route   POST /api/v1/pictures
// @access  Public
exports.addPicture = async (req, res, next) => {
    try {
        const { text, amount } = req.body;

        const picture = await Picture.create(req.body);

        return res.status(201).json({
            success: true,
            data: picture
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);

            return res.status(400).json({
                success: false,
                error: messages
            });
        } else {
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }
    
}

// @desc    Delete picture
// @route   DELETE /api/v1/pictures/:id
// @access  Public
exports.deletePicture = async (req, res, next) => {
    try {
        const picture = await Picture.findById(req.params.id);

        if (!picture) {
            return res.status(404).json({
                success: false,
                error: 'No picture found'
            });
        }

        await picture.remove();

        return res.status(200).json({
            success: true,
            data: {}
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}
