const Picture = require('../models/Picture');
const Jimp = require('jimp');

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

        //const round = req.params.id;
        const round = 1;

        const roundBlurs = {
            1: 25,
            2: 20,
            3: 15,
            4: 10,
            5: 5
        }
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
