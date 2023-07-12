import AdminNavigation from './Navigation/AdminNavigation'

import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-regular-svg-icons'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import Filter from '../../component/Filter/Filter'

import examService from '../../service/examService'
import ModalDetailUser from './ModalDetailUser/ModalDetailUser'
import ModalNotify from '../../component/Modal/ModalNotify'
import SideBar from '../User/MyExam/SideBar/SideBar'
import { sideBarAdmin } from '../../component/RouteSideBar/routeSideBar'
import FilterExam from '../../component/Filter/FilterExam/FilterExam'
import ReactPaginate from 'react-paginate'
import NotFoundData from '../../component/NotFoundData/NotFoundData'

function ManageExam() {
    const { t } = useTranslation()
    const user = useSelector((state) => state.user)
    const language = useSelector((state) => state.app.language)

    let navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [newListExam, setNewListExam] = useState([])

    const [listExam, setListExam] = useState([])

    //detail modal
    const [currentExam, setCurrentExam] = useState()
    const [isOpenModalDetail, setIsOpenModalDetail] = useState(false)
    const [isOpenFilter, setIsOpenFilter] = useState(false)

    //delete modal
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [descriptionModal, setDescriptionModal] = useState('')
    const [currentDelete, setCurrentDelete] = useState()

    //filter

    const [dataSearch, setDataSearch] = useState({
        email: user.userInfo.email,
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

    let callAPI = async () => {
        let exam = await examService.getAllExam()
        if (exam && exam.errCode === 0) {
            setListExam(exam.data)
        }
    }

    useEffect(() => {
        callAPI()
    }, [])
    //console.log(listExam)

    let handleViewDetail = (data) => {
        setIsOpenModalDetail(true)
        setCurrentExam(data)
    }

    let handleCloseModalDetail = () => {
        setIsOpenModalDetail(false)
    }

    let handleEdit = (data) => {
        navigate(`/editExam/${data._id}`)
    }

    let handleDelete = (data) => {
        setCurrentDelete(data)
        setIsOpenModal(true)
        setDescriptionModal('Bạn có xác nhận xóa bài thi không')
    }

    let handleCloseModal = () => {
        setIsOpenModal(false)
        setDescriptionModal('')
    }

    let handleSubmitModal = async () => {
        let respon = await examService.deleteExamById({ id: currentDelete._id })

        if (respon && respon.errCode === 0) {
            callAPI()
        }

        setIsOpenModal(false)
        setDescriptionModal('')
    }

    let updateListDoExam = (data) => {
        setCurrentPage(0)

        setListExam(data)
    }

    const showModalFilter = (boonlean) => {
        setIsOpenFilter(boonlean)
    }

    let changeDataSearch = (data) => {
        setDataSearch(data)
    }

    let handlePageChange = (selectedPage) => {
        //console.log(selectedPage)
        setCurrentPage(selectedPage.selected)
        // Thực hiện các tác vụ cần thiết khi chuyển trang
    }

    useEffect(() => {
        let slicedData =
            listExam &&
            listExam.length > 0 &&
            listExam.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
        setNewListExam(slicedData)
    }, [listExam, currentPage])

    return (
        <>
            <AdminNavigation />
            <div className="admin-manage-container">
                <SideBar data={sideBarAdmin} />
                <div className="content">
                    <div className="manage-body">
                        <h2 className="title">{t('admin.manage-exam')}</h2>
                        <div className="filter">
                            {/* <FontAwesomeIcon className="icon-filter" icon={faFilter} /> */}
                            <FilterExam
                                style={{ top: '26px' }}
                                type="admin"
                                isOpenFilter={isOpenFilter}
                                showModal={showModalFilter}
                                changeDataSearch={changeDataSearch}
                                // type="manageExam"

                                updateListDoExam={updateListDoExam}
                                children={<span className="search">{t('content-your-exam.filter-exam')}</span>}
                            />
                        </div>
                        {newListExam && newListExam.length > 0 ? (
                            <div className="table-container">
                                <div className="table-head">
                                    <table>
                                        <thead>
                                            <tr className="table-header">
                                                <th className="px-5">STT</th>
                                                <th>{t('admin.author')}</th>
                                                <th>{t('admin.exam-title')}</th>
                                                <th>{t('admin.maximum-attempts')}</th>
                                                <th>{t('admin.exam-duration')}</th>
                                                <th>{t('admin.action')}</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>

                                <div className="table-body">
                                    <table>
                                        <tbody>
                                            {newListExam.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className="px-5">{index + 1}</td>
                                                        <td>{item.user && item.user.name}</td>
                                                        <td>{item.data.title}</td>
                                                        <td>
                                                            {language === 'en'
                                                                ? item.data.limit.labelEn
                                                                : item.data.limit.labelVi}
                                                        </td>
                                                        <td>
                                                            {language === 'en'
                                                                ? item.data.time.labelEn
                                                                : item.data.time.labelVi}
                                                        </td>

                                                        <td className="action">
                                                            <button
                                                                className="btn-view"
                                                                onClick={() => handleViewDetail(item)}
                                                            >
                                                                <FontAwesomeIcon icon={faEye} />
                                                            </button>
                                                            <button
                                                                className="btn-edit"
                                                                onClick={() => handleEdit(item)}
                                                            >
                                                                <FontAwesomeIcon icon={faPencil} />
                                                            </button>
                                                            <button
                                                                className="btn-delete"
                                                                onClick={() => handleDelete(item)}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <ReactPaginate
                                    previousLabel={currentPage === 0 ? null : t('admin.previous')}
                                    nextLabel={
                                        currentPage === Math.ceil(listExam.length / itemsPerPage) - 1
                                            ? null
                                            : t('admin.next')
                                    }
                                    breakLabel={'...'}
                                    breakClassName={'break-me'}
                                    pageCount={Math.ceil(listExam.length / itemsPerPage)} // Tổng số trang
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    onPageChange={handlePageChange}
                                    containerClassName={'pagination'}
                                    activeClassName={'active'}
                                    forcePage={currentPage}
                                />
                            </div>
                        ) : (
                            <>
                                <NotFoundData />{' '}
                            </>
                        )}
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
                    />
                )}
            </div>
        </>
    )
}

export default ManageExam
