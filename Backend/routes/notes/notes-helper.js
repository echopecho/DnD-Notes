const db = require("../../data/dbConfig.js");

module.exports = {
  getAll,
  create,
  remove,
  update,
  makeTags
};

async function getAll() {
  const notes = await findNotes();
  // Temporary
  return notes;

  // async function addTags() {
  //   return Promise.all(
  //     notes.map(async note => {
  //       const tags = await findTagsByNote(note.id);
  //       note.tags = tags;
  //       return note;
  //     })
  //   );
  // }

  // const fullNotes = await addTags(notes);
  // return fullNotes;
}

async function addTags(notes) {
  return Promise.all(
    notes.map(async note => {
      const tags = await findTagsByNote(note.id);
      note.tags = tags;
      return note;
    })
  );
}

async function create(note) {
  const [{ id }] = await db("notes").insert(note, ["id"]);
  const newNote = await findNoteByID(id);
  const [fullNote] = await addTags([newNote]);
  return fullNote;
}

function remove(id) {
  return db("notes")
    .where({ id })
    .del();
}

async function update(note) {
  const [{ id }] = await db("notes")
    .where("id", note.id)
    .update(note, ["id"]);
  return findNoteByID(id);
}

async function makeTags(tags, noteID) {
  await db.transaction(trx => {
    const promises = tags.map(tag => {
      const newTag = {};
      newTag["note_id"] = noteID;
      newTag["npc_id"] = tag;
      return db("notes-npcs").insert(newTag);
    });
    return Promise.all(promises)
      .then(trx.commit)
      .catch(trx.rollback);
  });

  const finalTags = await findTagsByNote(noteID);

  return finalTags;
}

function findTagsByNote(noteID) {
  return db("notes-npcs as nn")
    .select("p.id", "p.name")
    .where("n.id", noteID)
    .join("notes as n", "nn.note_id", "n.id")
    .join("npcs as p", "nn.npc_id", "p.id");
}

// Test NPC ID's:
// 6c16990f-eeb1-4068-97d3-84253ca50208
// 75c043c8-cbeb-4d01-b7c2-195de27c7af0
// a5912648-7885-44e9-867a-4caf13ccf684

function findNoteByID(id) {
  return db("notes as n")
    .where("n.id", id)
    .join("locations as l", "n.location_id", "l.id")
    .join("users as u", "n.author_id", "u.id")
    .select(
      "n.id",
      "n.text",
      "n.is_quest",
      "n.created_at",
      "l.name as location",
      "u.username as author",
      "n.author_id",
      "n.campaign_id"
    )
    .first();
}

function findNotes() {
  return (
    db("notes as n")
      .join("locations as l", "n.location_id", "l.id")
      .join("users as u", "n.author_id", "u.id")
      // .join("campaigns as c", "n.campaign_id", "c.id")
      .select(
        "n.id",
        "n.text",
        "n.is_quest",
        "n.created_at",
        "l.name as location",
        "u.username as author",
        "n.author_id",
        "n.campaign_id"
      )
  );
}
