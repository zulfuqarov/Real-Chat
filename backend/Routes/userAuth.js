import user from "../model/user.js";
import express from "express";
import cloudinary from "cloudinary";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/Register", async (req, res) => {
  const { email, password, userName, fullName, bio } = req.body;

  const defaultImg =
    "https://assets.bananastreet.ru/unsafe/2498x2498/https://bananastreet.ru/system/user/avatar/38/382/382231/7e7ab91539.png";

  let profilePicture =
    req.files && req.files.profilePicture
      ? req.files.profilePicture.tempFilePath
      : defaultImg;

  if (profilePicture !== defaultImg) {
    profilePicture = await cloudinary.uploader.upload(profilePicture, {
      use_filename: true,
      folder: "Home",
    });
  }
  try {
    const CheckEmail = await user.findOne({
      email: email,
    });

    if (CheckEmail) {
      return res.status(400).json({ msg: "Email already exists" });
    } else {
      const HashedPassword = await bcrypt.hash(password, 10);

      const newUser = new user({
        userName,
        fullName,
        bio,
        email,
        password: HashedPassword,
        profilePicture:
          profilePicture !== defaultImg ? profilePicture.url : profilePicture,
      });

      await newUser.save();
      res.status(200).json({ msg: "User created" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/Sign", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email && password) {
      const CheckEmail = await user.findOne({
        email: email,
      });
      if (CheckEmail) {
        const CheckPassword = await bcrypt.compare(
          password,
          CheckEmail.password
        );

        if (CheckPassword) {
          const payload = {
            sub: CheckEmail._id,
          };

          const token = jwt.sign(payload, process.env.TOKEN_SECRET_CODE, {
            expiresIn: "3d",
          });

          res.cookie("jwtToken", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
          });

          res.status(200).json({
            message: "Your login has been successfully completed",
            token,
          });
        } else {
          return res.status(400).json({
            message: "Your password is incorrect",
          });
        }
      }else{
        return res.status(400).json({ message: "email and password wrong !" });
      }
    } else {
      return res.status(400).json({
        message: "You did not provide any details for authentication",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/checkUser", async (req, res) => {
  const token = req.cookies.jwtToken;
  try {
    if (token) {
      const decodedToke = jwt.verify(token, process.env.TOKEN_SECRET_CODE);
      req.user = await user.findById(decodedToke.sub).select("-email -password");
      if (req.user) {
        return res
          .status(200)
          .json({ message: "Profile Siged", user: req.user});
      }else{
        return res.status(400).json({ message: "user not found" });
      }
    } else {
      return res.status(400).json({ message: "user not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/Logout", async (req, res) => {
  try {
    res.clearCookie("jwtToken", {
      httpOnly: true,
      secure: true, // Sadece HTTPS üzerinden gönderim için
      sameSite: "strict",
    });
    res.status(200).json({ message: "Profile has been logged out" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
