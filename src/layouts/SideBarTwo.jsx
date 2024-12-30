import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faBars, faUser, faMoon, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "../assets/styles/sidebar/header.css";
import "../assets/styles/sidebar/sidebar.css";
import perfil from "../assets/img/perfil.png";

const SideBarTwo = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorage.getItem("selected-theme") === "dark"
  );

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
    document.querySelector(".main").classList.toggle("left-pd", !isSidebarVisible);

  };

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    document.body.classList.toggle("dark-theme", newTheme);

    localStorage.setItem("selected-theme", newTheme ? "dark" : "light");
    localStorage.setItem("selected-icon", newTheme ? "ri-moon-clear-fill" : "ri-sun-fill");
  };

  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [isDarkTheme]);

  // Link ativo
  const handleActiveLink = (e) => {
    document.querySelectorAll(".sidebar_link").forEach((link) => {
      link.classList.remove("active-link");
    });
    e.currentTarget.classList.add("active-link");
  };

  return (
    <>
      <header className={`header ${isSidebarVisible ? "left-pd" : ""}`}>
        <div className={`header_container `}>
          <a href="#" className="header_logo">
            <FontAwesomeIcon icon={faBuilding} className="header_logo_icon" />
            <span>ADI</span>
          </a>
          <button className="header_toggle" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} className="header_toggle_icon" />
          </button>
        </div>
      </header>

      <nav className={`sidebar ${isSidebarVisible ? "show_sidebar" : ""}`}>
        <div className="sidebar_container">
          <div className="sidebar_user">
            <div className="sidebar_img">
              <img src={perfil} alt="perfil" />
            </div>
            <div className="sidebar_info">
              <h3>Gustavo</h3>
              <span>gustavo@gmail.com</span>
            </div>
          </div>

          <div className="sidebar_content">
            <div>
              <h3 className="sidebar_title">Usuário</h3>
              <div className="sidebar_list">
                <a href="#" className="sidebar_link" onClick={handleActiveLink}>
                  <FontAwesomeIcon icon={faUser} />
                  <span>Usuário</span>
                </a>
                <a href="#" className="sidebar_link" onClick={handleActiveLink}>
                  <FontAwesomeIcon icon={faUser} />
                  <span>Usuário</span>
                </a>
                <a href="#" className="sidebar_link" onClick={handleActiveLink}>
                  <FontAwesomeIcon icon={faUser} />
                  <span>Usuário</span>
                </a>
                <a href="#" className="sidebar_link" onClick={handleActiveLink}>
                  <FontAwesomeIcon icon={faUser} />
                  <span>Usuário</span>
                </a>
              </div>
            </div>
            <div>
              <h3 className="sidebar_title">Usuário</h3>
              <div className="sidebar_list">
                <a href="#" className="sidebar_link" onClick={handleActiveLink}>
                  <FontAwesomeIcon icon={faUser} />
                  <span>Usuário</span>
                </a>
                <a href="#" className="sidebar_link" onClick={handleActiveLink}>
                  <FontAwesomeIcon icon={faUser} />
                  <span>Usuário</span>
                </a>
                <a href="#" className="sidebar_link" onClick={handleActiveLink}>
                  <FontAwesomeIcon icon={faUser} />
                  <span>Usuário</span>
                </a>
                <a href="#" className="sidebar_link" onClick={handleActiveLink}>
                  <FontAwesomeIcon icon={faUser} />
                  <span>Usuário</span>
                </a>
              </div>
            </div>
          </div>

          <div className="sidebar_actions">
            <button className="btn-side sidebar_icon" onClick={toggleTheme}>
              <FontAwesomeIcon icon={faMoon} />
              <span>Tema</span>
            </button>
            <button className="btn-side sidebar_link">
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span>Desconectar</span>
            </button>
          </div>
        </div>
      </nav>

      <main className={`main container-main ${isSidebarVisible ? "left-pd" : ""}`}>
        <h1>Sidebar</h1>
      </main>
    </>
  );
};

export default SideBarTwo;
