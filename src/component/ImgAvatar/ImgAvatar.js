import './ImgAvatar.scss'
import { useEffect, useState } from 'react'
import nonAvatar from '../../styles/svg/avatar.jpg'
import ButtonNotify from '../ButtonNotify/ButtonNotify'
import { useTranslation } from 'react-i18next'

function ImgAvatar({ src, alt, width, onClick }) {
    const { t } = useTranslation()
    const [srcImg, setSrcImg] = useState()

    useEffect(() => {
        if (!src) {
            setSrcImg(nonAvatar)
        } else {
            setSrcImg(src)
        }
    }, [src])

    return (
        <img className="img-contant" style={{ width: width, height: width }} onClick={onClick} src={srcImg} alt={alt} />
    )
}

export default ImgAvatar
