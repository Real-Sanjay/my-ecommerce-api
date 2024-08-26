const express = require('express');
const router = express.Router();
const Poster = require('../model/poster');
const { uploadPosters } = require('../uploadFile');
const multer = require('multer');
const asyncHandler = require('express-async-handler');

// Get all posters
router.get('/', asyncHandler(async (req, res) => {
    try {
        const posters = await Poster.find({});
        res.json({ success: true, message: "Posters retrieved successfully.", data: posters });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Get a poster by ID
router.get('/:id', asyncHandler(async (req, res) => {
    try {
        const posterID = req.params.id;
        const poster = await Poster.findById(posterID);
        if (!poster) {
            return res.status(404).json({ success: false, message: "Poster not found." });
        }
        res.json({ success: true, message: "Poster retrieved successfully.", data: poster });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Create a new poster
router.post('/', asyncHandler(async (req, res) => {
    try {
        uploadPosters.single('img')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    err.message = 'File size is too large. Maximum filesize is 5MB.';
                }
                console.log(`Add poster: ${err}`);
                return res.json({ success: false, message: err });
            } else if (err) {
                console.log(`Add poster: ${err}`);
                return res.json({ success: false, message: err });
            }
            const { posterName } = req.body;
            let imageUrl = 'no_url';
            if (req.file) {
                imageUrl = `https://sanjaydh.com/image/poster/${req.file.filename}`;
            }

            if (!posterName) {
                return res.status(400).json({ success: false, message: "Name is required." });
            }

            try {
                const newPoster = new Poster({
                    posterName: posterName,
                    imageUrl: imageUrl
                });
                await newPoster.save();
                res.json({ success: true, message: "Poster created successfully.", data: null });
            } catch (error) {
                console.error("Error creating Poster:", error);
                res.status(500).json({ success: false, message: error.message });
            }

        });

    } catch (err) {
        console.log(`Error creating Poster: ${err.message}`);
        return res.status(500).json({ success: false, message: err.message });
    }
}));

// Update a poster
router.put('/:id', asyncHandler(async (req, res) => {
    try {
        const categoryID = req.params.id;
        uploadPosters.single('img')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    err.message = 'File size is too large. Maximum filesize is 5MB.';
                }
                console.log(`Update poster: ${err.message}`);
                return res.json({ success: false, message: err.message });
            } else if (err) {
                console.log(`Update poster: ${err.message}`);
                return res.json({ success: false, message: err.message });
            }

            const { posterName } = req.body;
            let image = req.body.image;


            if (req.file) {
                image = `https://sanjaydh.com/image/poster/${req.file.filename}`;
            }

            if (!posterName || !image) {
                return res.status(400).json({ success: false, message: "Name and image are required." });
            }

            try {
                const updatedPoster = await Poster.findByIdAndUpdate(categoryID, { posterName: posterName, imageUrl: image }, { new: true });
                if (!updatedPoster) {
                    return res.status(404).json({ success: false, message: "Poster not found." });
                }
                res.json({ success: true, message: "Poster updated successfully.", data: null });
            } catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }

        });

    } catch (err) {
        console.log(`Error updating poster: ${err.message}`);
        return res.status(500).json({ success: false, message: err.message });
    }
}));

// Delete a poster
router.delete('/:id', asyncHandler(async (req, res) => {
    const posterID = req.params.id;
    try {
        const deletedPoster = await Poster.findByIdAndDelete(posterID);
        if (!deletedPoster) {
            return res.status(404).json({ success: false, message: "Poster not found." });
        }
        res.json({ success: true, message: "Poster deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

module.exports = router;






// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const asyncHandler = require('express-async-handler');
// const Poster = require('../model/poster');

// // Configure storage for multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/posters'); // Set your desired upload destination
//     },
//     filename: (req, file, cb) => {
//         // Use the original filename
//         cb(null, file.originalname);
//     }
// });

// // Set up multer with the specified storage and file size limit
// const uploadPosters = multer({
//     storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
// });

// // Get all posters
// router.get('/', asyncHandler(async (req, res) => {
//     try {
//         const posters = await Poster.find({});
//         res.json({ success: true, message: "Posters retrieved successfully.", data: posters });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// }));

// // Get a poster by ID
// router.get('/:id', asyncHandler(async (req, res) => {
//     try {
//         const posterID = req.params.id;
//         const poster = await Poster.findById(posterID);
//         if (!poster) {
//             return res.status(404).json({ success: false, message: "Poster not found." });
//         }
//         res.json({ success: true, message: "Poster retrieved successfully.", data: poster });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// }));

// // Create a new poster
// router.post('/', asyncHandler(async (req, res) => {
//     try {
//         uploadPosters.single('img')(req, res, async function (err) {
//             if (err instanceof multer.MulterError) {
//                 if (err.code === 'LIMIT_FILE_SIZE') {
//                     err.message = 'File size is too large. Maximum filesize is 5MB.';
//                 }
//                 console.log(`Add poster: ${err}`);
//                 return res.json({ success: false, message: err.message });
//             } else if (err) {
//                 console.log(`Add poster: ${err}`);
//                 return res.json({ success: false, message: err.message });
//             }
//             const { posterName } = req.body;
//             let imageUrl = 'no_url';
//             if (req.file) {
//                 imageUrl = `https://sanjaydh.com/image/poster/${req.file.originalname}`;
//             }

//             if (!posterName) {
//                 return res.status(400).json({ success: false, message: "Poster name is required." });
//             }

//             try {
//                 const newPoster = new Poster({
//                     posterName: posterName,
//                     imageUrl: imageUrl
//                 });
//                 await newPoster.save();
//                 res.json({ success: true, message: "Poster created successfully.", data: null });
//             } catch (error) {
//                 console.error("Error creating poster:", error);
//                 res.status(500).json({ success: false, message: error.message });
//             }

//         });

//     } catch (err) {
//         console.log(`Error creating poster: ${err.message}`);
//         return res.status(500).json({ success: false, message: err.message });
//     }
// }));

// // Update a poster
// router.put('/:id', asyncHandler(async (req, res) => {
//     try {
//         const posterID = req.params.id;
//         uploadPosters.single('img')(req, res, async function (err) {
//             if (err instanceof multer.MulterError) {
//                 if (err.code === 'LIMIT_FILE_SIZE') {
//                     err.message = 'File size is too large. Maximum filesize is 5MB.';
//                 }
//                 console.log(`Update poster: ${err.message}`);
//                 return res.json({ success: false, message: err.message });
//             } else if (err) {
//                 console.log(`Update poster: ${err.message}`);
//                 return res.json({ success: false, message: err.message });
//             }

//             const { posterName } = req.body;
//             let image = req.body.image;

//             if (req.file) {
//                 image = `https://sanjaydh.com/image/poster/${req.file.originalname}`;
//             }

//             if (!posterName || !image) {
//                 return res.status(400).json({ success: false, message: "Poster name and image are required." });
//             }

//             try {
//                 const updatedPoster = await Poster.findByIdAndUpdate(posterID, { posterName: posterName, imageUrl: image }, { new: true });
//                 if (!updatedPoster) {
//                     return res.status(404).json({ success: false, message: "Poster not found." });
//                 }
//                 res.json({ success: true, message: "Poster updated successfully.", data: null });
//             } catch (error) {
//                 res.status(500).json({ success: false, message: error.message });
//             }

//         });

//     } catch (err) {
//         console.log(`Error updating poster: ${err.message}`);
//         return res.status(500).json({ success: false, message: err.message });
//     }
// }));

// // Delete a poster
// router.delete('/:id', asyncHandler(async (req, res) => {
//     const posterID = req.params.id;
//     try {
//         const deletedPoster = await Poster.findByIdAndDelete(posterID);
//         if (!deletedPoster) {
//             return res.status(404).json({ success: false, message: "Poster not found." });
//         }
//         res.json({ success: true, message: "Poster deleted successfully." });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// }));

// module.exports = router;





