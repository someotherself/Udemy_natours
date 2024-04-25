const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// name, email, photo, password, passwordConfirm
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'A username is required.'] },
    email: {
      type: String,
      required: [true, 'Email is required to login.'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email.']
    },
    photo: { type: String, required: false, default: null },
    role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: [8, 'Password must have at least 8 characters']
    },
    passwordConfirm: {
      type: String,
      required: true,
      validate: {
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords do not match.'
      }
    },
    passwordChangedAt: { type: Date, require: false },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true.valueOf,
      select: false
    }
  },
  { collection: 'TestUsers', toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  // This accounts for the extra time it takes to generate the jws token (aprox)
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = async function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = (this.passwordChangedAt.getTime() / 1000) * 1;
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});
