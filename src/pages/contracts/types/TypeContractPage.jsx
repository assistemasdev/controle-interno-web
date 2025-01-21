// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import MainLayout from "../../../layouts/MainLayout";
// import Button from "../../../components/Button";
// import { usePermissions } from "../../../hooks/usePermissions";
// import DynamicTable from "../../../components/DynamicTable";
// import useTypeService from "../../../hooks/useTypeService";
// import { useNavigate, useLocation } from "react-router-dom";
// import { faEdit, faTrash, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
// import ConfirmationModal from "../../../components/modals/ConfirmationModal";
// import { PAGINATION } from "../../../constants/pagination";
// import useLoader from "../../../hooks/useLoader";
// import AutoCompleteFilter from "../../../components/AutoCompleteFilter";
// import baseService from "../../../services/baseService";

// const TypeContractPage = () => {
//     const { canAccess } = usePermissions();
//     const { fetchTypes, deleteType } = useTypeService();
//     const { showLoader, hideLoader } = useLoader();
//     const [selectedTypes, setSelectedTypes] = useState([]);
//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//     const [typeToDelete, setTypeToDelete] = useState(null);
//     const [types, setTypes] = useState([]);
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
//     const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
//     const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);

//     useEffect(() => {
//         if (location.state?.message) {
//             const { type, text } = location.state.message;
//             setTimeout(() => navigate(location.pathname, { replace: true }), 0); 
//         }
//     }, [location.state, navigate]);

//     const handleClearFilters = useCallback(() => {
//         window.location.reload();
//     }, []);

//     const loadTypes = useCallback(async ({id = null, name = null, idLike = null, filledInputs = null, page = 1} = {}) => {
//         showLoader();
//         try {
//             const result = await fetchTypes({ id, name, idLike, filledInputs, page, perPage: itemsPerPage });
//             setTypes(result.data.map((type) => ({
//                 id: type.id,
//                 name: type.name
//             })));
//             setTotalPages(result.last_page);
//             setCurrentPage(result.current_page);
//         } finally {
//             hideLoader();
//         }
//     }, [fetchTypes, itemsPerPage, showLoader, hideLoader]);

//     useEffect(() => {
//         loadTypes();
//     }, [itemsPerPage]);

//     const handleEdit = useCallback((type) => {
//         navigate(`/contratos/tipos/editar/${type.id}`);
//     }, [navigate]);

//     const handleDelete = useCallback((type) => {
//         setTypeToDelete(type);
//         setDeleteModalOpen(true);
//     }, []);

//     const handleFilterSubmit = (e) => {
//         e.preventDefault();

//         const filledInputs = new Set(selectedTypes.map((option) => option.column)).size;

//         loadTypes(
//             selectedTypes.filter((type) => type.textFilter === false || (type.column === 'id' && type.numberFilter === false)).map((type) => type.value),
//             selectedTypes.filter((type) => type.textFilter === true && type.column === 'name').map((type) => type.value),
//             selectedTypes.filter((type) => type.numberFilter === true && type.column === 'id').map((type) => type.value),
//             filledInputs
//         );
//     };

//     const handleChangeCustomers = useCallback((newSelected, column) => {
//         setSelectedTypes((prev) => {
//             if (!newSelected.length) {
//                 return prev.filter((option) => option.column !== column);
//             }

//             const newSelectedArray = Array.isArray(newSelected) ? newSelected : [newSelected];

//             const filtered = prev.filter((option) => option.column !== column);
//             return [...filtered, ...newSelectedArray];
//         });
//     }, []);

//     const confirmDelete = useCallback(async () => {
//         showLoader();
//         try {
//             await deleteType(typeToDelete.id);
//             loadTypes();
//         } finally {
//             setDeleteModalOpen(false);
//             hideLoader();
//         }
//     }, [deleteType, typeToDelete, loadTypes, showLoader, hideLoader]);

//     const headers = useMemo(() => ['id', 'Nome'], []);

//     const actions = useMemo(() => [
//         {
//             icon: faEdit,
//             title: 'Editar Cargos',
//             buttonClass: 'btn-primary',
//             permission: 'Atualizar tipos de produto',
//             onClick: handleEdit
//         },
//         {
//             icon: faTrash,
//             title: 'Excluir Tipo',
//             buttonClass: 'btn-danger',
//             permission: 'Excluir tipos de produto',
//             onClick: handleDelete
//         }
//     ], [handleEdit, handleDelete]);

//     return (
//         <MainLayout selectedCompany="ALUCOM">
//             <div className="container-fluid p-1">
//                 <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
//                     Tipos de Contrato
//                 </div>

//                 <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleFilterSubmit}>
//                     <div className="form-group col-md-6">
//                         <label htmlFor="name" className="text-dark font-weight-bold mt-1">
//                             Número:
//                         </label>
//                         <AutoCompleteFilter
//                             service={baseService}
//                             columnDataBase="id"
//                             model='ContractType'
//                             value={selectedTypes.filter((option) => option.column === 'id')}
//                             onChange={(selected) => handleChangeCustomers(selected, 'id')}
//                             onBlurColumn="numberFilter"
//                             placeholder="Filtre os tipos pelo número"
//                             isMulti
//                         />
//                     </div>
//                     <div className="form-group col-md-6">
//                         <label htmlFor="name" className="text-dark font-weight-bold mt-1">
//                             Nome:
//                         </label>
//                         <AutoCompleteFilter
//                             service={baseService}
//                             columnDataBase="name"
//                             model='ContractType'
//                             value={selectedTypes.filter((option) => option.column === 'name')}
//                             onChange={(selected) => handleChangeCustomers(selected, 'name')}
//                             onBlurColumn="textFilter"
//                             placeholder="Filtre os tipos pelo nome"
//                             isMulti
//                         />
//                     </div>
//                     <div className="form-group gap-2">
//                         <Button type="submit" text="Filtrar" className="btn btn-blue-light fw-semibold m-1" />
//                         <Button type="button" text="Limpar Filtros" className="btn btn-blue-light fw-semibold m-1" onClick={handleClearFilters} />
//                     </div>
//                 </form>

//                 <div className="form-row mt-4 d-flex justify-content-between align-items-center">
//                     <div className="font-weight-bold text-primary text-uppercase mb-1 text-dark d-flex">
//                         Lista de Tipos de Contrato
//                     </div>
//                     {canAccess('') && (
//                         <Button
//                             text="Novo Tipo"
//                             className="btn btn-blue-light fw-semibold"
//                             link="/contratos/tipos/criar"
//                         />
//                     )}
//                 </div>

//                 <DynamicTable
//                     headers={headers}
//                     data={types}
//                     actions={actions}
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     onPageChange={loadTypes}
//                 />

//                 <ConfirmationModal
//                     open={deleteModalOpen}
//                     onClose={() => setDeleteModalOpen(false)}
//                     onConfirm={confirmDelete}
//                     itemName={typeToDelete ? typeToDelete.name : ''}
//                 />
//             </div>
//         </MainLayout>
//     );
// };

// export default TypeContractPage;
