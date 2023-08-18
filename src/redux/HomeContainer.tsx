import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAnimalsStart, selectAnimals, selectLoading, selectError } from "../redux/animalSlice";
import Home from "../pages/Home";

function HomeContainer() {
  const dispatch = useDispatch();

  const animals = useSelector(selectAnimals);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchAnimalsStart());
  }, [dispatch]);

  // return <Home animals={animals} loading={loading} error={error} />;
}
export default HomeContainer;
