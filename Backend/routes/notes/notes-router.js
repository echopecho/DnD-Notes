const router = require("express").Router();
const Notes = require("./notes-helper.js");

router.get("/", async (req, res) => {
  try {
    const notes = await Notes.getAll();
    res.status(200).json(notes);
  } catch (e) {
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.post("/new", async (req, res) => {
  const note = req.body;
  try {
    const newNote = await Notes.create(note);
    res.status(202).json(newNote);
  } catch (e) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/:id/tags", async (req, res) => {
  const { tags } = req.body;
  const { id } = req.params;
  try {
    const newTags = await Notes.makeTags(tags, id);
    res.status(201).json(newTags);
  } catch (e) {
    res.status(500).json({ error: "Something went wrong with the server." });
  }
});

router.put("/:id", async (req, res) => {
  const note = req.body;
  const { id } = req.params;
  note.id = id;
  console.log(note);
  try {
    const updatedNote = await Notes.update(note);
    res.status(202).json(updatedNote);
  } catch (e) {
    res.status(500).json({ error: "Something went wrong with the server." });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Notes.remove(id);
    res.status(201).json({ message: "Note was successfully deleted." });
  } catch (e) {
    res.status(500).json({ error: "Something went wrong with the server." });
  }
});

module.exports = router;
