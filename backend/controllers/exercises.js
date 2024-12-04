const Exercise = require("../models/exercises.model");


const addExercise = async (req, res) => {

    const { title, organisation, durchfuehrung, coaching, variante, date, image, tags} = req.body;
    const { user } = req.user;

    if (!title)
        return res.status(400).json({error: true, message: "Title is required"});

    if (!organisation)
        return res.status(400).json({error: true, message: "Organisation is required"});

    if (!durchfuerhung)
        return res.status(400).json({error: true, message: "Durchführung is required"});

    if (!coaching)
        return res.status(400).json({error: true, message: "Coaching is required"});


    try {
        const exercise = new Exercise({
            title,
            organisation,
            durchfuehrung,
            coaching,
            variante,
            tags: tags || [],
            userId: user._id,
        });

        await exercise.save();
        return res.json({error: false, message: "Exercise added successfully"});

    } catch (error) {
        return res
        .status(500)
        .json({error: true, messgae: "Internal Server Error"})
    }
};

const editExercise = async (req, res) => {

    const { exerciseId } = req.params;
    const { title, organisation, durchfuehrung, coaching, variante, date, image, tags, isPinned } = req.body;
    const { user } = req.user;

    if(!title && !organisation && !durchfuehrung && !coaching && !variante && !tags) {
        return res
        .status(400)
        .json({error: true, message: "No changes provided"});
    }

    try {
        const exercise = await Exercise.findOne({_id: exerciseId, userId: user._id});
        if(!exercise)
            return res.status(404).json({error: true, message: "Exercise not found"});

        if(title) exercise.title = title;
        if(organisation) exercise.organisation = organisation;
        if(durchfuehrung) exercise.durchfuehrung = durchfuehrung;
        if(coaching) exercise.coaching = coaching;
        if(variante) exercise.coaching = coaching;
        if(tags) exercise.tags = tags;
        if(isPinned) exercise.isPinned = isPinned;

        await exercise.save();
        return res.json({
            error: false,
            exercise,
            message: "Exercise updated successfully",
        });
    } catch (error) {
        return res
        .status(500)
        .json({error: true, message: "Internal Server Error"});
    }
};

const getExercises = async (req, res) => {
    const { user } = req.user;
  
    try {
      const exercise = await Exercise.find({ userId: user._id }).sort({ isPinned: -1 });
      return res.json({
        error: false,
        exercise,
        message: "All Exercises retrieved successfully",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  };

const deleteExercise = async (req, res ) => {

    const {exerciseId} = req.params;
    const {user} = req.user;

    try {
        const exercise = await Exercise.findOne({ _id: exerciseId, userId: user._id})

        if(!exercise)
            return res
                .status(404)
                .json({error: true, message: "Exercise not found"});
        
        await Exercise.deleteOne({_id: exerciseId, userId: user._id})
        return res.json({error: false, message: "Exercise deledet successfully"});
    } catch (error) {
        return res
        .status(500)
        .json({error: true, message: "Internal Server Error"})
    }
};

const isPinnedExercise = async (req, res) => {
    const { exerciseId } = req.params;
    const { isPinned } = req.body;
    const { user } = req.user;
  
    try {
      const exercise = await Exercise.findOne({ _id: exerciseId, userId: user._id });
      if (!exercise)
        return res.status(404).json({ error: true, message: "Exercise not found" });
  
      exercise.isPinned = isPinned;
      await exercise.save();
      return res.json({
        error: false,
        exercise,
        message: "Exercise updated successfully",
      });
    } catch (error) {
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
          { content: { $regex: new RegExp(query, "i") } },
        ],
      });
      return res.json({
        error: false,
        notes: matchingExercises,
        message: "Exercise matching query retrieved",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  };


module.exports = { addExercise, editExercise, getExercises, deleteExercise, isPinnedExercise, searchExercise};