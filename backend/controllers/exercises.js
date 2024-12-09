const Exercise = require("../models/exercises.model");
const fs = require('fs');
const path = require('path');


const addExercise = async (req, res) => {
  const { title, organisation, durchfuehrung, coaching, variante, date } = req.body;
  const { user } = req.user;

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

  if (!title || !organisation || !durchfuehrung || !coaching) {
    return res.status(400).json({ error: true, message: "Required fields are missing" });
  }

  try {
    const exercise = new Exercise({
      title,
      organisation,
      durchfuehrung,
      coaching,
      variante,
      date,
      imageUrl,
      userId: user._id,
    });

    await exercise.save();
    return res.json({ error: false, message: "Exercise added successfully", exercise });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

const editExercise = async (req, res) => {
  const { exerciseId } = req.params;
  const { title, organisation, durchfuehrung, coaching, variante } = req.body;
  const { user } = req.user;

  try {
    const exercise = await Exercise.findOne({ _id: exerciseId, userId: user._id });

    const fileData = await Exercise.findById(exerciseId);
    console.log(fileData);
    const filePath = "." + fileData.imageUrl;
    console.log(filePath);

    fs.unlink(filePath,(error) => {
      if(error) {
        console.log("Error while deleting file!");
      }
      console.log("File delete successfully!");
    });

    if (!exercise) {
      return res.status(404).json({ error: true, message: "Exercise not found" });
    }

    if (title) exercise.title = title;
    if (organisation) exercise.organisation = organisation;
    if (durchfuehrung) exercise.durchfuehrung = durchfuehrung;
    if (coaching) exercise.coaching = coaching;
    if (variante) exercise.variante = variante;
    if (req.file) exercise.imageUrl = `/uploads/${req.file.filename}`;

    await exercise.save();
    return res.json({ error: false, message: "Exercise updated successfully", exercise });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

const getExercises = async (req, res) => {
  const { user } = req.user;

  try {
    const exercise = await Exercise.find({ userId: user._id }).sort({ isPinnedExercise: -1 });

    return res.json({
      error: false,
      exercise,
      message: "All Exercises retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const deleteExercise = async (req, res) => {

  const { exerciseId } = req.params;
  const { user } = req.user;


  try {
    const exercise = await Exercise.findOne({ _id: exerciseId, userId: user._id })
    console.log(exerciseId);

    const fileData = await Exercise.findById(exerciseId);
    console.log(fileData);
    const filePath = "." + fileData.imageUrl;
    console.log(filePath);

    fs.unlink(filePath,(error) => {
      if(error) {
        console.log("Error while deleting file!");
      }
      console.log("File delete successfully!");
    });

    if (!exercise)
      return res
        .status(404)
        .json({ error: true, message: "Exercise not found" });


    await Exercise.deleteOne({ _id: exerciseId, userId: user._id })
    return res.json({ error: false, message: "Exercise deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" })
  }
};

const isPinnedExercise = async (req, res) => {
  const { exerciseId } = req.params;
  const { isPinnedExercise } = req.body;
  const { user } = req.user;

  try {
    const exercise = await Exercise.findOne({ _id: exerciseId, userId: user._id });
    if (!exercise)
      return res.status(404).json({ error: true, message: "Exercise not found" });

    exercise.isPinnedExercise = isPinnedExercise;
    await exercise.save();
    return res.json({
      error: false,
      exercise,
      message: "Exercise updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const searchExercise = async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;

  if (!query)
    return res
      .status(400)
      .json({ error: true, message: "Exercise query is required" });

  try {
    const matchingExercises = await Exercise.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { organisation: { $regex: new RegExp(query, "i") } },
        { durchfuehrung: { $regex: new RegExp(query, "i") } },
        { coaching: { $regex: new RegExp(query, "i") } },
        { variante: { $regex: new RegExp(query, "i") } },
      ],
    });
    return res.json({
      error: false,
      notes: matchingExercises,
      message: "Exercise matching query retrieved",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};


module.exports = { addExercise, editExercise, getExercises, deleteExercise, isPinnedExercise, searchExercise };