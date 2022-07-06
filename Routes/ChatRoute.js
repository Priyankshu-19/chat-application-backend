const express = require("express")
const router = express.Router()
const chatModel = require("../Models/chatModel.js")

router.post('/', async (req, res) => {
    const newChat = new chatModel({
      members: [req.body.senderId, req.body.receiverId],
    });
    try {
      const result = await newChat.save();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  });

router.get('/:userId', async (req, res) => {
    try {
      const chat = await chatModel.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json(error);
    }
  });
router.get('/find/:firstId/:secondId', async (req, res) => {
    try {
      const chat = await ChatModel.findOne({
        members: { $all: [req.params.firstId, req.params.secondId] },
      });
      res.status(200).json(chat)
    } catch (error) {
      res.status(500).json(error)
    }
  });

module.exports = router