import React from "react";
import { Layout } from "../../components";

//Styles
import "./style.scss";
import { Link } from "react-router-dom";
const UserType = () => {
  return (
    <Layout>
      <div className="userTypeContainer">
        <h1>المتابعة كـــ</h1>
        <div className="actions">
          <div>
            <Link to={"/assistant-dashboard"}>متابعة القائد</Link>
          </div>
          <div>
            <Link to={"/login"}>قائد المركز</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserType;
