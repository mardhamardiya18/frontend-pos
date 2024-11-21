//import useState dan useEffect
import { useState, useEffect } from 'react';

//import layout admin
import LayoutAdmin from "../../layouts/admin";

//import js cookie
import Cookies from 'js-cookie';

//import service api
import Api from "../../services/api";

//import component pagination
import PaginationComponent from "../../components/Pagination";

//import create user
import UserCreate from "./create";

//import edit user
import UserEdit from "./edit";

//import component DeleteButton
import DeleteButton from "../../components/DeleteButton";

export default function UsersIndex() {

    //state users
    const [users, setUsers] = useState([]);

    //define state "pagination"
    const [pagination, setPagination] = useState({
        currentPage: 1,
        perPage: 0,
        total: 0
    });

    //state keywords
    const [keywords, setKeywords] = useState("");

    //define method "fetchData"
    const fetchData = async (pageNumber, keywords = "") => {

        //define variable "page"
        const page = pageNumber ? pageNumber : pagination.currentPage;

        //get token from cookies inside the function to ensure it's up-to-date
        const token = Cookies.get('token');

        if (token) {
            //set authorization header with token
            Api.defaults.headers.common['Authorization'] = token;

            try {

                //fetch data from API with Axios
                const response = await Api.get(`/api/users?page=${page}&search=${keywords}`);

                //assign response data to state "users"
                setUsers(response.data.data);

                //set pagination
                setPagination({
                    currentPage: response.data.pagination.currentPage,
                    perPage: response.data.pagination.perPage,
                    total: response.data.pagination.total
                })

            } catch (error) {
                console.error("There was an error fetching the data!", error);
            }
        } else {
            console.error("Token is not available!");
        }

    }

    //call function "fetchData"
    useEffect(() => {
        fetchData();
    }, []);

    //function "searchHandler"
    const searchHandlder = () => {
        //call function "fetchDataPost" with params
        fetchData(1, keywords)
    }

    //function "handleKeyDown"
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            searchHandlder();
        }
    };

    return (
        <LayoutAdmin>
            <div className="page-header d-print-none">
                <div className="container-xl">
                    <div className="row g-2 align-items-center">
                        <div className="col">
                            <div className="page-pretitle">
                                HALAMAN
                            </div>
                            <h2 className="page-title">
                                USERS
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-body">
                <div className="container-xl">
                    <div className="row">
                        <div className='col-12 mb-3'>
                            <div className="input-group">
                                <UserCreate fetchData={fetchData} />
                                <input type="text" className="form-control" value={keywords} onChange={(e) => setKeywords(e.target.value)} onKeyDown={handleKeyDown} placeholder="search by user name" />
                                <button onClick={searchHandlder} className="btn btn-md btn-primary">SEARCH</button>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="card">
                                <div className="table-responsive">
                                    <table className="table table-vcenter table-mobile-md card-table">
                                        <thead>
                                            <tr>
                                                <th>Full Name</th>
                                                <th>Email Address</th>
                                                <th className="w-1">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                users.length > 0
                                                    ? users.map((user, index) => (
                                                        <tr key={index}>
                                                            <td data-label="Full Name">
                                                                {user.name}
                                                            </td>
                                                            <td className="text-muted" data-label="Email Address">
                                                                {user.email}
                                                            </td>
                                                            <td>
                                                                <div className="btn-list flex-nowrap">
                                                                    <UserEdit userId={user.id} fetchData={fetchData} />
                                                                    <DeleteButton id={user.id} endpoint="/api/users" fetchData={fetchData} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                    : <tr>
                                                        <td colSpan="4" className="text-center">
                                                            <div className="alert alert-danger mb-0">
                                                                Data Belum Tersedia!
                                                            </div>
                                                        </td>
                                                    </tr>
                                            }

                                        </tbody>
                                    </table>
                                    <PaginationComponent
                                        currentPage={pagination.currentPage}
                                        perPage={pagination.perPage}
                                        total={pagination.total}
                                        onChange={(pageNumber) => fetchData(pageNumber, keywords)}
                                        position="end"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    )
}