const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');


const validRoles = {
    values: ['ADMIN_ROLE', 'SUPERVISOR_ROLE', 'USER_ROLE'],
    message: `'{VALUE}' no es un rol válido.`
}

const userSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es requerido'], trim: true },
    email: { type: String, required: [true, 'El email es requerido'], unique: true, trim: true, lowercase: true },
    password: { type: String, required: [true, 'La contraseña es requerida'], trim: true },
    img: { type: String, required: false },
    role: { type: String, default: 'USER_ROLE', enum: validRoles},
    active: { type: Boolean, default: true }
});

userSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.toJSON = function () {
    const user = this;
    let safeUser = user.toObject();
    delete safeUser.password;
    return safeUser;
}

userSchema.plugin(uniqueValidator, {
    type: 'mongoose-unique-validator',
    message: 'Error, Se esperaba que {PATH} fuera un valor único. Ya existe ese valor.'
});


module.exports = mongoose.model('User', userSchema);
