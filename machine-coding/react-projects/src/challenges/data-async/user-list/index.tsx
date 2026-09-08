import { useEffect, useState } from "react";

const url = "https://jsonplaceholder.typicode.com/users";
const options = {
  method: "GET",
};
export default function UserList() {
  const [userState, setUserState] = useState({
    loading: false,
    data: [],
    error: null,
  });
  useEffect(() => {
    const controller = new AbortController();
    console.log(controller);
    async function fetchData() {
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });
             if (!response.ok) {
               throw new Error("Failed to fetch users");
             }

        const data = await response.json();
        console.log(data);
        setUserState({
          loading: false,
          data: data,
          error: null,
        });
      } catch (error) {
          if (error.name === "AbortError") {
            return;
          }

        setUserState({
          loading: true,
          data: [],
          error: error,
        });
      } finally {
        setUserState((prev) => {
          return {
            ...prev,
            loading: false,
          };
        });
      }
    }

    fetchData();

    return () => controller.abort();
  }, []);

  console.log(userState);

  return (
    <div>
      {/* loading */}
      {userState.loading && <>Loading...</>}
      {/* error */}
      {userState.error && <>{userState.error}</>}
      {/* data */}
      {userState.data.map((user) => {
        return <>{user.name}</>;
      })}
    </div>
  );
}
