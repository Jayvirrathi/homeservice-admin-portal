import React, { Component } from 'react'
import ServiceItem from './ServiceItem';
import axios from 'axios';
import $ from 'jquery';
export default class Services extends Component {

    constructor() {
        super()
        this.state = {
            data: false,
            service_id: '',
            service_name: '',
            service_tnc: '',
            service_charge: '',
            service_icon: '',
            editItem: false
        }

        this.handleChange = this.handleChange.bind(this);
    }

    // set data to the state
    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    /* Add Function */
    handleSubmit = async (e) => {
        e.preventDefault();


        // console.log(this.state.service_name,this.state.service_tnc,this.state.service_charge,this.state.service_icon);
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }


        if (this.state.editItem) {

            var update_body = new URLSearchParams();
            update_body.append('id', this.state.service_id);
            update_body.append('name', this.state.service_name);
            update_body.append('tnc', this.state.service_tnc);
            update_body.append('charge', this.state.service_charge);
            update_body.append('icon', this.state.service_icon);
            await axios.post('https://admin-service87.herokuapp.com/update_service/', update_body, config)
                .then((response) => {
                    $('#myModal').modal('toggle');
                    alert(JSON.stringify("Service Updated"));
                    this.setState({ editItem: false });
                })
                .catch(function (error) {
                    alert(error);

                });
        }
        else {

            var insert_body = new URLSearchParams();
            insert_body.append('name', this.state.service_name);
            insert_body.append('tnc', this.state.service_tnc);
            insert_body.append('charge', this.state.service_charge);
            insert_body.append('icon', this.state.service_icon);
            await axios.post('https://admin-service87.herokuapp.com/insert_service/', insert_body, config)
                .then((response) => {
                    $('#myModal').modal('toggle');
                    alert(JSON.stringify(response.data));

                })
                .catch(function (error) {
                    alert(error);

                });
        }

        this.setState({
            service_id: '',
            service_name: '',
            service_tnc: '',
            service_charge: '',
            service_icon: ''
        })
        this.getData();

    };


    /* Delete Function */
    handleDelete = async (id) => {
        // alert(id)
        var body = new URLSearchParams();
        body.append('id', id);
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        await axios.post('https://admin-service87.herokuapp.com/delete_service/', body, config)
            .then(function (response) {
                alert(JSON.stringify('Service ' + response.data));
            })
            .catch(function (error) {
                alert(error);

            });

        this.getData();

    }

    /* Edit Function */
    handleEdit = (id) => {
        const filtereddata = this.state.data.filter(item => item.id !== id)
        const selectedItem = this.state.data.find(item => item._id === id);
        this.setState({
            data: filtereddata,
            service_id: id,
            service_name: selectedItem.service_name || '',
            service_tnc: selectedItem.service_tnc || '',
            service_charge: selectedItem.service_charge || '',
            service_icon: selectedItem.service_icon || '',
            editItem: true
        });
    }



    /*Get  data*/

    getData = () => {
        fetch('https://admin-service87.herokuapp.com/services')
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    data: responseJson,
                })
            })
            .catch((error) => {
                console.error(error);
            });
    }
    async componentDidMount() {
        await this.getData()
    }


    /* Render */
    render() {

        const { data, service_name, service_charge, service_icon, service_tnc, editItem } = this.state;
        if (data) {
            return (
                <div className='align-data-end'>

                    <ul className="list-group my-5 d-flex">
                        <h3 className="text-capitalize float-left">
                            Service List
                            <button type="button" className="btn btn-primary mx-2 float-right" data-toggle="modal" data-target="#myModal">
                                Add new service</button>
                            <hr />
                        </h3>

                        <div className="d-flex justify-content-start flex-wrap">

                            {
                                data.map(item => {
                                    return (
                                        <ServiceItem
                                            key={item._id}
                                            title={item.service_name}
                                            handleDelete={() => this.handleDelete(item._id)}
                                            handleEdit={() => this.handleEdit(item._id)}
                                        />
                                    )
                                })
                            }
                        </div>
                    </ul>

                    <div className="modal" id="myModal">
                        <div className="modal-dialog">
                            <div className="modal-content">


                                <div className="modal-header">
                                    <h4 className="modal-title">Add Service</h4>
                                    <button type="button" className="close"
                                        data-dismiss="modal"
                                        onClick={() => this.setState({
                                            editItem: false, service_id: '',
                                            service_name: '',
                                            service_tnc: '',
                                            service_charge: '',
                                            service_icon: ''
                                        })}>&times;</button>
                                </div>


                                <div className="modal-body">
                                    <div className="card card-body my-3 w-100">
                                        <form onSubmit={this.handleSubmit}>
                                            <div className="input-group m-2" >
                                                <div className="input-group-prepend">
                                                    <div className="input-group-text bg-primary text-white">
                                                        <i className="fas fa-book"></i>
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control text-capitalize"
                                                    placeholder="Add Service"
                                                    value={service_name}
                                                    name='service_name'
                                                    onChange={this.handleChange} required />
                                            </div>

                                            <div className="input-group m-2">
                                                <div className="input-group-prepend">
                                                    <div className="input-group-text bg-primary text-white">
                                                        <i className="fas fa-book"></i>
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control text-capitalize"
                                                    placeholder="T&C"
                                                    value={service_tnc}
                                                    name='service_tnc'
                                                    onChange={this.handleChange} required />
                                            </div>

                                            <div className="input-group m-2">
                                                <div className="input-group-prepend">
                                                    <div className="input-group-text bg-primary text-white">
                                                        <i className="fas fa-book"></i>
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control text-capitalize"
                                                    placeholder="Visiting Charges"
                                                    value={service_charge}
                                                    name='service_charge'
                                                    onChange={this.handleChange} required />
                                            </div>

                                            <div className="input-group m-2">
                                                <div className="input-group-prepend">
                                                    <div className="input-group-text bg-primary text-white">
                                                        <i className="fas fa-book"></i>
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control text-capitalize"
                                                    placeholder="Icon Url"
                                                    value={service_icon}
                                                    name='service_icon'
                                                    onChange={this.handleChange} required />
                                            </div>
                                            <button
                                                type="submit" className={editItem ? "btn btn-block btn-warning mt-3 text-capitalize" : "btn btn-block btn-success mt-3  text-capitalize"} >{editItem ? "edit item" : "Add Service"}</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>




                </div>
            )
        } else {
            return (
                <div>Loading...</div>
            )
        }
    }
}