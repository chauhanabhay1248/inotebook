import NoteContext from "./noteContext";
import {useState} from "react"

const NoteState = (props) => {
    const notesInitial = [
        {
            "_id": "62090bf8237c30ec6bd8ce35",
            "user": "6208af3adb5e2fbb11e2f6eb",
            "title": "My title",
            "description": "Please wake up early",
            "tag": "presonal",
            "__v": 0
        },
        {
            "_id": "6209fd75b3f07c484ffa872a",
            "user": "6208af3adb5e2fbb11e2f6eb",
            "title": "My title",
            "description": "Please wake up early",
            "tag": "presonal",
            "__v": 0
        },
        {
            "_id": "6209fd76b3f07c484ffa872c",
            "user": "6208af3adb5e2fbb11e2f6eb",
            "title": "My title",
            "description": "Please wake up early",
            "tag": "presonal",
            "__v": 0
        }
    ]
    const [notes, setNotes] = useState(notesInitial);

    return (
        <NoteContext.Provider value={{ notes, setNotes }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;