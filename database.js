const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/local', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
    email: String,
    text: String,
    currentDate: Date,
    imageData: Buffer, // Field to store image data as a Buffer
});

const User = mongoose.model('User', userSchema, "test");

module.exports = {
    saveUser: async (email, text, currentDate, imageData) => {
        const user = new User({
            email,
            text,
            currentDate,
            imageData, // Assign the image data to the imageData field
        });

        await user.save();
    },





    
};
