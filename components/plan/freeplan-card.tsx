import { IconBoltFilled } from '@tabler/icons-react'
import React from 'react'
import Image from 'next/image'

const FreePlanCard = () => {
  return (
    <div className="border  rounded-xl">
        <Image src="/free-plan.svg" alt="free-plan" width={70} height={70} className="w-full object-cover rounded-t-xl" />
        <div className="p-4 gap-4 flex flex-col bg-background-primary rounded-b-xl">
        <div className="flex flex-col gap-2 ">
            <h3 className='text-xl font-semibold'>Upgrade to PRO</h3>
            <p className='text-[16px] text-muted-foreground'>Have access to unlimited notes and exclusive features today!</p>
        </div>
        <div className="p-1 rounded-xl bg-gradient-to-r from-[#BBFBC6] via-[#ADE0D5] to-[#A6BBF5] ">
                <a href="/signin">
                    <button className='flex items-center justify-center gap-2 hover:cursor-pointer text-white px-4 py-2 rounded-lg w-full bg-primary text-primary-foreground text-xl font-semibold bg-gradient-to-r from-[#76F28B] via-[#5CBCB0] to-[#6E8DF2]'>
                        <IconBoltFilled />
                        Upgrade to PRO
                    </button>
                </a>
            </div>
            </div>
    </div>
  )
}

export default FreePlanCard