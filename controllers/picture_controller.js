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
        const pictures = await Picture.find().sort({date: 'descending'});

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

// @desc    Get Blurry Picture for a date by Round number
// @route   GET /api/v1/pictures/:date:currentRound
// @access  Public
exports.getBlurryPicture = async(req, res, next) => {
    try {

        const date = req.params.date;
        const currentRound = req.params.currentRound;

        const picture = await Picture.findOne({ date });

        const data = { pictureNumber: picture.pictureNumber };

        const image = await Jimp.read( picture.url);
        if (roundBlurs[currentRound]) {
            const blurRadius = roundBlurs[currentRound];
            data.image = await image.blur( blurRadius ).getBase64Async(Jimp.AUTO);
        } else {
            data.answer = picture.answer;   
            data.image = await image.getBase64Async(Jimp.AUTO);
        }

        return res.status(200).json({
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

// @desc    Guess picture
// @route   POST /api/v1/pictures/:date/guess
// @access  Public
exports.guessPicture = async (req, res, next) => {
    try {
        const { guess, pass, currentRound } = req.body;

        const date = req.params.date;

        const picture = await Picture.findOne({ date });
     
        const image = await Jimp.read( picture.url);
        
        const data = {}

        if (pass) {
            data.outcome = 'pass';
            if (roundBlurs[currentRound + 1]) {
                const blurRadius = roundBlurs[currentRound + 1];
                data.image = await image.blur( blurRadius ).getBase64Async(Jimp.AUTO);
            } else {
                data.answer = picture.answer;   
                data.image = await image.getBase64Async(Jimp.AUTO);
            }
        } else {
            const options = {
                includeScore: true
            }
            const answers = [picture.answer];
            picture.alternativeAnswers.forEach(a => answers.push(a));
            let score = 1;
            answers.forEach(a => {
                const fuse = new Fuse([guess], options);
                const result = fuse.search(a);
                if ( result.length == 1 ) {
                    if ( result[0].score < score ) {
                        score = result[0].score;
                    }
                }
            });

            if ( score < 0.2 ) {
                data.outcome = 'correct';
                data.answer = picture.answer;   
                data.image = await image.getBase64Async(Jimp.AUTO);
            } else {
                if ( score < 1 ) {
                    data.outcome = 'close';
                } else {
                    data.outcome = 'incorrect';
                }           
                if (roundBlurs[currentRound + 1]) {
                    const blurRadius = roundBlurs[currentRound + 1];
                    data.image = await image.blur( blurRadius ).getBase64Async(Jimp.AUTO);
                } else {
                    data.answer = picture.answer;   
                    data.image = await image.getBase64Async(Jimp.AUTO);
                }
            }
        }
        
        return res.status(200).json({
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

        const pic = req.body;
        if ( !pic.url ) {
            const S3_BUCKET = process.env.NODE_ENV == 'development' ? process.env.S3_BUCKET_TEST : process.env.S3_BUCKET;
            pic.url = `https://${S3_BUCKET}.s3.eu-west-1.amazonaws.com/${Date.now()}.jpg`
        }

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

// @desc    Change picture
// @route   PUT /api/v1/pictures/:id
// @access  Public
exports.changePicture = async (req, res, next) => {
    try {

        const picture = await Picture.findByIdAndUpdate(req.params.id,req.body);
        if (!picture) {
            return res.status(404).json({
                success: false,
                error: 'No picture found'
            });
        }

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
