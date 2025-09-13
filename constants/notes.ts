export type Note = {
    id: number
    emoji: string
    title: string
    folder: string
    createdAt: string
    type: string
}

export const NOTES: Note[] = [  
    {
        id: 1,
        emoji: '👋',
        title: 'The name of the note is going to show up here',
        folder: 'Folder name',
        createdAt: '09/28/2025',
        type: 'Audio',
    },
    {
        id: 2,
        emoji: '🧰',
        title: 'Note 2',
        folder: 'Folder 2',
        createdAt: '09/13/2025',
        type: 'Text',
    }
]


