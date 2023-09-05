import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAnimalsStart } from "../redux/animalSlice";

function HomeContainer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAnimalsStart());
  }, [dispatch]);
}
export default HomeContainer;
