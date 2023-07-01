import React from 'react'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css' // optional

function ButtonNotify({ children, descrip }) {
    const tooltipOptions = {
        delay: 0, // delay[0] là thời gian trì hoãn xuất hiện, delay[1] là thời gian trì hoãn ẩn đi
        duration: 0, // thời gian hiệu ứng hoàn thành
    }

    return (
        <>
            <Tippy content={descrip} animation="scale" placement="bottom" arrow duration={0}>
                {children}
            </Tippy>
        </>
    )
}

export default ButtonNotify
