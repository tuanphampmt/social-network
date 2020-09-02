const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    contactId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    status: {
        type: Boolean,
        default: false,
    },
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    deletedAt: {type: Date, default: null},
}, {collection: 'contacts'});


module.exports = mongoose.model('contacts', ContactSchema);
