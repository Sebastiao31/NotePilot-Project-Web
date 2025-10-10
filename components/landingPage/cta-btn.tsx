import React from 'react'

const CtaBtn = () => {
    return (
        <main>
            <div className="p-1 rounded-xl bg-gradient-to-r from-[#BBFBC6] via-[#ADE0D5] to-[#A6BBF5] hover:scale-105 transition-all duration-300">
                <a href="/signin">
                    <button className='hover:cursor-pointer text-white px-4 py-3 rounded-lg bg-primary text-primary-foreground text-2xl font-semibold bg-gradient-to-r from-[#76F28B] via-[#5CBCB0] to-[#6E8DF2]'>
                        Try NotePilot for FREE
                    </button>
                </a>
            </div>
        </main>
    )
}

export default CtaBtn