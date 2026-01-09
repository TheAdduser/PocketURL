import { useEffect } from "react";
import { useParams } from "react-router";
import { API_URL, FRONTEND_URL } from "~/constants";

export default function URL() {
  const params = useParams();
  useEffect(() => {
    if (params?.url) {
      window.location.replace(`${API_URL}/${params.url}`);
    }
  }, []);
  return (
    <div className="text-black">
        URL Loading...
    </div>
  );
}