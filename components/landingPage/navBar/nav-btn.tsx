import React from 'react'

const NavBtn = () => {
    return (
        <main>
            <div className="p-1 rounded-xl bg-gradient-to-r from-[#BBFBC6] via-[#ADE0D5] to-[#A6BBF5] hover:scale-105 transition-all duration-300">
                <a href="/signin">
                <button className='hover:cursor-pointer text-white px-4 py-2 rounded-lg bg-primary text-primary-foreground text-lg font-semibold bg-gradient-to-r from-[#76F28B] via-[#5CBCB0] to-[#6E8DF2]'>
                    Start now
                </button>
                </a>
            </div>
        </main>
    )
}

export default NavBtn