import axios from "axios";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import { envs } from "../config/env/env.config";

const { VITE_BACKEND_URL } = envs;

export const userMe = async () => {
  try {
    const { data } = await axios.get("http://localhost:3000/api/users/me", {
      withCredentials: true,
      credentials: "include",
    });
    return data;
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return null;
  }
};
/*

const [user, setUser] = useState(null);
  useEffect(() => {
    const handle = async () => {
      const user = await userMe();
      return setUser(user);
    };
    handle();
  }, []);
  
*/

export const useCredentials = {
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  credentials: "include",
};

/*

const handleChange = (event) => {
  const { name, value } = event.target;
  if (value === "") {
    setInputs((current) => {
      const { [name]: _, ...rest } = current;
      return rest;
    });
  } else {
    return setInputs((values) => ({ ...values, [name]: value }));
  }
  return;
};

*/
export function toastSuccess(mess) {
  toast.success(`${mess}`, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
}

export function toastError(mess) {
  toast.error(`${mess}`, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
}

export function getCookieValue(cookieName) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === cookieName) {
      return decodeURIComponent(value);
    }
  }
  return;
}

export function getUserByToken() {
  const token = getCookieValue("token");
  if (!token) return token;
  return jwtDecode(token);
}

export async function getAllClients() {
  const { data } = await axios.get(`${VITE_BACKEND_URL}/customers/all`);
  return data;
}
