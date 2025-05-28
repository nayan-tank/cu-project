import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UnauthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return null; // Render nothing
}

export default UnauthPage;
