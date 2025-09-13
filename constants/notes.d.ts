export type Note = {
    id: number
    emoji: string
    title: string
    folder: string
    createdAt: string
    type: string
},

const type = ['Audio',  'YouTube', 'Website', 'PDF_File', 'Text']

const TYPE_COLORS = {
    Audio: 'bg-(--type-audio-bg) text-(--type-audio-color-font)',
    YouTube: 'bg-(--type-YouTube-bg) text-(--type-YouTube-color-font)',
    Website: 'bg-(--type-website-bg) text-(--type-website-color-font)',
    PDF_File: 'bg-(--type-pdf-bg) text-(--type-pdf-color-font)',
    Text: 'bg-(--type-text-bg) text-(--type-text-color-font)',
},

export const NOTES: Note[] = [  
    {
        id: 1,
        emoji: '🎧',
        title: 'Note 1',
        folder: 'Folder 1',
        createdAt: '09/13/2025',
        type: 'Audio',
    },
    {
        id: 2,
        emoji: '🧰',
        title: 'Note 2',
        folder: 'Folder 2',
        createdAt: '09/13/2025',
        type: 'Video',
    }
]

