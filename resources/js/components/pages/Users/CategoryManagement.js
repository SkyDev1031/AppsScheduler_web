import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FilterMatchMode } from 'primereact/api';
import {
    getCategoriesApi,
    deleteCategoryApi,
    createCategoryApi,
    updateCategoryApi,
} from '../../api/CategoryAPI';
import { useGlobalContext } from '../../contexts';
import { toast_success, toast_error } from '../../utils';
import { _ERROR_CODES } from '../../config';
import useAuth from '../../hooks/useAuth';
import { Tag } from 'primereact/tag';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const { _user } = useAuth();
    const [query, setQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [form, setForm] = useState({ title: '', content: '', researcher_id: _user.id, role: 2 });

    const { setLoading, confirmDialog } = useGlobalContext();
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        fetchCategories();

        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await getCategoriesApi();
            console.log(res)
            if (isMounted.current) {
                setCategories(res || []);
            }
        } catch (err) {
            toast_error(err, _ERROR_CODES.NETWORK_ERROR);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (category) => {
        const isDelete = await confirmDialog('Are you sure you want to delete this category?');
        if (!isDelete) return;

        setLoading(true);
        try {
            await deleteCategoryApi(category.id);
            setCategories(prev => prev.filter(c => c.id !== category.id));
            toast_success('Category deleted successfully');
        } catch (err) {
            toast_error(err, _ERROR_CODES.NETWORK_ERROR);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!form.title.trim()) return toast_error('Title is required.');

        setLoading(true);
        try {
            if (isEditMode) {
                await updateCategoryApi(form.id, form);
                toast_success('Category updated successfully');
            } else {
                const res = await createCategoryApi(form);
                toast_success('Category created successfully');
            }
            setModalVisible(false);
            fetchCategories();
        } catch (err) {
            toast_error(err, _ERROR_CODES.NETWORK_ERROR);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setForm({ title: '', content: '', researcher_id: _user.id, role: 2 });
        setIsEditMode(false);
        setModalVisible(true);
    };

    const openEditModal = (category) => {
        setForm({ 
            title: category.title, 
            content: category.content, 
            id: category.id,
            role: category.role 
        });
        setIsEditMode(true);
        setModalVisible(true);
    };

    const getRoleName = (role) => {
        switch(role) {
            case 0: return 'System Default';
            case 1: return 'Default';
            case 2: return 'Custom';
            default: return 'Unknown';
        }
    };

    const getRoleSeverity = (role) => {
        switch(role) {
            case 0: return 'danger';    // Red for System Default
            case 1: return 'warning';  // Orange for Default
            case 2: return 'success'; // Green for Custom
            default: return 'info';     // Blue for Unknown
        }
    };

    const roleBodyTemplate = (rowData) => {
        return (
            <Tag 
                value={getRoleName(rowData.role)}
                severity={getRoleSeverity(rowData.role)}
                style={{ 
                    fontWeight: 'bold',
                    minWidth: '100px',
                    textAlign: 'center'
                }}
            />
        );
    };

    const actionButtons = (rowData) => {
        const isDefault = rowData.role === 0 || rowData.role === 1;
        
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    className="p-button-sm"
                    tooltip={isDefault ? "Default categories cannot be edited" : "Edit category"}
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => !isDefault && openEditModal(rowData)}
                    disabled={isDefault}
                    style={{ marginRight: '5px' }}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-danger p-button-sm"
                    tooltip={isDefault ? "Default categories cannot be deleted" : "Delete category"}
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => !isDefault && handleDelete(rowData)}
                    disabled={isDefault}
                />
            </div>
        );
    };

    return (
        <div className="p-4 container">
            <h3 className="mb-4">Category Management</h3>

            <DataTable
                value={categories}
                responsiveLayout="scroll"
                stripedRows
                paginator
                resizableColumns
                columnResizeMode="fit"
                showGridlines
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                rows={10}
                rowsPerPageOptions={[10, 20, 50]}
                filters={{ global: { value: query, matchMode: FilterMatchMode.CONTAINS } }}
                emptyMessage="No categories found."
                className="p-datatable-sm"
                header={
                    <div className='d-flex'>
                        <div className="me-auto p-2">
                            <button label='Reload' onClick={fetchCategories} className="btn btn-default"><i className='fa fa-refresh' /> Reload</button>
                            <button label='New Category' onClick={openCreateModal} className="btn btn-primary"><i className='fas fa-plus' /> New Category</button>
                        </div>
                        <div className="p-2">
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by keyword" />
                            </span>
                        </div>
                    </div>
                }
            >
                <Column header="No" body={(_, { rowIndex }) => rowIndex + 1} style={{ width: '80px' }} />
                <Column field="title" header="Category Name" sortable />
                <Column
                    field="content"
                    header="Description"
                    sortable
                    body={(rowData) => (
                        <div className="text-overflow-ellipsis" style={{ maxWidth: '300px' }}>
                            {rowData.content}
                        </div>
                    )}
                />
                <Column 
                    field="role" 
                    header="Type" 
                    sortable 
                    body={roleBodyTemplate}
                />
                <Column header="Actions" body={actionButtons} style={{ width: '140px' }} />
            </DataTable>

            <Dialog
                header={isEditMode ? 'Edit Category' : 'New Category'}
                visible={modalVisible}
                style={{ width: '500px' }}
                modal
                className="p-fluid"
                onHide={() => setModalVisible(false)}
                footer={
                    <div className="flex justify-end gap-2">
                        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setModalVisible(false)} />
                        <Button label="Save" onClick={handleSave} />
                    </div>
                }
            >
                <div className="field">
                    <label htmlFor="title">Category Name</label>
                    <InputText id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="field mt-3">
                    <label htmlFor="content">Description</label>
                    <InputText id="content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                </div>
                {isEditMode && (
                    <div className="field mt-3">
                        <label htmlFor="role">Type</label>
                        <Tag 
                            value={getRoleName(form.role)}
                            severity={getRoleSeverity(form.role)}
                            style={{ 
                                fontWeight: 'bold',
                                minWidth: '100px',
                                textAlign: 'center',
                                marginLeft: '10px'
                            }}
                        />
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default CategoryManagement;