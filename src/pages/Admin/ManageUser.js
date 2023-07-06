import { useEffect, useState } from 'react'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AdminNavigation from './Navigation/AdminNavigation'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'

import './Manage.scss'

import ModalNotify from '../../component/Modal/ModalNotify'
import ModalEditUser from './ModalEditUser/ModalEditUser'
import ModalDetailUser from './ModalDetailUser/ModalDetailUser'
import userService from '../../service/userService'
import { faEye } from '@fortawesome/free-regular-svg-icons'
import { sideBarAdmin } from '../../component/RouteSideBar/routeSideBar'
import SideBar from '../User/MyExam/SideBar/SideBar'
import ReactPaginate from 'react-paginate'

function ManageUser() {
    const { t } = useTranslation()
    const language = useSelector((state) => state.app.language)

    const [listUsers, setListUsers] = useState([])

    const [currentPage, setCurrentPage] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [newListExam, setNewListExam] = useState([])

    //delete modal
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [descriptionModal, setDescriptionModal] = useState('')
    const [currentDelete, setCurrentDelete] = useState()

    //edit modal
    const [currentEdit, setCurrentEdit] = useState()
    const [isOpenModalEdit, setIsOpenModalEdit] = useState(false)

    //detail modal
    const [currentUser, setCurrentUser] = useState()
    const [isOpenModalDetail, setIsOpenModalDetail] = useState(false)

    //call api when start page

    let callAPI = async () => {
        let respon = await userService.getAllUsers()

        if (respon && respon.errCode === 0) {
            setListUsers(respon.data)
        }
    }

    useEffect(() => {
        callAPI()
    }, [])

    //action
    let handleDelete = (data) => {
        setCurrentDelete(data)
        setIsOpenModal(true)
        setDescriptionModal('modal.delete-user')
    }

    let handleCloseModal = () => {
        setIsOpenModal(false)
        setDescriptionModal('')
    }

    let handleSubmitModal = async () => {
        let respon = await userService.deleteUser({ id: currentDelete._id })

        if (respon && respon.errCode === 0) {
            callAPI()
        }

        setIsOpenModal(false)
        setDescriptionModal('')
    }

    //modal edit
    let handleEdit = (data) => {
        setCurrentEdit(data)
        setIsOpenModalEdit(true)
    }

    let handleCloseModalEdit = () => {
        setIsOpenModalEdit(false)
    }

    let handleSubmitModalEdit = () => {
        callAPI()
        setIsOpenModalEdit(false)
    }

    //handle view deatil
    let handleViewDetail = (data) => {
        setIsOpenModalDetail(true)
        setCurrentUser(data)
    }

    let handleCloseModalDetail = () => {
        setIsOpenModalDetail(false)
    }

    // console.log(listUsers)

    let handlePageChange = (selectedPage) => {
        //console.log(selectedPage)
        setCurrentPage(selectedPage.selected)
        // Thực hiện các tác vụ cần thiết khi chuyển trang
    }

    useEffect(() => {
        let slicedData =
            listUsers &&
            listUsers.length > 0 &&
            listUsers.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
        setNewListExam(slicedData)
    }, [listUsers, currentPage])

    return (
        <>
            <AdminNavigation />
            <div className="admin-manage-container">
                <SideBar data={sideBarAdmin} />
                <div className="content">
                    <div className="manage-body">
                        <h2 className="title">{t('admin.manage-user')}</h2>
                        <div className="table-container">
                            <div className="table-head">
                                <table>
                                    <thead>
                                        <tr className="table-header">
                                            <th className="px-5">STT</th>
                                            <th>{t('admin.email')}</th>
                                            <th>{t('admin.name-user')}</th>

                                            <th>{t('admin.action')}</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>

                            <div className="table-body">
                                <table>
                                    <tbody>
                                        {newListExam &&
                                            newListExam.length > 0 &&
                                            newListExam.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className="px-5">{index + 1}</td>
                                                        <td>{item.email}</td>
                                                        <td>{item.name}</td>

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
                                    currentPage === Math.ceil(listUsers.length / itemsPerPage) - 1
                                        ? null
                                        : t('admin.next')
                                }
                                breakLabel={'...'}
                                breakClassName={'break-me'}
                                pageCount={Math.ceil(listUsers.length / itemsPerPage)} // Tổng số trang
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageChange}
                                containerClassName={'pagination'}
                                activeClassName={'active'}
                            />
                        </div>
                    </div>
                </div>

                {isOpenModal && (
                    <ModalNotify
                        typeModal="user"
                        isOpenModal={isOpenModal}
                        descriptionModal={descriptionModal}
                        handleCloseModal={handleCloseModal}
                        handleSubmitModal={handleSubmitModal}
                    />
                )}

                {isOpenModalEdit && (
                    <ModalEditUser
                        isOpenModal={isOpenModalEdit}
                        data={currentEdit}
                        handleCloseModalEdit={handleCloseModalEdit}
                        handleSubmitModalEdit={handleSubmitModalEdit}
                    />
                )}

                {isOpenModalDetail && (
                    <ModalDetailUser
                        data={currentUser}
                        isOpenModal={isOpenModalDetail}
                        handleCloseModalDetail={handleCloseModalDetail}
                        type="user"
                    />
                )}
            </div>
        </>
    )
}

export default ManageUser
