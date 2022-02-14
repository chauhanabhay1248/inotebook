const express = require('express');
const router = express.Router()
const Note = require('../models/Note');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

//ROUTE 1: Get all the notes using: GET "/api/notes/fetchallnotes". require Auth
router.get('/fetchallnotes', fetchuser, async (req, res) => {
        try {
            const notes = await Note.find({user: req.user.id});
            res.json(notes);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Some error occured");
        }
    })

//ROUTE 2: Add a new note using: POST "/api/notes/addnote". require Auth
router.post('/addnote', fetchuser, [
    body('title').isLength({ min: 3 }),
    body('description').isLength({ min: 5 })
    ], async (req, res) => {
        
        // Validation Check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        try {
            const {title, description, tag} = req.body;
            const note = new Note ({
                title, description, tag, user:req.user.id
            })

            const savedNote = await note.save();
            res.json(savedNote);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Some error occured");
        }
    })


//ROUTE 3: Update an existing note using: PUT "/api/notes/updatenote". require Auth
router.put('/updatenote/:id', fetchuser, async (req, res) => {
        
        // Validation Check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        try {
            const {title, description, tag} = req.body;

            // Create newNode object;
            const newNote = {};
            if(title) {
                newNote.title = title
            }
            if(description) {
                newNote.description = description
            }
            if(tag) {
                newNote.tag = tag
            }
            
            // Find the note to be updated and update it
            let note = await Note.findById(req.params.id);
            if(!note) {
                return res.status(404).send("Not Found");
            }

            // Allow updation if user own this Note
            if(note.user.toString() !== req.user.id) {
                return res.status(401).send("Not allowed");
            }
            note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
            res.json(note);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Some error occured");
        }
    })

//ROUTE 4: Delete an existing note using: DELETE "/api/notes/updatenote". require Auth
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
        
    // Validation Check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const {title, description, tag} = req.body;
        
        // Find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if(!note) {
            return res.status(404).send("Not Found");
        }

        // Allow deletetion if user own this Note
        if(note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({"Success": "Note has been deleted", note: note});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
})

module.exports = router