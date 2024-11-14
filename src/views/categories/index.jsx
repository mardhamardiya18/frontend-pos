//import useState dan useEffect
import { useState, useEffect } from "react";

//import layout admin
import LayoutAdmin from "../../layouts/admin";

//import js cookie
import Cookies from "js-cookie";

//import service api
import Api from "../../services/api";

//import create category
import CategoryCreate from "./create";

//import component pagination
import PaginationComponent from "../../components/Pagination";

//import edit category
import CategoryEdit from "./edit";

//import delete button
import DeleteButton from "../../components/DeleteButton";

export default function CategoriesIndex() {
    //state categories
    const [categories, setCategories] = useState([]);

    //define state "pagination"
    const [pagination, setPagination] = useState({
        currentPage: 1,
        perPage: 0,
        total: 0
    });

    const [searching, setSearching] = useState(false);

    //state keyword
    const [keywords, setKeywords] = useState("");

    //define method "fetchData"
    const fetchData = async (pageNumber, keywords = "") => {

        //define variable "page"
        const page = pageNumber ? pageNumber : pagination.currentPage;

        //get token from cookies inside the function to ensure it's up-to-date
        const token = Cookies.get("token");

        if (token) {
            //set authorization header with token
            Api.defaults.headers.common["Authorization"] = token;

            try {
                //fetch data from API with Axios
                const response = await Api.get(
                    `/api/categories?page=${page}&search=${keywords}`
                );

                //assign response data to state "categories"
                setCategories(response.data.data);

                //pagination
                setPagination(() => ({
                    currentPage: response.data.pagination.currentPage,
                    perPage: response.data.pagination.perPage,
                    total: response.data.pagination.total
                }));

            } catch (error) {
                console.error("There was an error fetching the data!", error);
            }
        } else {
            console.error("Token is not available!");
        }
    };

    //call function "fetchData"
    useEffect(() => {
        setSearching(true);

        const delayDebounce = setTimeout(() => {
            fetchData(pagination.currentPage, keywords).finally(() => {
                setSearching(false); // Set searching to false after fetch is complete
            });
        }, 500); // Adjust delay as needed

        return () => {
            clearTimeout(delayDebounce); // Clear timeout if keywords changes
            setSearching(false); // Reset searching to false if debounce is cleared
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keywords]);

    //function "searchHandler"
    const searchHandlder = () => {

        //call function "fetchDataPost" with params
        fetchData(1, keywords);
    };

    //function "handleKeyDown"
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            searchHandlder();
        }
    };

    return (
        <LayoutAdmin>
            <div className="page-header d-print-none">
                <div className="container-xl">
                    <div className="row g-2 align-items-center">
                        <div className="col">
                            <div className="page-pretitle">HALAMAN</div>
                            <h2 className="page-title">CATEGORIES</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-body">
                <div className="container-xl">
                    <div className="row">
                        <div className="col-12 mb-3">
                            <div className="input-group">
                                <CategoryCreate fetchData={fetchData} />
                                <input
                                    type="text"
                                    className="form-control"
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="search by category name"
                                />
                                {searching ? (
                                    <button
                                        onClick={searchHandlder}
                                        className="btn btn-md btn-primary"
                                    >
                                        SEARCHING...
                                    </button>
                                ) : ''}
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="card">
                                <div className="table-responsive">
                                    <table className="table table-vcenter table-mobile-md card-table">
                                        <thead>
                                            <tr>
                                                <th>Category Name</th>
                                                <th>Description</th>
                                                <th className="w-1">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories.length > 0 ? (
                                                categories.map((category, index) => (
                                                    <tr key={index}>
                                                        <td data-label="Category Name">
                                                            <div className="d-flex py-1 align-items-center">
                                                                <span
                                                                    className="avatar me-2"
                                                                    style={{
                                                                        backgroundImage: `url(${import.meta.env.VITE_APP_BASEURL
                                                                            }/${category.image})`,
                                                                    }}
                                                                ></span>
                                                                <div className="flex-fill">
                                                                    <div className="font-weight-medium">
                                                                        {category.name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-muted" data-label="Description">
                                                            {category.description}
                                                        </td>
                                                        <td>
                                                            <div className="btn-list flex-nowrap">
                                                                <CategoryEdit categoryId={category.id} fetchData={fetchData} />
                                                                <DeleteButton id={category.id} endpoint="/api/categories" fetchData={fetchData} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center">
                                                        <div className="alert alert-danger mb-0">
                                                            Data Belum Tersedia!
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
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
    );
}