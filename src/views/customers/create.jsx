/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
// import useState dan useRef
import { useState, useRef } from 'react'

//import js cookie
import Cookies from "js-cookie";

//import toats
import toast from "react-hot-toast";

//import service api
import Api from "../../services/api";

//import handler error
import { handleErrors } from "../../utils/handleErrors";

export default function CustomerCreate({ fetchData }) {

    //state
    const [name, setName] = useState("");
    const [noTelp, setNoTelp] = useState("");
    const [address, setAddress] = useState("");
    const [errors, setErrors] = useState({});

    const modalRef = useRef(null); // Create a ref for the modal

    //token
    const token = Cookies.get("token");

    //function "storeCustomer"
    const storeCustomer = async (e) => {
        e.preventDefault();

        //set authorization header with token
        Api.defaults.headers.common['Authorization'] = token;
        await Api.post('/api/customers', {

            //data
            name: name,
            no_telp: noTelp,
            address: address

        }).then((response) => {

            //show toast
            toast.success(`${response.data.meta.message}`, {
                duration: 4000,
                position: "top-right",
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });

            // Hide the modal
            const modalElement = modalRef.current;
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();

            //call function "fetchData"
            fetchData();

            // Reset form
            setName('');
            setNoTelp('');
            setAddress('');

        })
            .catch((error) => {

                //assign error to function "handleErrors"
                handleErrors(error.response.data, setErrors);
            })

    }

    return (
        <>
            <a href="#" className="btn btn-primary d-sm-inline-block" data-bs-toggle="modal" data-bs-target="#modal-create-customer">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                Add New
            </a>
            <div className="modal modal-blur fade" id="modal-create-customer" tabIndex="-1" role="dialog" aria-hidden="true" ref={modalRef}>
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <form onSubmit={storeCustomer}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">New Customer</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label className="form-label">Customer Name</label>
                                            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Customer Name' />
                                            {
                                                errors.name && (
                                                    <div className="alert alert-danger mt-2">
                                                        {errors.name}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label className="form-label">No. Telp</label>
                                            <input type="text" className="form-control" value={noTelp} onChange={(e) => setNoTelp(e.target.value)} placeholder='Enter No. Telp' />
                                            {
                                                errors.no_telp && (
                                                    <div className="alert alert-danger mt-2">
                                                        {errors.no_telp}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div>
                                            <label className="form-label">Address</label>
                                            <textarea className="form-control" rows="3" value={address} onChange={(e) => setAddress(e.target.value)} placeholder='Enter Address'></textarea>
                                            {
                                                errors.address && (
                                                    <div className="alert alert-danger mt-2">
                                                        {errors.address}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <a href="#" className="btn me-auto rounded" data-bs-dismiss="modal">
                                    Cancel
                                </a>
                                <button type='submit' className="btn btn-primary ms-auto rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}