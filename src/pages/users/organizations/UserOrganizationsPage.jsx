import MainLayout from "../../../layouts/MainLayout";
import useUserService from "../../../hooks/services/useUserService";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Form from "../../../components/Form";
import useLoader from "../../../hooks/useLoader";
import useNotification from "../../../hooks/useNotification";
import useOrganizationService from "../../../hooks/services/useOrganizationService";
import '../../../assets/styles/NestedCheckboxSelector/index.css';
import { faBuilding, faDesktop } from "@fortawesome/free-solid-svg-icons";
import GenericBox from "../../../components/GenericBox";
import useBaseService from "../../../hooks/services/useBaseService";
import { entities } from "../../../constants/entities";

const UserOrganizationsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getUserAppsAndOrgs, syncMultipleUserAppOrganizations } = useUserService(navigate);
    const { fetchAll: fetchApplications } = useBaseService(entities.applications, navigate);
    const { fetchAll: getOrganizations } = useBaseService(entities.organizations, navigate);
    const [applications, setApplications] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const [formData, setFormData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            showLoader();
            const [responseApplications, responseOrganizations, responseUserAppsAndOrgs] = await Promise.all([
                fetchApplications(),
                getOrganizations({}),
                getUserAppsAndOrgs(id)
            ]);

            setApplications(responseApplications.result.data);
            setOrganizations(responseOrganizations.result.data);
            setFormData(generateInitialFormData(responseApplications.result.data, responseOrganizations.result.data, responseUserAppsAndOrgs.data));
        } catch (error) {
            console.error(error);
            showNotification('error', 'Erro ao carregar aplicações e organizações');
        } finally {
            hideLoader();
        }
    };

    const generateInitialFormData = (applications, organizations, userAppsAndOrgs) => {
        return applications.reduce((acc, application) => {
            acc[application.id] = organizations.reduce((accOrg, org) => {
                accOrg[org.id] = userAppsAndOrgs.some(
                    (item) => item.application_id === application.id && item.organization_id === org.id
                );
                return accOrg;
            }, {});
            return acc;
        }, {});
    };

    const handleChange = (event) => {
        const { id, checked } = event.target;

        if (id.includes('primary')) {
            handlePrimaryCheckboxChange(id);
        } else if (id.includes('secundary')) {
            handleSecondaryCheckboxChange(id, checked);
        }
    };

    const handlePrimaryCheckboxChange = (id) => {
        const applicationId = id.split('-')[1];
        const isAllCheckBoxSelected = isAllSelected(applicationId);
        setFormData((prev) => ({
            ...prev,
            [applicationId]: Object.keys(prev[applicationId]).reduce((acc, currentValue) => {
                acc[currentValue] = !isAllCheckBoxSelected;
                return acc;
            }, {})
        }));
    };

    const handleSecondaryCheckboxChange = (id, checked) => {
        const [, applicationId, organizationId] = id.split('-');
        setFormData((prev) => ({
            ...prev,
            [applicationId]: {
                ...prev[applicationId],
                [organizationId]: checked
            }
        }));
    };

    const isAllSelected = (applicationId) => {
        return Object.values(formData[applicationId]).every(value => value === true);
    };

    const handleSubmit = async () => {
        try {
            const data = Object.keys(formData).reduce((acc, currentValue) => {
                const organizations = Object.entries(formData[currentValue]).map(([key, value]) => value ? key : null).filter(Boolean);

                if (organizations.length > 0) {
                    acc.push({ application_id: currentValue, organizations });
                }
                return acc;
            }, []);

            await syncMultipleUserAppOrganizations(id, data);
        } catch (error) {
            console.error(error);
            showNotification('error', 'Erro ao associar organizações');
        }
    };

    const handleBack = () => {
        navigate('/usuarios/');
    };

    return (
        <MainLayout>
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Organizações do Usuário
                </div>

                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit='Associar'
                    textLoadingSubmit='Associando'
                    handleBack={handleBack}
                >
                    {() => (
                        <div className="container-boxs">
                            {
                                applications.map((application) => (
                                    <GenericBox
                                        key={application.id}
                                        item={application}
                                        subItems={organizations}
                                        handleChange={handleChange}
                                        formData={formData}
                                        isAllSelected={isAllSelected}
                                        iconPrimary={faDesktop}
                                        iconSecundary={faBuilding}
                                    />
                                ))
                            } 
                        </div>
                    )}
                </Form>
                
            </div>
        </MainLayout>
    )
}

export default UserOrganizationsPage;