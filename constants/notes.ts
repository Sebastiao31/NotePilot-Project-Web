export type Note = {
    id: number
    emoji: string
    title: string
    folder: string
    createdAt: string
    type: string
    note: string
    transcript: string
}

const type = ['Audio',  'YouTube', 'Website', 'PDF_File', 'Text']

const TYPE_COLORS = {
    Audio: 'bg-(--type-audio-bg) text-(--type-audio-color-font)',
    YouTube: 'bg-(--type-YouTube-bg) text-(--type-YouTube-color-font)',
    Website: 'bg-(--type-website-bg) text-(--type-website-color-font)',
    PDF_File: 'bg-(--type-pdf-bg) text-(--type-pdf-color-font)',
    Text: 'bg-(--type-text-bg) text-(--type-text-color-font)',
}


export const NOTES: Note[] = [  
    {
        id: 1,
        emoji: '👋',
        title: 'The name of the note is going to show up here',
        folder: 'Folder name',
        createdAt: '09/28/2025',
        type: 'Audio',
        note: 'The note content is going to show up here',
        transcript: 'The transcript is going to show up here',
    },
    {
        id: 2,
        emoji: '🧰',
        title: 'Note 2',
        folder: 'Folder 2',
        createdAt: '09/13/2025',
        type: 'Text',
        note: 'The note content is going to show up here',
        transcript: 'The transcript is going to show up here',
    }
]


