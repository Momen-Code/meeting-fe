import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Layout, Table } from "../../components";
import { useAppContext } from "../../provider";
//Styles
import "./style.scss";
import AddUser from "../../components/AddUser";

const AssistantDashboard = () => {
  const { setIsLoading, createNotification } = useAppContext();
  // const [statistics, setStatistics] = useState({
  //   admin_status: "on",
  // });
  const [filters, setFilters] = useState({
    rank: "",
    name: "",
    status: "",
    date: new Date().toISOString(),
  });

  const [visible, setVisible] = useState(false);

  const columns = useMemo(() => {
    const columns = [
      { title: "المسلسل", selector: (row, index) => `${index + 1}` },
      { title: "الرتبة/الدرجة", selector: (row) => row.rank ?? "ـــ" },
      { title: "الاسم", selector: (row) => row.name ?? "ـــ" },
      {
        title: "ملاحظات",
        selector: (row) => row.notes ?? "ـــ",
      },
      {
        title: "الحالة",
        selector: (row) => (
          <div className={`statusContainer ${row.status}`}>
            {(row.status === "pending"
              ? "في انتظار الرد"
              : row.status === "accepted"
              ? "مقبول"
              : "مرفوض") ?? "ـــ"}
          </div>
        ),
      },
    ];

    return columns;
  }, []);

  // const fetchData = async () => {
  //   try {
  //     setIsLoading(true);
  //     const result = await axios.get(
  //       `http://localhost:5000/assistant/statistics`,
  //       {
  //         params: filters,
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //         },
  //       }
  //     );
  //     if (result.data.success) {
  //       const { admin_status } = result.data.data;
  //       setStatistics({
  //         admin_status,
  //       });
  //     }
  //   } catch (error) {
  //     createNotification(error, "error");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   // fetchData();
  // }, [filters]);

  return (
    <Layout>
      <div style={{ textAlign: "center" }}>
        <button onClick={() => setVisible(true)}>اضافة</button>
      </div>
      <div className="filtersContainer">
        <div>
          <label>التاريخ</label>
          <br />
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
        </div>
        <div>
          <label>الرتبة</label>
          <br />
          <div className="selectContainer">
            <select
              id="selectBox655"
              value={filters.rank}
              onChange={(e) => setFilters({ ...filters, rank: e.target.value })}
            >
              <option value="" disabled selected>
                الرتبة
              </option>
              <option value="">الكل</option>
              <option value="مدني">مدني</option>
              <option value="جندي">جندي</option>
              <option value="عريف">عريف</option>
              <option value="رقيب">رقيب</option>
              <option value="رقيب اول">رقيب اول</option>
              <option value="مساعد">مساعد</option>
              <option value="مساعد أول">مساعد أول</option>
              <option value="ملازم">ملازم</option>
              <option value="ملازم أول">ملازم أول</option>
              <option value="نقيب">نقيب</option>
              <option value="رائد">رائد</option>
              <option value="مقدم">مقدم</option>
              <option value="عقيد">عقيد</option>
              <option value="عميد">عميد</option>
              <option value="لواء">لواء</option>
              <option value="فريق">فريق</option>
            </select>
          </div>
        </div>
        <>
          <div>
            <label>الاسم</label>
            <br />
            <input
              type="text"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
          </div>
        </>

        <div>
          <label>الحالة</label>
          <br />
          <div className="selectContainer">
            <select
              id="selectBox6"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="" disabled selected>
                اختر الحالة
              </option>
              <option value="">الكل</option>
              <option value="pending">في انتظار الرد</option>
              <option value="accepted">مقبول</option>
              <option value="rejected">مرفوض</option>
            </select>
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        keyValue={"waitingList"}
        filters={filters}
        endPoint={"http://localhost:5000/web/attendance"}
      />
      <AddUser visible={visible} setVisible={setVisible} />
    </Layout>
  );
};

export default AssistantDashboard;
