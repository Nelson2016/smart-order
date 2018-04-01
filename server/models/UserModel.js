import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let UserSchema = new Schema({
    username: String,
    password: String,
    random: String,
    mail: String,
    jurisdiction: {
        comment: Boolean,
        admin: Boolean
    },
    createAt: Date,
    updateAt: Date,
    token: String
});

// UserSchema.pre('save', async (a, next) => {
//     console.log(a.username)
//     if (!this.created) {
//         this.createAt = Date.now();
//     }
//     this.updateAt = Date.now();
//     await next();
// });

const User = mongoose.model('User', UserSchema);

export default User;