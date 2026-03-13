const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 100,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password: " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAMAAwAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABAYBAwUCB//EADoQAAICAQIDBAUKBQUAAAAAAAABAgMEBRESITEGQVFxIjJhgdETFDNCUmJykbHhIyShwfBEVIKS8f/EABkBAQADAQEAAAAAAAAAAAAAAAABAgQDBf/EACIRAQEAAwABBAMBAQAAAAAAAAABAgMRMRIhMkEEI1FhIv/aAAwDAQACEQMRAD8AtwAPTeaAAAAAAAAAAADZTRdc9qapz/DElw0bUJdMdrzaRW54zzVpjb4iACfPR9Qj1x2/JpkW7Huo+mqnD8SEzxvilxyn01AAsqAAAAAAAAAAAAAAAAAAAAO4Je6aZ32Rqqi5Tk+UV/nQs2n6DRTBSykrrPB+qvd3m3QtPWJjqyxfxrFvL2LwOqY9u228jVr1c968RgopKKSS7kj1t4GQcHdjY8zgpJprdPufM9gDi6joVNy48b+DZ12Xqv3FZuqsotlXdFxmnzTL/scvXtPWVjuyuO99a3j7V4HfXtsvK4bNUvvFRA9+4NjIAAAAAAAAAAAAAAAAEzSMf5zqFUH6qfFLyRDO32WhvmWza9WspsvMbV9c7lFnRkwjJ57eAAAAABhmQBSNWx1i6hbBeq3xL2JkM7faqCjmVT26w/ucQ9DXe4Rh2TmXAAF3MAAAAAAAAAAAAADu9lH/ADGQvuL9ThHX7MT4dRlH7VbOe34V01X/ALi1oyYRkwNwAAAAAAGGBWu1b/mKF38D/U4R2O08+LUIx+zBHHN+r4Rh23udAAdHMAAAAAAAAAAAAACXpV3yGo0Tb2XFs/J8iIH0IynZUy8vX0JdDJF03J+dYddvLdr0tvHvJR51nHoS9gACEgAAGGZIupZKxMOy7dbpct/HuJk7UW8io6rcr9RvmunHsvdyIgQPRxnJx59vb0ABKAAAAAAAAAAAAAAAHQDt9ms75K6WNY9o2PeDfc/As58+TaaaezT338C16Pq0MuCqufDevyn5GTfr9/VGrTs9uV1wYXQyZ2gAMMA2VjtLmq25Ytct41857ePgdHWtVjiQdVMuLIkui+r7WVRttttttvm2adGu/Ks+7P6jAANTMAAIAAAAAAAAAAAAO/o+iKyuN+ZHlLnGt/qymecwnavjhcryOLRj3ZMuGiuVj9iOridnsizZ5E1UvBc38Cy11Qrio1wjGK6KK2SPZmy35Xw0Y6ZPLi5OgY8sbgx942x5qcnvxeZXL6bsW3guThZH/Ny+7GnJxasqHBdXGS7t+q8mRhus+XunPTL4VnD1/KoSjco3Q7t+Uvz7zpw7RYr9eu2Pu3NGT2aT3eNfsn9Wa/uQp9n8+PqquXlM6fqy/wAU/bi6dnaLFS9CFsn5JHNy+0GTfFxpUaYvvT3l+ZiHZ/Pl1VUfOZNx+zfNPKvctvqw+I5pxP25OFTTbk3quqLnY+f/AKWTH7P46xuHJ3lbLm5Re23kdPFxKcWHBRXGC9i6m7Y557rfaL4apPKr5fZ7IrbePNWx8HyfwOTfj24z4b65Qf3lyZfzxOuNkXGcYyi+qa3Jx35TyjLRL4fPwd7WNEVcJX4a9GK3dfwOCasM5n7xmyxuPkABZUAAAAAAABO0bEWXnQhJehH0p/AuiWy2OH2Vp4ce25rnOfCvJI7ph3ZdzbdOPMegAOTqAAAAAAAAAAAAAMNJrZlL1nEWHnzjBehP0o+z2F1Zwe1VG+PTelzjLhfk/wB0ddOXMnLdj3HqtAdAbmIAAAAAAAlxSS8XsKlddFr+S0vHi1zceJ+/mTjXTHgphH7MUjYebb29ehjOQABCQAAAAAAAAAAAAAIGt1/K6XkJdVHiXu5k813R46px8YtEy8vUZTs4oAMuPC+Hw5GD0nnAAAAAAbsKHymbRB9HNL+ppJmkLi1PGX30yuXxq2PmLsZMGTznoAAAAAAAAAAAAAAAABgyYAombD5PMvguisa/qaCZq64dTyF9/chno4/GPPy9rQAFlQAADdh3/Nsqu7bfglvt4mkCzvsmXnuvOJn42XFOmyLl9nfmvcSdz56uW23VdH3k7H1fOx+Svc14Wel+5ly/Hv004/kT7XUFdo7SbPbIo98H8SdVr2BYvStlW/CcGcbrzn06zZjft1AR6svHu+ivrn+GaZuT36bFLFuvQMJmQkAMMDIPLe3U025mPT9LfVD8UkhxHYkGNzmXa7g1rlZKx/ci/wBSBf2l/wBvR/ym/gXmvO/St2Yz7WLcjZmfj4kG7bEn9nvZVcnVs2/lK5wi+6v0f3IHj4vq+864/j37cst8+m7MveTlW3NbOct9vYaQDXJycZre0AAQAAAAAAACQABBsvBGyF91fqW2R8pM1gclT2pkdUzorllWe97ntazqC/1D/wCqIAK+jH+Leu/1Petag+mQ/wAkeJapnS65M/cyGB6Mf4j13+tk77rPXtsl5yZr2S6IAtyI7QABAAAkAAQAAD//2Q==",
    },
    about: {
      type: String,
      default: "This is default about user",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({_id: user._id}, "DEV@Tender$789", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByuser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByuser,
    passwordHash,
  );

  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
