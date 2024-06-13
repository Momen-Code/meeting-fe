import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../../provider";

//Styles
import "./style.scss";

const AddUser = ({ visible, setVisible }) => {
  const { setIsLoading, createNotification } = useAppContext();
  const [formObj, setFormObj] = useState({
    name: "",
    rank: "",
    notes: "",
  });
  useEffect(() => {
    if (visible)
      setFormObj({
        name: "",
        rank: "",
        notes: "",
      });
  }, [visible]);

  const floatingBoxRef = useRef(null);

  return (
    visible && (
      <div className="add-user-container">
        <div className="form-container" ref={floatingBoxRef}>
          <div className="closing" onClick={() => setVisible(false)}>
            <span></span>
            <span></span>
          </div>
          <form
            method="POST"
            onSubmit={async (e) => {
              e.preventDefault();

              if (!formObj.rank || formObj.rank === "") {
                createNotification("يجب كتابة الرتبة", "warning");
                return;
              }
              if (!formObj.name || formObj.name === "") {
                createNotification("يجب كتابة الاسم", "warning");
                return;
              }
              try {
                setIsLoading(true);

                const result = await axios.post(
                  `http://localhost:5000/web/attendance`,
                  formObj,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem(
                        "access_token"
                      )}`,
                    },
                  }
                );
                if (result.data.success) {
                  setVisible(false);
                }
              } catch (error) {
                createNotification(error, "error");
              } finally {
                setIsLoading(false);
              }
            }}
          >
            <div>
              <label>الرتبة</label>
              <br />
              <div className="selectContainer">
                <select
                  id="selectBox655"
                  value={formObj.rank}
                  onChange={(e) =>
                    setFormObj({ ...formObj, rank: e.target.value })
                  }
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
            <div className="input-container">
              <label>الاسم</label>
              <input
                type="text"
                name="name"
                placeholder="الاسم"
                onChange={(e) =>
                  setFormObj({ ...formObj, name: e.target.value })
                }
              />
            </div>
            <div className="input-container">
              <label>ملاحظات</label>
              <input
                type="text"
                name="notes"
                placeholder="ملاحظات"
                onChange={(e) =>
                  setFormObj({ ...formObj, notes: e.target.value })
                }
              />
            </div>

            <div className="btn-container">
              <button type="submit">إضافة</button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddUser;
