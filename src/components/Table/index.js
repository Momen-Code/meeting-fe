import axios from "axios";
import React, { useEffect, useRef, useState, useContext } from "react";
import InfinitScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "react-query";
import PropagateLoader from "react-spinners/PropagateLoader";
import { useAppContext } from "../../provider";
import { SocketContext } from "../../socket";
import notificationSound from "../../assets/audio/bell-ring-199839.mp3";

//Styles
import "./style.scss";

const Table = ({ columns, keyValue, filters, endPoint, visible }) => {
  const { setIsLoading, isLoading } = useAppContext();
  const socket = useContext(SocketContext);
  const [numberOfRecords, setNumberOfRecords] = useState(0);
  const [audio] = useState(new Audio(notificationSound)); // Create an Audio element with the notification sound

  const scrollableRef = useRef(null);
  const {
    data,
    refetch,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading: loading,
  } = useInfiniteQuery(
    [keyValue, 1],
    async ({ pageParam = 1 }) => {
      try {
        setIsLoading(true);
        const result = await axios.get(endPoint, {
          params: {
            ...filters,
            page: pageParam,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setNumberOfRecords(result.data.numberOfRecords);
        setIsLoading(false);

        return result.data.data;
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    },
    {
      keepPreviousData: true,
      enabled: true,
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length < 10) {
          return undefined;
        } else {
          const prev = pages.reduce((acc, curr) => [...acc, ...curr]);
          if (prev.length === numberOfRecords) {
            return undefined;
          } else {
            return pages?.length + 1;
          }
        }
      },
    }
  );
  const finalData =
    data?.pages?.reduce((acc, curr) => [...acc, ...curr], []) || [];

  useEffect(() => {
    if (!socket) return;

    console.log("Socket initialized", socket);

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("userAdded", async (person) => {
      try {
        await refetch();
        playNotificationSound(); // Play the notification sound on userAdded event
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("statusUpdated", (update) => {
      refetch();
      playNotificationSound();
    });

    return () => {
      socket.off("connect");
      socket.off("userAdded");
      socket.off("statusUpdated");
    };
  }, [socket]);

  const playNotificationSound = () => {
    if (audio) {
      audio.play(); // Play the notification sound
    }
  };

  useEffect(() => {
    if (!data) {
      refetch();
    }
  });

  useEffect(() => {
    if (finalData?.length <= 10) {
      refetch();
    }
  }, [filters, endPoint, visible]);

  if (loading) {
    return (
      <div className="loading-container">
        <PropagateLoader size={16} color="#4397df" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="error-container">
        <h1>حدث خطأ اثناء تحميل البيانات</h1>
      </div>
    );
  }

  return (
    <>
      <div className="count">العدد:{numberOfRecords}</div>
      <div className="tableContainer" ref={scrollableRef} id="scrollableDiv">
        <InfinitScroll
          dataLength={finalData?.length}
          next={fetchNextPage}
          scrollableTarget="scrollableDiv"
          hasMore={hasNextPage}
          loader={<PropagateLoader size={16} color="#4397df" />}
          endMessage={
            finalData?.length != 0 ? (
              <div className="loading-container">نهاية البيانات</div>
            ) : (
              <div className="loading-container">لا يوجد سجلات</div>
            )
          }
        >
          <table>
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index}>{column.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {finalData?.map((row, index) => (
                <tr key={index}>
                  {columns.map((column) => {
                    return (
                      <td key={column.title}>{column.selector(row, index)}</td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </InfinitScroll>
      </div>
    </>
  );
};

export default Table;
