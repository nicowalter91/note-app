// *** Controller for Notes ***
const Note = require("../models/note.model");


const addNote = async (req, res) => {
    const { title, content, tags } = req.body;
    const { user } = req.user;
  
    if (!title)
      return res.status(400).json({ error: true, message: "Title is required" });
    if (!content)
      return res
        .status(400)
        .json({ error: true, message: "Content is required" });
  
    try {
      const note = new Note({
        title,
        content,
        tags: tags || [],
        userId: user._id,
      });
  
      await note.save();
      return res.json({ error: false, note, message: "Note added successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
};

module.exports = { addNote };