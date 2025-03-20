import React, { useState, useEffect, useRef } from "react";
import "./InfiniteReloading.scss";

const Data = [
  { id: 1, name: "Alice", age: 25, email: "alice@example.com" },
  { id: 2, name: "Bob", age: 30, email: "bob@example.com" },
  { id: 3, name: "Charlie", age: 35, email: "charlie@example.com" },
  { id: 4, name: "David", age: 40, email: "david@example.com" },
  { id: 5, name: "Emma", age: 28, email: "emma@example.com" },
  { id: 6, name: "Frank", age: 33, email: "frank@example.com" },
  { id: 7, name: "Grace", age: 27, email: "grace@example.com" },
  { id: 8, name: "Hannah", age: 32, email: "hannah@example.com" },
  { id: 9, name: "Ian", age: 29, email: "ian@example.com" },
  { id: 10, name: "Jack", age: 31, email: "jack@example.com" },
  { id: 11, name: "Kate", age: 26, email: "kate@example.com" },
  { id: 12, name: "Leo", age: 34, email: "leo@example.com" },
  { id: 13, name: "Mia", age: 25, email: "mia@example.com" },
  { id: 14, name: "Noah", age: 29, email: "noah@example.com" },
  { id: 15, name: "Olivia", age: 30, email: "olivia@example.com" },
  { id: 16, name: "Paul", age: 37, email: "paul@example.com" },
  { id: 17, name: "Quinn", age: 28, email: "quinn@example.com" },
  { id: 18, name: "Ryan", age: 36, email: "ryan@example.com" },
  { id: 19, name: "Sophia", age: 27, email: "sophia@example.com" },
  { id: 20, name: "Tom", age: 35, email: "tom@example.com" },
  { id: 10, name: "Jack", age: 31, email: "jack@example.com" },
  { id: 11, name: "Kate", age: 26, email: "kate@example.com" },
  { id: 12, name: "Leo", age: 34, email: "leo@example.com" },
  { id: 13, name: "Mia", age: 25, email: "mia@example.com" },
  { id: 14, name: "Noah", age: 29, email: "noah@example.com" },
  { id: 15, name: "Olivia", age: 30, email: "olivia@example.com" },
  { id: 16, name: "Paul", age: 37, email: "paul@example.com" },
  { id: 17, name: "Quinn", age: 28, email: "quinn@example.com" },
  { id: 18, name: "Ryan", age: 36, email: "ryan@example.com" },
  { id: 19, name: "Sophia", age: 27, email: "sophia@example.com" },
  { id: 20, name: "Tom", age: 35, email: "tom@example.com" },
  { id: 10, name: "Jack", age: 31, email: "jack@example.com" },
  { id: 11, name: "Kate", age: 26, email: "kate@example.com" },
  { id: 12, name: "Leo", age: 34, email: "leo@example.com" },
  { id: 13, name: "Mia", age: 25, email: "mia@example.com" },
  { id: 14, name: "Noah", age: 29, email: "noah@example.com" },
  { id: 15, name: "Olivia", age: 30, email: "olivia@example.com" },
  { id: 16, name: "Paul", age: 37, email: "paul@example.com" },
  { id: 17, name: "Quinn", age: 28, email: "quinn@example.com" },
  { id: 18, name: "Ryan", age: 36, email: "ryan@example.com" },
  { id: 19, name: "Sophia", age: 27, email: "sophia@example.com" },
  { id: 20, name: "Tom", age: 35, email: "tom@example.com" },
  { id: 10, name: "Jack", age: 31, email: "jack@example.com" },
  { id: 11, name: "Kate", age: 26, email: "kate@example.com" },
  { id: 12, name: "Leo", age: 34, email: "leo@example.com" },
  { id: 13, name: "Mia", age: 25, email: "mia@example.com" },
  { id: 14, name: "Noah", age: 29, email: "noah@example.com" },
  { id: 15, name: "Olivia", age: 30, email: "olivia@example.com" },
  { id: 16, name: "Paul", age: 37, email: "paul@example.com" },
  { id: 17, name: "Quinn", age: 28, email: "quinn@example.com" },
  { id: 18, name: "Ryan", age: 36, email: "ryan@example.com" },
  { id: 19, name: "Sophia", age: 27, email: "sophia@example.com" },
  { id: 20, name: "Tom", age: 35, email: "tom@example.com" },
  { id: 10, name: "Jack", age: 31, email: "jack@example.com" },
  { id: 11, name: "Kate", age: 26, email: "kate@example.com" },
  { id: 12, name: "Leo", age: 34, email: "leo@example.com" },
  { id: 13, name: "Mia", age: 25, email: "mia@example.com" },
  { id: 14, name: "Noah", age: 29, email: "noah@example.com" },
  { id: 15, name: "Olivia", age: 30, email: "olivia@example.com" },
  { id: 16, name: "Paul", age: 37, email: "paul@example.com" },
  { id: 17, name: "Quinn", age: 28, email: "quinn@example.com" },
  { id: 18, name: "Ryan", age: 36, email: "ryan@example.com" },
  { id: 19, name: "Sophia", age: 27, email: "sophia@example.com" },
  { id: 20, name: "Tom", age: 35, email: "tom@example.com" },
  { id: 10, name: "Jack", age: 31, email: "jack@example.com" },
  { id: 11, name: "Kate", age: 26, email: "kate@example.com" },
  { id: 12, name: "Leo", age: 34, email: "leo@example.com" },
  { id: 13, name: "Mia", age: 25, email: "mia@example.com" },
  { id: 14, name: "Noah", age: 29, email: "noah@example.com" },
  { id: 15, name: "Olivia", age: 30, email: "olivia@example.com" },
  { id: 16, name: "Paul", age: 37, email: "paul@example.com" },
  { id: 17, name: "Quinn", age: 28, email: "quinn@example.com" },
  { id: 18, name: "Ryan", age: 36, email: "ryan@example.com" },
  { id: 19, name: "Sophia", age: 27, email: "sophia@example.com" },
  { id: 20, name: "Tom", age: 35, email: "tom@example.com" },
  { id: 10, name: "Jack", age: 31, email: "jack@example.com" },
  { id: 11, name: "Kate", age: 26, email: "kate@example.com" },
  { id: 12, name: "Leo", age: 34, email: "leo@example.com" },
  { id: 13, name: "Mia", age: 25, email: "mia@example.com" },
  { id: 14, name: "Noah", age: 29, email: "noah@example.com" },
  { id: 15, name: "Olivia", age: 30, email: "olivia@example.com" },
  { id: 16, name: "Paul", age: 37, email: "paul@example.com" },
  { id: 17, name: "Quinn", age: 28, email: "quinn@example.com" },
  { id: 18, name: "Ryan", age: 36, email: "ryan@example.com" },
  { id: 19, name: "Sophia", age: 27, email: "sophia@example.com" },
  { id: 20, name: "Tom", age: 35, email: "tom@example.com" },
];

function InfiniteReloading() {
  const [visibleData, setVisibleData] = useState(Data.slice(0, 5));
  const [loading, setLoading] = useState(false);
  const [endReached, setEndReached] = useState(false);
  const observerRef = useRef(null);
  const tbodyRef = useRef(null);

  const loadMoreData = () => {
    if (loading || endReached) return;

    setLoading(true);

    setTimeout(() => {
      const currentLength = visibleData.length;
      const nextItems = Data.slice(currentLength, currentLength + 5);

      if (nextItems.length === 0) {
        setEndReached(true);
      } else {
        setVisibleData((prev) => [...prev, ...nextItems]);
      }

      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    let observer;

    if (observerRef.current && tbodyRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !loading && !endReached) {
            loadMoreData();
          }
        },
        {
          root: tbodyRef.current, // Set the tbody as the viewport for intersection
          rootMargin: "0px",
          threshold: 0.1, // Trigger when 10% of the sentinel is visible
        }
      );

      observer.observe(observerRef.current);
    }

    return () => {
      if (observer && observerRef.current) {
        observer.unobserve(observerRef.current);
        observer.disconnect();
      }
    };
  }, [loading, endReached, visibleData.length]);

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody ref={tbodyRef}>
          {visibleData.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td>{d.age}</td>
              <td>{d.email}</td>
            </tr>
          ))}

          {!endReached && (
            <tr ref={observerRef} className="loading-sentinel">
              <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
                {loading ? "Loading more data..." : ""}
              </td>
            </tr>
          )}

          {endReached && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
                You've reached the end of the list.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default InfiniteReloading;
