//import useState
import { useState } from 'react';

//import layout admin
import LayoutAdmin from "../../layouts/admin";

//import service api
import Api from "../../services/api";

//import js cookie
import Cookies from 'js-cookie';

//import moneyFormat
import moneyFormat from "../../utils/moneyFormat";
import { format } from 'date-fns';
import ExportButton from '../../components/ExportButton';

export default function Sales() {

    //state date
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    //state sales
    const [sales, setSales] = useState([]);
    const [total, setTotal] = useState(0);

    //token
    const token = Cookies.get('token');

    //function filter sales
    const filterSales = async (e) => {
        e.preventDefault();

        if (token) {
            //set authorization header with token
            Api.defaults.headers.common['Authorization'] = token;

            try {

                //fetch data from API with Axios
                const response = await Api.get(`/api/sales?start_date=${startDate}&end_date=${endDate}`);

                const fetchedSales = response.data.data.sales;

                // Format setiap elemen di array sales
                const formattedSales = fetchedSales.map(sale => ({
                    ...sale, // Menyalin data lain
                    created_at: format(new Date(sale.created_at), "dd MMMM yyyy | HH:mm") // Format created_at
                }));
                setSales(formattedSales);

                setTotal(response.data.data.total);


            } catch (error) {
                console.error("There was an error fetching the data!", error);
            }
        } else {
            console.error("Token is not available!");
        }
    }

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
                                REPORT SALES
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-body">
                <div className="container-xl">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <form onSubmit={filterSales}>
                                        <div className="row">
                                            <div className="col-md-5">
                                                <div className="mb-3">
                                                    <label className="form-label fw-bold">START DATE</label>
                                                    <input type="date" className="form-control" onChange={(e) => setStartDate(e.target.value)} value={startDate} />
                                                </div>
                                            </div>
                                            <div className="col-md-5">
                                                <div className="mb-3">
                                                    <label className="form-label fw-bold">END DATE</label>
                                                    <input type="date" className="form-control" onChange={(e) => setEndDate(e.target.value)} value={endDate} />
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="mb-3">
                                                    <label className="form-label fw-bold text-white">*</label>
                                                    <button className="btn btn-md btn-primary border-0 shadow w-100 rounded" type="submit">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-filter"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z" /></svg>
                                                        FILTER
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    {
                                        sales.length > 0 ? (
                                            <>
                                                <div className="export text-end mb-3 mt-5">
                                                    <ExportButton startDate={startDate} endDate={endDate} type="sales" />
                                                </div>
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr style={{ backgroundClip: '#e6e6e7' }}>
                                                            <th scope="col">Date</th>
                                                            <th scope="col">Invoice</th>
                                                            <th scope="col">Cashier</th>
                                                            <th scope="col">Customer</th>
                                                            <th scope="col">Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {sales.map((sale, index) => (
                                                            <tr key={index}>
                                                                <td>{sale.created_at}</td>
                                                                <td>{sale.invoice}</td>
                                                                <td>{sale.cashier.name}</td>
                                                                <td>{sale.customer?.name ?? 'Umum'}</td>
                                                                <td className='text-end'>{moneyFormat(sale.grand_total)}</td>
                                                            </tr>
                                                        ))}
                                                        <tr>
                                                            <td colSpan={4} className='text-end fw-bold'>Total</td>
                                                            <td className='text-end fw-bold'>{moneyFormat(total)}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </>
                                        ) : null
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    )
}