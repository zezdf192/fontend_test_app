import { useTranslation } from 'react-i18next'

import { useSelector, useDispatch } from 'react-redux'
import imgNoData from '../../styles/svg/no-data.png'
import './NotFoundData.scss'

function NotFoundData({ style }) {
    const { t } = useTranslation()
    const language = useSelector((state) => state.app.language)

    return (
        <div className="img-nodata-container" style={style}>
            <div className="img-nodata-body">
                <img src={imgNoData} alt="" />
                <span>{t('not-found.no-data')}</span>
            </div>
        </div>
    )
}

export default NotFoundData
