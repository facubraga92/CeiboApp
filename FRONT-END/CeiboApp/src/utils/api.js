import axios from "axios";
import { toast } from "react-toastify";

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
