import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowDown91,
    faArrowDownAZ,
    faArrowUp19,
    faArrowUpAZ,
    faEye,
    faFilter,
    faPencil,
    faPlay,
    faSort,
    faTrash,
} from '@fortawesome/free-solid-svg-icons'

import HeaderHome from '../../HomePage/HeaderHome/HeaderHome'
import Button from '../../../component/ButtonNotify/ButtonNotify'
import './MyExam.scss'
import { path } from '../../../until/constant'

import examService from '../../../service/examService'
import { sideBarUser } from '../../../component/RouteSideBar/routeSideBar'
import SideBar from './SideBar/SideBar'
import FilterExam from '../../../component/Filter/FilterExam/FilterExam'
import ModalDetailUser from '../../Admin/ModalDetailUser/ModalDetailUser'
import ModalNotify from '../../../component/Modal/ModalNotify'
import { toast } from 'react-toastify'

function MyExam() {
    const { t } = useTranslation()
    const language = useSelector((state) => state.app.language)
    let navigate = useNavigate()
    const user = useSelector((state) => state.user)

    //filter
    const [isOpenFilter, setIsOpenFilter] = useState(false)
    const [dataSearch, setDataSearch] = useState({
        userID: user.userInfo._id,
        nameExam: '',
        currentJoin: null,
        typeCurrentJoin: 'greater',
        maxQuantity: 'L',
        maxScore: 'S',
        maxTime: 'T',
        typeExam: 'ALL',
        dayStart: null,
        dayEnd: null,
    })
    //exam
    const [listExam, setListExam] = useState([])
    const [fieldSort, setFieldSort] = useState('title')
    const [hidden, setHidden] = useState([])

    //delete modal
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [descriptionModal, setDescriptionModal] = useState('')
    const [currentDelete, setCurrentDelete] = useState()

    //Modal
    const [currentExam, setCurrentExam] = useState()
    const [isOpenModalDetail, setIsOpenModalDetail] = useState(false)

    const [iconSort, setIconSort] = useState(<FontAwesomeIcon className="icon-sort" icon={faArrowUpAZ} />)
    const [arrayTableTitles, setArrayTableTitles] = useState([
        {
            key: 'title',
            status: 'up',
            value: 'content-your-exam.name-exam',
        },
        {
            key: 'quantityJoin',
            status: 'up',
            value: 'content-your-exam.number-attempts',
        },
    ])

    let callAPI = async () => {
        let respon = await examService.getAllExamByUserId({ userID: user.userInfo._id })

        if (respon && respon.errCode === 0) {
            //console.log(respon.data)
            setHidden(Array(respon.data.length).fill(true))
            setListExam(respon.data)
        }
    }

    useEffect(() => {
        callAPI()
    }, [])

    let handleSortByField = async (type, index) => {
        let copyArrayTableTitles = arrayTableTitles

        if (copyArrayTableTitles[index].status === 'up') {
            copyArrayTableTitles[index].status = 'down'
        } else {
            copyArrayTableTitles[index].status = 'up'
        }

        setFieldSort(type)
        setArrayTableTitles(copyArrayTableTitles)

        let respon = await examService.sortExamByType({
            userID: user && user.userInfo && user.userInfo._id,
            type: type,
            typeSort: arrayTableTitles[index].status,
            dataSearch: dataSearch,
        })

        if (respon && respon.errCode === 0) {
            setListExam(respon.data)
        }
    }

    let handleDisPlayTypeSort = (type, typeSort) => {
        //console.log(type, typeSort)

        if (type === 'title') {
            if (typeSort === 'up') {
                setIconSort(<FontAwesomeIcon className="icon-sort" icon={faArrowUpAZ} />)
            } else {
                setIconSort(<FontAwesomeIcon className="icon-sort" icon={faArrowDownAZ} />)
            }
        } else {
            if (typeSort === 'up') {
                setIconSort(<FontAwesomeIcon className="icon-sort" icon={faArrowUp19} />)
            } else {
                setIconSort(<FontAwesomeIcon className="icon-sort" icon={faArrowDown91} />)
            }
        }
    }

    let handleShowPassword = (index) => {
        let copyHidden = hidden
        copyHidden[index] = !copyHidden[index]

        setHidden([...copyHidden])
    }

    //filer
    let updateListDoExam = (data) => {
        setListExam(data)
    }

    const showModalFilter = (boonlean) => {
        setIsOpenFilter(boonlean)
    }

    let changeDataSearch = (data) => {
        setDataSearch(data)
    }

    // Action
    let handleViewDetail = (data) => {
        setIsOpenModalDetail(true)
        setCurrentExam(data)
    }

    let handleCloseModalDetail = () => {
        setIsOpenModalDetail(false)
    }

    let handleEdit = (data) => {
        //console.log(data)
        navigate(`/editExam/${data._id}`)
    }

    let handleDelete = (data) => {
        setCurrentDelete(data)
        setIsOpenModal(true)
        setDescriptionModal(t('modal.confirm-delete'))
    }

    let handleCloseModal = () => {
        setIsOpenModal(false)
        setDescriptionModal('')
    }

    let handleSubmitModal = async () => {
        let respon = await examService.deleteExamById({ id: currentDelete._id })

        if (respon && respon.errCode === 0) {
            callAPI()
            toast.success(t('modal.delete-success'))
        } else {
            toast.error(t('modal.delete-error'))
        }

        setIsOpenModal(false)
        setDescriptionModal('')
    }

    let buildEJSTypeExam = (type) => {
        if (type === 'PUBLIC') {
            return language === 'en' ? 'Public' : 'Công khai'
        } else {
            return language === 'en' ? 'Private' : 'Riêng tư'
        }
    }

    return (
        <>
            <HeaderHome />
            <div className="my-exam-container">
                <SideBar data={sideBarUser} />

                <div className="content">
                    <div className="manage-body">
                        <h2 className="title">{t('content-your-exam.compilation-exams-participated')}</h2>

                        {listExam && listExam.length > 0 && (
                            <>
                                <div className="header-exam">
                                    <Link to={path.createExam} className="add-exam">
                                        {t('content-your-exam.add-exam')}
                                    </Link>
                                    <div className="filter">
                                        <FilterExam
                                            isOpenFilter={isOpenFilter}
                                            updateListDoExam={updateListDoExam}
                                            showModal={showModalFilter}
                                            changeDataSearch={changeDataSearch}
                                            children={
                                                <span className="search">{t('content-your-exam.filter-exam')}</span>
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="table-container">
                                    <div className="table-head">
                                        <table>
                                            <thead>
                                                <tr className="table-header">
                                                    <th className="px-5">STT</th>
                                                    {arrayTableTitles &&
                                                        arrayTableTitles.length > 0 &&
                                                        arrayTableTitles.map((item, index) => {
                                                            return (
                                                                <th
                                                                    key={index}
                                                                    onClick={() => {
                                                                        handleSortByField(item.key, index)
                                                                        handleDisPlayTypeSort(item.key, item.status)
                                                                    }}
                                                                >
                                                                    {t(item.value)}
                                                                    {fieldSort === item.key && iconSort}
                                                                </th>
                                                            )
                                                        })}

                                                    <th>{t('content-your-exam.password')}</th>
                                                    <th>{t('content-your-exam.type-exam')}</th>
                                                    <th>{t('content-your-exam.action')}</th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>

                                    <div className="table-body">
                                        <table>
                                            <tbody>
                                                {listExam &&
                                                    listExam.length > 0 &&
                                                    listExam.map((item, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td className="px-5">{index + 1}</td>
                                                                <td>{item.data.title}</td>
                                                                <td>{item.data.quantityJoin}</td>

                                                                <td
                                                                    className={hidden[index] ? 'hidden-password' : ''}
                                                                    onDoubleClick={() => handleShowPassword(index)}
                                                                >
                                                                    <Button
                                                                        descrip={t('tippy.double-click')}
                                                                        children={<span>{item.data.password}</span>}
                                                                    />
                                                                </td>
                                                                <td>{buildEJSTypeExam(item.data.typeExam)}</td>
                                                                <td className="action">
                                                                    <Button
                                                                        descrip={t('tippy.detail-exam')}
                                                                        children={
                                                                            <button
                                                                                className="btn-view"
                                                                                onClick={() => handleViewDetail(item)}
                                                                            >
                                                                                <FontAwesomeIcon icon={faEye} />
                                                                            </button>
                                                                        }
                                                                    />
                                                                    <Button
                                                                        descrip={t('tippy.edit-exam')}
                                                                        children={
                                                                            <button
                                                                                className="btn-edit"
                                                                                onClick={() => handleEdit(item)}
                                                                            >
                                                                                <FontAwesomeIcon icon={faPencil} />
                                                                            </button>
                                                                        }
                                                                    />

                                                                    <Button
                                                                        descrip={t('tippy.remove-exam')}
                                                                        children={
                                                                            <button
                                                                                className="btn-delete"
                                                                                onClick={() => handleDelete(item)}
                                                                            >
                                                                                <FontAwesomeIcon icon={faTrash} />
                                                                            </button>
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {isOpenModal && (
                <ModalNotify
                    typeModal="exam"
                    isOpenModal={isOpenModal}
                    descriptionModal={descriptionModal}
                    handleCloseModal={handleCloseModal}
                    handleSubmitModal={handleSubmitModal}
                />
            )}
            {isOpenModalDetail && (
                <ModalDetailUser
                    data={currentExam}
                    isOpenModal={isOpenModalDetail}
                    handleCloseModalDetail={handleCloseModalDetail}
                    type="exam"
                    ratings
                />
            )}
        </>
    )
}

export default MyExam
