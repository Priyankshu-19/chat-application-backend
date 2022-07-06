const express = require("express")
const router = express.Router()
const userModel = require("../Models/userModel")
const bcrypt = require("bcrypt")

router.get('/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      const user = await userModel.findById(id);
  
      if (user) {
        const { password, ...otherDetails } = user._doc;
  
        res.status(200).json(otherDetails);
      } else {
        res.status(404).json("No such user exists");
      }
    } catch (error) {
      res.status(500).json(error);
    }
})


router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { currentUserId, currentUserAdminStatus, password } = req.body;
  
    if (id === currentUserId || currentUserAdminStatus) {
      try {
        if (password) {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(password, salt);
        }
  
        const user = await userModel.findByIdAndUpdate(id, req.body, {
          new: true,
        });
  
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("Access Denied! you can only update your own profile");
    }
})


router.delete('/:id', async (req, res) => {
    const id = req.params.id;
  
    const { currentUserId, currentUserAdminStatus } = req.body;
  
    if (currentUserId === id || currentUserAdminStatus) {
      try {
        await userModel.findByIdAndDelete(id);
        res.status(200).json("User deleted successfully");
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("Access Denied! you can only delete your own profile");
    }
})


router.put('/:id/follow', async (req, res) => {
        const id = req.params.id;
      
        const { currentUserId } = req.body;
      
        if (currentUserId === id) {
          res.status(403).json("Action forbidden");
        } else {
          try {
            const followUser = await userModel.findById(id);
            const followingUser = await userModel.findById(currentUserId);
      
            if (!followUser.followers.includes(currentUserId)) {
              await followUser.updateOne({ $push: { followers: currentUserId } });
              await followingUser.updateOne({ $push: { following: id } });
              res.status(200).json("You are following the user!");
            } else {
              res.status(403).json("User is Already followed by you");
            }
          } catch (error) {
            res.status(500).json(error);
          }
        }
    })


router.put('/:id/unfollow', async (req, res) => {
        const id = req.params.id;
      
        const { currentUserId } = req.body;
      
        if (currentUserId === id) {
          res.status(403).json("Action forbidden");
        } else {
          try {
            const followUser = await userModel.findById(id);
            const followingUser = await userModel.findById(currentUserId);
      
            if (followUser.followers.includes(currentUserId)) {
              await followUser.updateOne({ $pull: { followers: currentUserId } });
              await followingUser.updateOne({ $pull: { following: id } });
              res.status(200).json("User Unfollowed!");
            } else {
              res.status(403).json("You must first follow the user to perform the unfollow action");
            }
          } catch (error) {
            res.status(500).json(error);
          }
        }
    })

module.exports = router