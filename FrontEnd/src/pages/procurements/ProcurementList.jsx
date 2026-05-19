import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { Search, Funnel, PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
import "./ProcurementList.css";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../../components/ui/main.js";
import { statusOptions, tipoOptions, origemOptions, filterProcurements, paginateItems, getStatusColor } from "../../components/shared/procurementListUtils.js";
import { getCurrentProcurementStatus } from "../../components/shared/procurementDeadline.js"
import { getAllProcurements, getDepartmentOptions } from "../../services/procurementService.js";
import { PROCUREMENT_TYPES, SECRETARIAS, getOptionLabel } from "../../utils/procurementOptions";

function ProcurementList() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [secretariaOptions, setSecretariaOptions] = useState(origemOptions);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProcurements() {

            try {
                setLoading(true);

                const [procurements, departments] =
                    await Promise.all([
                        getAllProcurements(),
                        getDepartmentOptions(),
                    ])

                setData(procurements)
                setSecretariaOptions(departments)
                setError("")

            } catch (error) {

                console.error(
                    "Erro ao carregar licitações:",
                    error
                )
                setError("Erro ao carregar licitações da API.")
            } finally {
                setLoading(false)
            }
        }

        loadProcurements()

    }, [])

    const irParaSelecao = () => {
        navigate("/procurements/create");
    };

    const [showFilter, setShowFilter] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedTipo, setSelectedTipo] = useState("");
    const [selectedOrigem, setSelectedOrigem] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    const dropdownRef = useRef();

    const toggleFilter = (currentValue, selectedValue, setter) => {
        setter(currentValue === selectedValue ? "" : selectedValue);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSelectedStatus("");
        setSelectedTipo("");
        setSelectedOrigem("");
        setCurrentPage(1);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1440) {
                setItemsPerPage(5);
            } else {
                setItemsPerPage(7);
            }

            setCurrentPage(1);
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const filters = {
        status: selectedStatus,
        tipo: selectedTipo,
        origem: selectedOrigem,
    };
    
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProcurements = filterProcurements(
    data,
    filters
    ).filter((procurement) => {

        const search = searchTerm.toLowerCase();

        const tipoLabel = String(getOptionLabel(
            PROCUREMENT_TYPES,
            procurement.tipo
        ) || "").toLowerCase();

        const origemLabel = String(getOptionLabel(
            SECRETARIAS,
            procurement.origem
        ) || "").toLowerCase();

        return (
            `${procurement.numero}/${procurement.ano}`
                .toLowerCase()
                .includes(search) ||

            tipoLabel.includes(search) ||

            origemLabel.includes(search) ||

            procurement.objeto
                ?.toLowerCase()
                .includes(search)
        );
    });

    const { totalPages, currentItems } = paginateItems(
        filteredProcurements,
        currentPage,
        itemsPerPage
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowFilter(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);


    return (
        <div className="page">
            <Sidebar/>

            <div className="content">
                <div className="top-bar">
                    <Input
                        placeholder="Buscar..."
                        icon={Search}
                        className="input-search"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />

                    <div className="filter-container" ref={dropdownRef}>
                        <button
                            className={`filter-btn ${
                                selectedStatus || selectedTipo || selectedOrigem ? "active" : ""
                            }`}
                            onClick={() => setShowFilter(!showFilter)}
                        >
                            <Funnel size={80} />
                        </button>

                        {showFilter && (
                            <div className="dropdown-filter">
                                <div className="filter-section">
                                    <h3 className="section-title">Status</h3>

                                    <div className="filter-grid status-grid">
                                        {statusOptions.map((status) => (
                                            <button
                                                key={status.label}
                                                className={`filter-pill status-pill ${
                                                    status.extraClass || ""
                                                } ${
                                                    selectedStatus === status.value ? "active" : ""
                                                }`}
                                                onClick={() =>
                                                    toggleFilter(
                                                        selectedStatus,
                                                        status.value,
                                                        setSelectedStatus
                                                    )
                                                }
                                            >
                                                <span>{status.label}</span>
                                                <span
                                                    className={`status-dot ${status.dotClass}`}
                                                ></span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="filter-section">
                                    <h3 className="section-title">Tipo de Licitação</h3>

                                    <div className="filter-grid type-grid">
                                        {tipoOptions.map((tipo) => (
                                            <button
                                                key={tipo.value}
                                                className={`filter-pill type-pill ${
                                                    selectedTipo === tipo.value ? "active" : ""
                                                }`}
                                                onClick={() =>
                                                    toggleFilter(
                                                        selectedTipo,
                                                        tipo.value,
                                                        setSelectedTipo
                                                    )
                                                }
                                            >
                                                {tipo.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="filter-section">
                                    <h3 className="section-title">Origem</h3>

                                    <div className="filter-grid origin-grid">
                                        {secretariaOptions.map((origin) => (
                                            <button
                                                key={origin.value}
                                                title={origin.label}
                                                className={`filter-pill origin-pill ${
                                                    selectedOrigem === origin.value ? "active" : ""
                                                }`}
                                                onClick={() =>
                                                    toggleFilter(
                                                        selectedOrigem,
                                                        origin.value,
                                                        setSelectedOrigem
                                                    )
                                                }
                                            >
                                                {origin.value}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="filter-actions">
                                    <button
                                        className="clear-filter-btn"
                                        onClick={clearFilters}
                                    >
                                        Limpar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <Button
                        className="btn-New"
                        variant="primary"
                        onClick={irParaSelecao}
                    >
                        <PlusCircle size={18} />
                        Nova Licitação
                    </Button>
                </div>

                <div className="pagination-modern">
                    <span className="page-info">
                        {currentPage} of {totalPages}
                    </span>

                    <div className="page-controls">
                        <button
                            className="page-btn"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <button
                            className="page-btn"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                        <tr>
                            <th>Número/Ano</th>
                            <th>Tipo</th>
                            <th>Origem</th>
                            <th>Publicação</th>
                            <th>Abertura</th>
                            <th>Status</th>
                        </tr>
                        </thead>

                        <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item) => {

                                const currentStatus = getCurrentProcurementStatus(item);

                                return (
                                    <tr
                                        key={item.id}
                                        className="table-row-clickable"
                                        onClick={() =>
                                            navigate(`/procurements/${item.id}`, {
                                                state: { from: "/procurements" },
                                            })
                                        }
                                    >
                                        <td>{item.numero}/{item.ano}</td>
                                        <td>{getOptionLabel(PROCUREMENT_TYPES, item.tipo)}</td>
                                        <td title={getOptionLabel(SECRETARIAS, item.origem)}>
                                            {item.origem}
                                        </td>
                                        <td>{item.publicacao}</td>
                                        <td>{item.abertura}</td>
                                        <td>
                                            <span
                                                className="status-dot"
                                                style={{
                                                    backgroundColor: getStatusColor(currentStatus),
                                                }}
                                            ></span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6">
                                    {loading
                                        ? "Carregando licitações..."
                                        : error || "Nenhuma licitação encontrada."}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ProcurementList;
